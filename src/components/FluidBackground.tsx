"use client";

import { useEffect, useRef } from "react";

/**
 * Liquid ink background (WebGL2 Navier–Stokes fluid), tuned for the light theme.
 * Ink is drawn with alpha so it floats over the pale page and is refracted by the glass panels.
 * Reacts to mouse, touchpad, touch and scroll. Falls back silently if WebGL2 float targets are unavailable.
 */

const BASE_VERT = `#version 300 es
precision highp float;
in vec2 aPosition;
out vec2 vUv; out vec2 vL; out vec2 vR; out vec2 vT; out vec2 vB;
uniform vec2 texelSize;
void main () {
  vUv = aPosition * 0.5 + 0.5;
  vL = vUv - vec2(texelSize.x, 0.0);
  vR = vUv + vec2(texelSize.x, 0.0);
  vT = vUv + vec2(0.0, texelSize.y);
  vB = vUv - vec2(0.0, texelSize.y);
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

const HEAD = `#version 300 es
precision highp float; precision highp sampler2D;
in vec2 vUv; in vec2 vL; in vec2 vR; in vec2 vT; in vec2 vB;
out vec4 outColor;
`;

const FRAG = {
  clear: HEAD + `uniform sampler2D uTexture; uniform float value;
    void main () { outColor = value * texture(uTexture, vUv); }`,

  splat: HEAD + `uniform sampler2D uTarget; uniform float aspectRatio; uniform vec3 color; uniform vec2 point; uniform float radius;
    void main () {
      vec2 p = vUv - point.xy; p.x *= aspectRatio;
      vec3 splat = exp(-dot(p, p) / radius) * color;
      outColor = vec4(texture(uTarget, vUv).xyz + splat, 1.0);
    }`,

  advection: HEAD + `uniform sampler2D uVelocity; uniform sampler2D uSource; uniform vec2 texelSize; uniform float dt; uniform float dissipation;
    void main () {
      vec2 coord = vUv - dt * texture(uVelocity, vUv).xy * texelSize;
      vec4 result = texture(uSource, coord);
      outColor = result / (1.0 + dissipation * dt);
    }`,

  divergence: HEAD + `uniform sampler2D uVelocity;
    void main () {
      float L = texture(uVelocity, vL).x; float R = texture(uVelocity, vR).x;
      float T = texture(uVelocity, vT).y; float B = texture(uVelocity, vB).y;
      vec2 C = texture(uVelocity, vUv).xy;
      if (vL.x < 0.0) { L = -C.x; } if (vR.x > 1.0) { R = -C.x; }
      if (vT.y > 1.0) { T = -C.y; } if (vB.y < 0.0) { B = -C.y; }
      outColor = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
    }`,

  curl: HEAD + `uniform sampler2D uVelocity;
    void main () {
      float L = texture(uVelocity, vL).y; float R = texture(uVelocity, vR).y;
      float T = texture(uVelocity, vT).x; float B = texture(uVelocity, vB).x;
      outColor = vec4(0.5 * (R - L - T + B), 0.0, 0.0, 1.0);
    }`,

  vorticity: HEAD + `uniform sampler2D uVelocity; uniform sampler2D uCurl; uniform float curl; uniform float dt;
    void main () {
      float L = texture(uCurl, vL).x; float R = texture(uCurl, vR).x;
      float T = texture(uCurl, vT).x; float B = texture(uCurl, vB).x;
      float C = texture(uCurl, vUv).x;
      vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
      force /= length(force) + 0.0001;
      force *= curl * C; force.y *= -1.0;
      vec2 velocity = texture(uVelocity, vUv).xy + force * dt;
      velocity = min(max(velocity, -1000.0), 1000.0);
      outColor = vec4(velocity, 0.0, 1.0);
    }`,

  pressure: HEAD + `uniform sampler2D uPressure; uniform sampler2D uDivergence;
    void main () {
      float L = texture(uPressure, vL).x; float R = texture(uPressure, vR).x;
      float T = texture(uPressure, vT).x; float B = texture(uPressure, vB).x;
      float divergence = texture(uDivergence, vUv).x;
      outColor = vec4((L + R + B + T - divergence) * 0.25, 0.0, 0.0, 1.0);
    }`,

  gradientSubtract: HEAD + `uniform sampler2D uPressure; uniform sampler2D uVelocity;
    void main () {
      float L = texture(uPressure, vL).x; float R = texture(uPressure, vR).x;
      float T = texture(uPressure, vT).x; float B = texture(uPressure, vB).x;
      vec2 velocity = texture(uVelocity, vUv).xy - vec2(R - L, T - B);
      outColor = vec4(velocity, 0.0, 1.0);
    }`,

  // Light theme: ink density becomes alpha, hue stays saturated (premultiplied output)
  display: HEAD + `uniform sampler2D uTexture;
    void main () {
      vec3 c = texture(uTexture, vUv).rgb;
      float m = max(c.r, max(c.g, c.b));
      float a = clamp(m * 1.2, 0.0, 0.45);
      vec3 hue = c / max(m, 0.0001);
      outColor = vec4(hue * a, a);
    }`,
};

// Sky / cobalt / silver-blue family only
const PALETTE: [number, number, number][] = [
  [0.361, 0.784, 1.0], //   #5CC8FF sky
  [0.231, 0.51, 0.965], //  #3B82F6 blue
  [0.106, 0.31, 0.839], //  #1B4FD6 cobalt
  [0.49, 0.827, 0.988], //  #7DD3FC pale sky
  [0.58, 0.7, 0.9], //      silver-blue
  [0.2, 0.7, 0.9], //       cyan
];

type Fbo = { tex: WebGLTexture; fbo: WebGLFramebuffer; w: number; h: number; tx: number; ty: number; attach: (i: number) => number };
type Dbl = { read: Fbo; write: Fbo; swap: () => void };

export default function FluidBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const gl = canvas.getContext("webgl2", { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false });
    if (!gl || !gl.getExtension("EXT_color_buffer_float")) {
      canvas.style.display = "none";
      return;
    }

    const SIM = 128;
    const DYE = 640;
    const cfg = { densityDissipation: reduce ? 3.2 : 2.1, velocityDissipation: 0.22, pressure: 0.8, iterations: 18, curl: 24, radius: 0.2, force: reduce ? 1400 : 2600 };

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const vert = compile(gl.VERTEX_SHADER, BASE_VERT);
    type Prog = { prog: WebGLProgram; u: Record<string, WebGLUniformLocation | null> };
    const make = (frag: string): Prog => {
      const prog = gl.createProgram()!;
      gl.attachShader(prog, vert);
      gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, frag));
      gl.bindAttribLocation(prog, 0, "aPosition");
      gl.linkProgram(prog);
      const u: Prog["u"] = {};
      const n = gl.getProgramParameter(prog, gl.ACTIVE_UNIFORMS);
      for (let i = 0; i < n; i++) {
        const name = gl.getActiveUniform(prog, i)!.name;
        u[name] = gl.getUniformLocation(prog, name);
      }
      return { prog, u };
    };
    const P = {
      clear: make(FRAG.clear), splat: make(FRAG.splat), advection: make(FRAG.advection), divergence: make(FRAG.divergence),
      curl: make(FRAG.curl), vorticity: make(FRAG.vorticity), pressure: make(FRAG.pressure),
      grad: make(FRAG.gradientSubtract), display: make(FRAG.display),
    };

    // full-screen quad
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);
    const blit = (target: Fbo | null) => {
      if (target) {
        gl.viewport(0, 0, target.w, target.h);
        gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
      } else {
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      }
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    };

    const createFbo = (w: number, h: number): Fbo => {
      gl.activeTexture(gl.TEXTURE0);
      const tex = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, w, h, 0, gl.RGBA, gl.HALF_FLOAT, null);
      const fbo = gl.createFramebuffer()!;
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
      gl.viewport(0, 0, w, h);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      return {
        tex, fbo, w, h, tx: 1 / w, ty: 1 / h,
        attach: (i) => { gl.activeTexture(gl.TEXTURE0 + i); gl.bindTexture(gl.TEXTURE_2D, tex); return i; },
      };
    };
    const createDbl = (w: number, h: number): Dbl => {
      let a = createFbo(w, h), b = createFbo(w, h);
      return { get read() { return a; }, get write() { return b; }, swap() { [a, b] = [b, a]; } } as Dbl;
    };

    const res = (r: number) => {
      const ar = gl.drawingBufferWidth / gl.drawingBufferHeight;
      const a = ar < 1 ? 1 / ar : ar;
      const min = Math.round(r), max = Math.round(r * a);
      return gl.drawingBufferWidth > gl.drawingBufferHeight ? { w: max, h: min } : { w: min, h: max };
    };

    let velocity: Dbl, dye: Dbl, divergence: Fbo, curl: Fbo, pressure: Dbl;
    const init = () => {
      const s = res(SIM), d = res(DYE);
      velocity = createDbl(s.w, s.h);
      dye = createDbl(d.w, d.h);
      divergence = createFbo(s.w, s.h);
      curl = createFbo(s.w, s.h);
      pressure = createDbl(s.w, s.h);
    };

    const resize = (force = false) => {
      const scale = 0.6;
      const w = Math.max(2, Math.floor(window.innerWidth * scale));
      const h = Math.max(2, Math.floor(window.innerHeight * scale));
      if (force || canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        init();
      }
    };
    resize(true);

    const use = (p: Prog) => gl.useProgram(p.prog);

    const splat = (x: number, y: number, dx: number, dy: number, color: [number, number, number]) => {
      use(P.splat);
      gl.uniform1i(P.splat.u.uTarget, velocity.read.attach(0));
      gl.uniform1f(P.splat.u.aspectRatio, canvas.width / canvas.height);
      gl.uniform2f(P.splat.u.point, x, y);
      gl.uniform3f(P.splat.u.color, dx, dy, 0);
      const ar = canvas.width / canvas.height;
      gl.uniform1f(P.splat.u.radius, (ar > 1 ? cfg.radius / 100 * ar : cfg.radius / 100) * 1.0);
      blit(velocity.write); velocity.swap();
      gl.uniform1i(P.splat.u.uTarget, dye.read.attach(0));
      gl.uniform3f(P.splat.u.color, color[0], color[1], color[2]);
      blit(dye.write); dye.swap();
    };

    const pick = (): [number, number, number] => {
      const c = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      const k = 0.12;
      return [c[0] * k, c[1] * k, c[2] * k];
    };

    // ---- input: pointer, touch, wheel, scroll ----
    let lastX = -1, lastY = -1, lastT = 0;
    const move = (cx: number, cy: number) => {
      const now = performance.now();
      const x = cx / window.innerWidth, y = 1 - cy / window.innerHeight;
      if (lastX >= 0 && now - lastT < 300) {
        const dx = (x - lastX) * cfg.force, dy = (y - lastY) * cfg.force;
        if (Math.abs(dx) + Math.abs(dy) > 0.5) splat(x, y, dx, dy, pick());
      }
      lastX = x; lastY = y; lastT = now;
    };
    const onPointer = (e: PointerEvent) => move(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => { const t = e.touches[0]; if (t) move(t.clientX, t.clientY); };
    const onLeave = () => { lastX = -1; };

    let lastScrollY = window.scrollY;
    const burst = (dy: number, strength: number) => {
      const n = 1;
      for (let i = 0; i < n; i++) {
        const x = 0.1 + Math.random() * 0.8, y = 0.2 + Math.random() * 0.6;
        splat(x, y, (Math.random() - 0.5) * strength * 0.5, -dy * strength, pick());
      }
    };
    const onScroll = () => {
      const d = window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;
      if (Math.abs(d) < 2) return;
      burst(Math.sign(d) * Math.min(Math.abs(d) / 60, 1.5), cfg.force * 0.1);
    };
    let wheelAt = 0;
    const onWheel = (e: WheelEvent) => {
      const now = performance.now();
      if (now - wheelAt < 90) return;
      wheelAt = now;
      burst(Math.sign(e.deltaY) * Math.min(Math.abs(e.deltaY) / 80, 2), cfg.force * 0.1);
    };

    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: true });
    const onResize = () => resize();
    window.addEventListener("resize", onResize);
    document.documentElement.addEventListener("mouseleave", onLeave);

    // opening flourish so the page never starts blank
    setTimeout(() => {
      for (let i = 0; i < 5; i++) {
        splat(0.15 + Math.random() * 0.7, 0.25 + Math.random() * 0.5, (Math.random() - 0.5) * 900, (Math.random() - 0.5) * 900, pick());
      }
    }, 250);

    // ---- simulation step ----
    const step = (dt: number) => {
      gl.disable(gl.BLEND);
      use(P.curl);
      gl.uniform2f(P.curl.u.texelSize, velocity.read.tx, velocity.read.ty);
      gl.uniform1i(P.curl.u.uVelocity, velocity.read.attach(0));
      blit(curl);

      use(P.vorticity);
      gl.uniform2f(P.vorticity.u.texelSize, velocity.read.tx, velocity.read.ty);
      gl.uniform1i(P.vorticity.u.uVelocity, velocity.read.attach(0));
      gl.uniform1i(P.vorticity.u.uCurl, curl.attach(1));
      gl.uniform1f(P.vorticity.u.curl, cfg.curl);
      gl.uniform1f(P.vorticity.u.dt, dt);
      blit(velocity.write); velocity.swap();

      use(P.divergence);
      gl.uniform2f(P.divergence.u.texelSize, velocity.read.tx, velocity.read.ty);
      gl.uniform1i(P.divergence.u.uVelocity, velocity.read.attach(0));
      blit(divergence);

      use(P.clear);
      gl.uniform1i(P.clear.u.uTexture, pressure.read.attach(0));
      gl.uniform1f(P.clear.u.value, cfg.pressure);
      blit(pressure.write); pressure.swap();

      use(P.pressure);
      gl.uniform2f(P.pressure.u.texelSize, velocity.read.tx, velocity.read.ty);
      gl.uniform1i(P.pressure.u.uDivergence, divergence.attach(0));
      for (let i = 0; i < cfg.iterations; i++) {
        gl.uniform1i(P.pressure.u.uPressure, pressure.read.attach(1));
        blit(pressure.write); pressure.swap();
      }

      use(P.grad);
      gl.uniform2f(P.grad.u.texelSize, velocity.read.tx, velocity.read.ty);
      gl.uniform1i(P.grad.u.uPressure, pressure.read.attach(0));
      gl.uniform1i(P.grad.u.uVelocity, velocity.read.attach(1));
      blit(velocity.write); velocity.swap();

      use(P.advection);
      gl.uniform2f(P.advection.u.texelSize, velocity.read.tx, velocity.read.ty);
      gl.uniform1i(P.advection.u.uVelocity, velocity.read.attach(0));
      gl.uniform1i(P.advection.u.uSource, velocity.read.attach(0));
      gl.uniform1f(P.advection.u.dt, dt);
      gl.uniform1f(P.advection.u.dissipation, cfg.velocityDissipation);
      blit(velocity.write); velocity.swap();

      gl.uniform1i(P.advection.u.uVelocity, velocity.read.attach(0));
      gl.uniform1i(P.advection.u.uSource, dye.read.attach(1));
      gl.uniform1f(P.advection.u.dissipation, cfg.densityDissipation);
      blit(dye.write); dye.swap();
    };

    const render = () => {
      gl.clearColor(0, 0, 0, 0);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.clear(gl.COLOR_BUFFER_BIT);
      use(P.display);
      gl.uniform1i(P.display.u.uTexture, dye.read.attach(0));
      blit(null);
    };

    let raf = 0, last = performance.now(), ambientAt = last + 2500;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min((now - last) / 1000, 0.0166);
      last = now;
      if (!reduce && now > ambientAt) {
        ambientAt = now + 9000 + Math.random() * 6000;
        const fromLeft = Math.random() > 0.5;
        splat(fromLeft ? 0.05 : 0.95, 0.2 + Math.random() * 0.6, (fromLeft ? 1 : -1) * (250 + Math.random() * 250), (Math.random() - 0.5) * 500, pick());
      }
      step(dt);
      render();
    };
    raf = requestAnimationFrame(loop);

    const onVis = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) { last = performance.now(); raf = requestAnimationFrame(loop); }
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", onResize);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="fluid-canvas"
    />
  );
}
