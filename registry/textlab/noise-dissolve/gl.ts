"use client";

import { createTextShader } from "../lib/webgl";

const FRAGMENT = `
uniform sampler2D u_tex;
uniform float u_threshold;
uniform float u_scale;
uniform vec3 u_edge;
uniform float u_burn;
varying vec2 v_uv;
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
  return v;
}
void main() {
  vec4 tex = texture2D(u_tex, v_uv);
  float n = fbm(v_uv * u_scale);
  // Pixels whose noise is below the threshold are gone; a thin band just above it glows.
  float keep = smoothstep(u_threshold, u_threshold + 0.02, n);
  float edge = smoothstep(u_threshold + 0.09, u_threshold, n) * keep * step(0.001, u_threshold);
  vec3 color = mix(tex.rgb, u_edge * tex.a, edge * u_burn);
  gl_FragColor = vec4(color, tex.a) * keep;
}`;

export function createDissolve(canvas: HTMLCanvasElement) {
  return createTextShader(canvas, FRAGMENT);
}
