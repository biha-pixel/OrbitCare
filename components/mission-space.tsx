"use client";
import { useEffect, useRef, useState } from "react";

// Original procedural artwork. No mission imagery, textures, telemetry or network requests.
const vertex = `attribute vec2 position; void main(){gl_Position=vec4(position,0.,1.);}`;
const fragment = `precision highp float;
uniform vec2 resolution; uniform float time;
float hash(vec3 p){p=fract(p*.3183099+vec3(.1,.2,.3));p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
float noise(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);}
float fbm(vec3 p){float a=.5,v=0.;for(int i=0;i<5;i++){v+=a*noise(p);p=p*2.03+vec3(1.2,3.1,2.8);a*=.5;}return v;}
void main(){vec2 uv=(gl_FragCoord.xy-.5*resolution)/resolution.y;
vec3 color=vec3(.018,.044,.074);float mist=fbm(vec3(uv*2.,.2));color+=vec3(.018,.032,.045)*mist;
vec2 cell=floor(uv*220.);float star=hash(vec3(cell,1.));color+=step(.997,star)*(.3+.5*star)*pow(1.-length(fract(uv*220.)-.5),5.);
vec2 center=vec2(.13,.02);float radius=.365;vec2 q=(uv-center)/radius;float r=dot(q,q);
color+=vec3(.04,.19,.3)*exp(-max(0.,length(q)-1.)*35.)*.34;
if(r<1.){vec3 n=vec3(q,sqrt(1.-r));float angle=time*.018-.4;vec3 p=vec3(n.x*cos(angle)+n.z*sin(angle),n.y,-n.x*sin(angle)+n.z*cos(angle));float land=fbm(p*4.1+vec3(3.7,1.2,2.));float terrain=fbm(p*19.);vec3 ocean=mix(vec3(.016,.09,.16),vec3(.026,.23,.31),terrain);vec3 ground=mix(vec3(.12,.23,.18),vec3(.35,.38,.24),terrain);vec3 base=mix(ocean,ground,smoothstep(.49,.54,land));float cloud=smoothstep(.57,.72,fbm(p*8.+vec3(time*.005,0.,0.)));base=mix(base,vec3(.82,.9,.9),cloud*.85);float ice=smoothstep(.84,.98,abs(p.y));base=mix(base,vec3(.8,.87,.9),ice);float light=max(0.,dot(n,normalize(vec3(-.9,.6,1.))));color=base*(.06+light*1.2);float rim=pow(1.-n.z,3.);color+=vec3(.13,.46,.68)*rim*(.2+light);}
vec2 mars=(uv-vec2(-.48,.29))/.045;float mr=dot(mars,mars);if(mr<1.){vec3 n=vec3(mars,sqrt(1.-mr));float shade=max(.12,dot(n,normalize(vec3(-1.,1.,1.))));color=mix(vec3(.29,.12,.07),vec3(.73,.37,.19),fbm(n*7.))*shade;}
gl_FragColor=vec4(color,1.);}`;

export default function MissionSpace({ paused }: { paused: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const elapsedTime = useRef(0);
  const [available, setAvailable] = useState(false);
  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    const gl = element.getContext("webgl", { alpha: false, antialias: false, powerPreference: "low-power", preserveDrawingBuffer: true });
    if (!gl) return;
    const shaders: WebGLShader[] = [];
    function compile(type: number, source: string) {
      const shader = gl!.createShader(type)!; shaders.push(shader); gl!.shaderSource(shader, source); gl!.compileShader(shader);
      return gl!.getShaderParameter(shader, gl!.COMPILE_STATUS) ? shader : null;
    }
    const program = gl.createProgram();
    const v = compile(gl.VERTEX_SHADER, vertex), f = compile(gl.FRAGMENT_SHADER, fragment);
    if (!program || !v || !f) { shaders.forEach(shader => gl.deleteShader(shader)); if (program) gl.deleteProgram(program); return; }
    gl.attachShader(program, v); gl.attachShader(program, f); gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { shaders.forEach(shader => gl.deleteShader(shader)); gl.deleteProgram(program); return; }
    gl.useProgram(program);
    const buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "position"); gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const size = gl.getUniformLocation(program, "resolution"), clock = gl.getUniformLocation(program, "time");
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0, visible = true, lost = false, previous = 0, elapsed = elapsedTime.current;
    function draw(timestamp = 0) {
      if (lost) return;
      const bounds = element!.getBoundingClientRect(), scale = Math.min(devicePixelRatio || 1, 1.5);
      const width = Math.max(1, Math.round(bounds.width * scale)), height = Math.max(1, Math.round(bounds.height * scale));
      if (element!.width !== width || element!.height !== height) { element!.width = width; element!.height = height; gl!.viewport(0, 0, width, height); }
      if (timestamp && previous) elapsed += Math.min(timestamp - previous, 100) / 1000;
      previous = timestamp;
      gl!.uniform2f(size, width, height); gl!.uniform1f(clock, elapsed); gl!.drawArrays(gl!.TRIANGLES, 0, 6);
      if (!paused && !preference.matches && visible && !document.hidden) frame = requestAnimationFrame(tick);
    }
    function tick(timestamp: number) { if (timestamp - previous < 50) { frame = requestAnimationFrame(tick); return; } draw(timestamp); }
    function restart() { cancelAnimationFrame(frame); previous = 0; draw(); }
    const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; restart(); }); observer.observe(element);
    const resize = new ResizeObserver(restart); resize.observe(element);
    function contextLost(event: Event) { event.preventDefault(); lost = true; cancelAnimationFrame(frame); setAvailable(false); }
    element.addEventListener("webglcontextlost", contextLost);
    document.addEventListener("visibilitychange", restart); preference.addEventListener("change", restart);
    draw(); setAvailable(true);
    return () => { elapsedTime.current = elapsed; cancelAnimationFrame(frame); observer.disconnect(); resize.disconnect(); document.removeEventListener("visibilitychange", restart); preference.removeEventListener("change", restart); element.removeEventListener("webglcontextlost", contextLost); gl.deleteBuffer(buffer); shaders.forEach(shader => gl.deleteShader(shader)); gl.deleteProgram(program); };
  }, [paused]);
  return <div className="mission-space" aria-hidden="true">
    <div className="space-fallback"><div className="fallback-stars" /><div className="fallback-earth" /><div className="fallback-mars" /></div>
    <canvas ref={canvas} className={available ? "space-canvas ready" : "space-canvas"} />
    <svg className="flight-plan" viewBox="0 0 720 540"><defs><linearGradient id="flight-line"><stop stopColor="#c59570" /><stop offset="1" stopColor="#91dacf" /></linearGradient></defs><ellipse cx="428" cy="270" rx="240" ry="122" transform="rotate(-30 428 270)" fill="none" stroke="#93c4cb" strokeOpacity=".22" /><path d="M126 102C160 330 388 445 550 280" fill="none" stroke="url(#flight-line)" strokeWidth="1.4" strokeDasharray="4 7" /><g transform="translate(300 330) rotate(-22)"><path d="M0-14L6 7 0 4-6 7Z" fill="#d9f6ef" /><path d="M-7 0h-13v6h13m14-6h13v6H7" fill="#688f9d" /></g><circle cx="126" cy="102" r="5" fill="none" stroke="#c59570" /><text x="146" y="105">Mars</text><path d="M520 432h105" stroke="#6e9baf" /><text x="526" y="453">Earth</text></svg>
  </div>;
}
