"""AI-assisted media tooling: add disclosed Kokoro speech to the existing silent video.

Run with the isolated artifacts/narrated-demo/venv Python. This never invokes the
visual renderer and refuses to overwrite the original MP4. Model/music inputs
and intermediate stems remain in ignored artifacts, outside app dependencies.
"""
from pathlib import Path
import argparse
import hashlib
import json
import re
import subprocess

ROOT = Path(__file__).resolve().parents[1]
WORK = ROOT / 'artifacts/narrated-demo'
CONFIG_PATH = ROOT / 'scripts/orbitcare-narration.json'
CONFIG = json.loads(CONFIG_PATH.read_text(encoding='utf-8'))


def run(args):
    result = subprocess.run([str(x) for x in args], cwd=ROOT, capture_output=True, text=True, encoding='utf-8')
    if result.returncode:
        raise RuntimeError(f'{args[0]} failed:\n{result.stderr}')
    return result


def digest(path):
    with Path(path).open('rb') as stream:
        return hashlib.file_digest(stream, 'sha256').hexdigest()


def probe(path):
    return json.loads(run(['ffprobe', '-v', 'error', '-show_format', '-show_streams', '-of', 'json', path]).stdout)


def timestamp(seconds, separator='.'):
    ms = round(seconds * 1000)
    return f'{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02}{separator}{ms%1000:03}'


