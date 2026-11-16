# OrbitCare narrated demonstration candidate

The separate candidate is `public/demo/OrbitCare-demo-narrated.mp4`. It is **28.000 seconds**, 1920 x 1080, 30 fps, with the original H.264 visuals copied without re-encoding and 48 kHz stereo AAC audio. The existing `public/demo/OrbitCare-demo.mp4` remains the silent primary demonstration. An identical backup is at `artifacts/narrated-demo/OrbitCare-demo-silent.mp4`. The candidate is now publicly accessible for listening review; it has not replaced the official demo.

- [Public narrated MP4](https://orbitcare-eight.vercel.app/demo/OrbitCare-demo-narrated.mp4)
- [Public narrated/silent comparison and downloads](https://orbitcare-eight.vercel.app/demo/narrated-review.html)
- [Unchanged official silent MP4](https://orbitcare-eight.vercel.app/demo/OrbitCare-demo.mp4)

Repository-relative file: public/demo/OrbitCare-demo-narrated.mp4.

Open [the local comparison player](artifacts/narrated-demo/review.html) to compare both versions. While the local review server is running, use http://127.0.0.1:8767/artifacts/narrated-demo/review.html for external caption support.

## Narration and timing

AI-generated English narration uses **Kokoro-82M v1.0, af_heart**, generated locally through kokoro-onnx 0.6.1. The normal speed setting is 0.92; the short baseline phrase uses 0.82 to avoid a rushed transition. There is no time stretching, truncation or automatic speed-up. Forty words occupy approximately 17.90 seconds of speech, with pauses between scenes.

| Scene | Narration begins | Speech ends | Script |
| --- | --- | --- | --- |
| Deep-space context | 0.180 s | 1.231 s | Far from Earth. |
| Personal reference | 2.720 s | 4.494 s | Start with your own baseline. |
| Replay introduction | 5.260 s | 6.816 s | Mission Decision Replay. |
| Day-24 explanation | 8.340 s | 12.460 s | See sustained changes. Understand why a review is suggested. |
| Crew Assist | 13.320 s | 15.943 s | Crew Assist puts approved procedures first. |
| Separate NASA research | 16.780 s | 18.724 s | NASA research, kept separate. |
| Offline continuity | 19.910 s | 23.342 s | Disconnected? Keep reviewing, and save records locally. |
| Closing | 25.650 s | 27.048 s | A research prototype. |

All narration ends inside its existing scene. The original burned-in captions, actual application captures, AI artwork labels, scientific limitations and team information remain intact. Optional narration captions are embedded in the MP4 and supplied separately in `public/demo/OrbitCare-narration.vtt`. Both Bihandu Liyanage and Nesandu Liyanage are credited collectively in the candidate metadata and comparison player.

## Music and disclosure

Music: **"Decoherence" by Scott Buckley - released under CC BY 4.0. www.scottbuckley.com.au**. [Composer's source and permission](https://www.scottbuckley.com.au/library/decoherence/), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

The licensed 00:12-00:40 excerpt has equalization, entrance/exit fades, level adjustment and speech-driven ducking. It is not AI-generated music. The original full track is retained only as an ignored production input, not a public download. Keep the credit in the accompanying description when publishing, including a YouTube description if applicable.

`public/demo/OrbitCare-audio-credits.txt` supplies the complete AI-speech disclosure, music attribution, source/license links and editing description. These also appear in the comparison player and MP4 description/comment/copyright/audio-track metadata. [Kokoro model and Apache 2.0 declaration](https://huggingface.co/hexgrad/Kokoro-82M); [kokoro-onnx inference tooling, MIT](https://github.com/thewh1teagle/kokoro-onnx).

## Verification and remaining review

- FFprobe: 28.000 s, 840 frames, H.264/yuv420p 1920 x 1080 at 30 fps; AAC-LC stereo, 48 kHz, approximately 195 kb/s.
- Compressed video payload and the complete decoded pixel stream have identical SHA-256 hashes in the silent and narrated versions. The source MP4 and silent backup also match exactly. No application renderer was run.
- The final encoded mix measures **-15.86 LUFS integrated**, **-2.87 dBTP**, LRA 3.6 LU. Complete decoding succeeds; all 1,344,000 samples per channel are finite, with zero clipped samples.
- Each spoken cue remains at least **20.8 dB above the ducked music** by cue RMS. The first music samples fade in; the final 50 ms peak is below -72 dBFS.
- Independent local Whisper transcription recovers the exact 40-word sequence from both the speech stem and final MP4 after ignoring punctuation and case. This is an automated intelligibility check, not proof of natural delivery or pronunciation quality.
- Full real-time Chromium playback reaches 28 seconds with all 840 frames, zero dropped/corrupted frames, eight caption cues and decoded audio. Desktop playback captures were visually inspected; the mobile comparison page has no horizontal overflow.
- **Human listening review remains pending.** This agent cannot receive audio input, and the headless Windows playback context reported an unavailable audio endpoint. No claim is made that the agent heard or subjectively approved the voice, pronunciation, music or final mix. Audition the complete candidate on speakers/headphones before choosing it for publication.

The user-requested local comparison was opened in the normal system browser. The public candidate/comparison is supplied for review; **replacing the official silent demo still requires the user's approval**. No video was regenerated during this publication task.

Public deployment `dpl_DXBcBZUvsEUKLZw7pTVeiQTEFvCG` adds only the narrated MP4, narration VTT, credits text and comparison HTML to the existing static application. All 56 original application/media payloads were checked before and after publication. The prior hosted JavaScript included Vercel's opt-in toolbar suffix; its application-code prefix matched exactly. The added media and all 56 original artifact files now match the public files. Anonymous access, exact asset hashes, HTTP 206 byte-range downloads and complete 28-second public playback passed: 840 frames, zero dropped/corrupted frames, decoded audio, eight caption cues, no page errors. See `artifacts/narrated-app-publication/public-verification.json`, `originals-before.json` and `originals-after.json`. The original silent MP4's SHA-256 remains `8f18b1951d0e81b210ddab8540d4fc77212abd78f7cbb16f1407dc92146d6ef8`.

Evidence: `artifacts/narrated-demo/verification.json`, `audio-levels.json`, `speech-qc.json`, `cue-timing.json`, `playback-verification.json`, `playback-contact.png`, `mobile-review.png` and `sources/source-manifest.json`. The source/license pages and original production inputs are retained there.

## Reproduction

`scripts/orbitcare-narration.json` defines the source, output, voice, script, scene windows and licensed music excerpt. `scripts/render-narrated-demo.py` synthesizes the speech, mixes/ducks the audio, remuxes the existing visuals and verifies the result. Use an isolated Python environment with `scripts/narration-requirements.txt`; no application/runtime dependency was added. The local production inputs must be present under `artifacts/narrated-demo/sources/` as recorded by the source manifest.

From the repository root in PowerShell:

```powershell
.\artifacts\narrated-demo\venv\Scripts\python.exe scripts/render-narrated-demo.py all
```

Subcommands `synthesize`, `mix` and `verify` support focused work. A cue that exceeds its allowed window fails instead of being clipped or accelerated. Regenerating neural audio can cause small waveform/timing differences; repeat verification after any regeneration. The script refuses to use the same source and output path.

For packaging only, `node scripts/prepare-narration-review.mjs --additive-app` copies the existing static application and adds the four review assets, refusing changes to existing files. It does not regenerate media. The earlier `artifacts/narrated-publication/` media-only trial lacks the application and must never be promoted onto the official app domain.