def synthesize():
    import numpy as np
    import onnxruntime as ort
    import soundfile as sf
    from kokoro_onnx import Kokoro

    options = ort.SessionOptions()
    options.intra_op_num_threads = 4
    session = ort.InferenceSession(str(WORK/'sources/kokoro-v1.0.onnx'), options, providers=['CPUExecutionProvider'])
    tts = Kokoro.from_session(session, str(WORK/'sources/voices-v1.0.bin'))
    timeline = np.zeros(round(CONFIG['duration'] * 24000), dtype=np.float32)
    measured = []
    for cue in CONFIG['cues']:
        samples, rate = tts.create(cue.get('spoken', cue['text']), voice=CONFIG['voice'], speed=cue.get('speed', CONFIG['speed']), lang=CONFIG['language'])
        if rate != 24000:
            raise ValueError(f'Unexpected Kokoro sample rate: {rate}')
        active = np.flatnonzero(np.abs(samples) > .002)
        if not len(active):
            raise ValueError(f"Silent cue: {cue['id']}")
        samples = samples[max(0, active[0]-round(.025*rate)):min(len(samples), active[-1]+round(.07*rate))]
        duration = len(samples) / rate
        budget = cue['end'] - cue['start']
        if duration > budget:
            raise ValueError(f"Shorten cue {cue['id']}: {duration:.3f}s exceeds {budget:.3f}s. No automatic speed-up or truncation is allowed.")
        fade = min(round(.006*rate), len(samples)//2)
        samples[:fade] *= np.linspace(0, 1, fade)
        samples[-fade:] *= np.linspace(1, 0, fade)
        # Preserve phrase dynamics; normalize only the shared full speech track later.
        start = round(cue['start'] * rate)
        timeline[start:start+len(samples)] += samples
        sf.write(WORK/'stems'/f"{cue['id']}.wav", samples, rate, subtype='PCM_24')
        record = {**cue, 'actualEnd': round(cue['start'] + duration, 4), 'speechDuration': round(duration, 4), 'slotDuration': round(budget, 4)}
        measured.append(record)
        print(json.dumps(record), flush=True)
    sf.write(WORK/'narration-raw.wav', timeline, 24000, subtype='PCM_24')
    (WORK/'cue-timing.json').write_text(json.dumps(measured, indent=2)+'\n', encoding='utf-8')
    vtt = 'WEBVTT\n\n' + '\n\n'.join(f"{cue['id']}\n{timestamp(cue['start'])} --> {timestamp(cue['actualEnd'])}\n{cue['text']}" for cue in measured) + '\n'
    (ROOT/'public/demo/OrbitCare-narration.vtt').write_text(vtt, encoding='utf-8')


def loudness(path):
    result = run(['ffmpeg', '-hide_banner', '-nostats', '-i', path, '-map', '0:a:0', '-af', 'loudnorm=I=-16:TP=-1.5:LRA=7:print_format=json', '-f', 'null', '-'])
    return json.loads(re.findall(r'\{[^{}]*"input_i"[^{}]*\}', result.stderr, re.S)[-1])


def mix():
    source, output = ROOT/CONFIG['source'], ROOT/CONFIG['output']
    if source.resolve() == output.resolve():
        raise ValueError('The source silent video must remain untouched.')
    if len(probe(source)['streams']) != 1:
        raise ValueError('Expected the verified silent source with one video stream.')
    run(['ffmpeg', '-y', '-v', 'error', '-i', WORK/'narration-raw.wav', '-af',
         'highpass=f=75,lowpass=f=10500,loudnorm=I=-17:TP=-2:LRA=7,aresample=48000',
         '-ar', '48000', '-ac', '2', '-c:a', 'pcm_s24le', WORK/'narration.wav'])
    run(['ffmpeg', '-y', '-v', 'error', '-ss', CONFIG['music']['start'], '-i', ROOT/CONFIG['music']['file'], '-t', CONFIG['duration'], '-af',
         'atrim=duration=28,asetpts=PTS-STARTPTS,highpass=f=90,lowpass=f=7000,loudnorm=I=-31:TP=-6:LRA=7,aresample=48000,afade=t=in:st=0:d=1.1,afade=t=out:st=26.3:d=1.7',
         '-ar', '48000', '-ac', '2', '-c:a', 'pcm_s24le', WORK/'music-bed.wav'])
    # Speech drives the side chain. Voice band is clear; the bed recovers gently between phrases.
    # The measured first mix was -17.96 LUFS; +2 dB targets -16 LUFS with ample peak headroom.
    graph = '[0:a]asplit=2[voice][key];[1:a][key]sidechaincompress=threshold=0.018:ratio=5:attack=18:release=420:makeup=1[compressed];[compressed]asplit=2[ducked][bed];[voice][ducked]amix=inputs=2:duration=first:normalize=0,volume=2dB,alimiter=limit=0.8414:attack=5:release=60:level=false,afade=t=out:st=27.82:d=0.18[mix]'
    run(['ffmpeg', '-y', '-v', 'error', '-i', WORK/'narration.wav', '-i', WORK/'music-bed.wav', '-filter_complex', graph, '-map', '[mix]', '-ar', '48000', '-ac', '2', '-c:a', 'pcm_s24le', WORK/'mix.wav', '-map', '[bed]', '-ar', '48000', '-ac', '2', '-c:a', 'pcm_s24le', WORK/'music-ducked.wav'])
    disclosure = ('AI-generated English narration: Kokoro-82M v1.0, voice '+CONFIG['voice']+'. '+CONFIG['music']['credit']+'. '+CONFIG['music']['source']+' ; '+CONFIG['music']['license']+' . Music edited: '+CONFIG['music']['changes']+'. Existing application visuals unchanged. Synthetic monitoring; research prototype, not diagnosis or treatment. Team: Bihandu Liyanage and Nesandu Liyanage.')
    run(['ffmpeg', '-y', '-v', 'error', '-i', source, '-i', WORK/'mix.wav', '-i', ROOT/'public/demo/OrbitCare-narration.vtt',
         '-map', '0:v:0', '-map', '1:a:0', '-map', '2:s:0', '-map_metadata', '0', '-c:v', 'copy',
         '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-ac', '2', '-c:s', 'mov_text', '-t', CONFIG['duration'],
         '-metadata', 'title=OrbitCare - narrated candidate (28 seconds)',
         '-metadata', 'artist=Bihandu Liyanage and Nesandu Liyanage - OrbitCare team',
         '-metadata', 'composer=Scott Buckley', '-metadata', 'comment='+disclosure,
         '-metadata', 'description='+disclosure,
         '-metadata', 'copyright='+CONFIG['music']['credit']+'; '+CONFIG['music']['license'],
         '-metadata:s:a:0', 'language=eng', '-metadata:s:a:0', 'handler_name=AI-generated English narration (Kokoro) and licensed ambient music',
         '-metadata:s:s:0', 'language=eng', '-metadata:s:s:0', 'handler_name=English narration captions',
         '-disposition:s:0', '0', '-movflags', '+faststart+use_metadata_tags', output])


def verify():
    source, output = ROOT/CONFIG['source'], ROOT/CONFIG['output']
    info = probe(output)
    duration = float(info['format']['duration'])
    if not 27.9 <= duration < 30:
        raise AssertionError(f'Invalid duration: {duration}')
    video = next(x for x in info['streams'] if x['codec_type'] == 'video')
    audio = next(x for x in info['streams'] if x['codec_type'] == 'audio')
    assert (video['width'], video['height'], video['r_frame_rate']) == (1920, 1080, '30/1')
    assert audio['codec_name'] == 'aac' and int(audio['sample_rate']) == 48000 and audio['channels'] == 2
    hashes = {}
    frame_hashes = {}
    for name, path in [('silent', source), ('narrated', output)]:
        hashes[name] = run(['ffmpeg', '-v', 'error', '-i', path, '-map', '0:v:0', '-c:v', 'copy', '-f', 'hash', '-hash', 'sha256', '-']).stdout.strip()
        frame_hashes[name] = run(['ffmpeg', '-v', 'error', '-i', path, '-map', '0:v:0', '-f', 'hash', '-hash', 'sha256', '-']).stdout.strip()
    assert hashes['silent'] == hashes['narrated'], 'Compressed video stream changed.'
    assert frame_hashes['silent'] == frame_hashes['narrated'], 'Decoded pixels changed.'
    run(['ffmpeg', '-v', 'error', '-xerror', '-i', output, '-f', 'null', '-'])
    measures = loudness(output)
    assert float(measures['input_tp']) < -1, 'Insufficient true-peak headroom.'
    assert -20 <= float(measures['input_i']) <= -14, 'Unexpected integrated loudness.'
    report = {'duration': duration, 'sourceSha256': digest(source), 'fallbackSha256': digest(WORK/'OrbitCare-demo-silent.mp4'),
              'candidateSha256': digest(output), 'videoPacketHashes': hashes, 'decodedFrameHashes': frame_hashes,
              'unchangedCompressedVideo': hashes['silent'] == hashes['narrated'], 'unchangedDecodedPixels': frame_hashes['silent'] == frame_hashes['narrated'],
              'loudness': measures, 'audio': audio, 'video': video, 'metadata': info['format'].get('tags', {}),
              'fullDecodePassed': True, 'publicDeploymentChanged': False}
    assert report['sourceSha256'] == report['fallbackSha256'], 'Silent fallback changed.'
    (WORK/'verification.json').write_text(json.dumps(report, indent=2)+'\n', encoding='utf-8')
    print(json.dumps(report, indent=2), flush=True)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('step', choices=['synthesize', 'mix', 'verify', 'all'], default='all', nargs='?')
    args = parser.parse_args()
    WORK.mkdir(parents=True, exist_ok=True)
    (WORK/'stems').mkdir(exist_ok=True)
    for name, function in [('synthesize', synthesize), ('mix', mix), ('verify', verify)]:
        if args.step in [name, 'all']:
            function()
