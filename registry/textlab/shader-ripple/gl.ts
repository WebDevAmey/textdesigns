"use client";

import { createTextShader } from "../lib/webgl";

const FRAGMENT = `
uniform sampler2D u_tex;
uniform vec2 u_mouse;
uniform float u_aspect;
uniform float u_time;
uniform float u_hover;
uniform float u_mode;
uniform float u_strength;
varying vec2 v_uv;
void main() {
  vec2 uv = v_uv;
  vec2 d = (uv - u_mouse) * vec2(u_aspect, 1.0);
  float dist = length(d);
  vec2 dir = dist > 0.0001 ? d / dist : vec2(0.0);
  if (u_mode < 0.5) {
    // Ripple: rings travel outward from the pointer and fade with distance.
    float wave = sin(dist * 38.0 - u_time * 7.0) * exp(-dist * 5.0);
    uv += dir / vec2(u_aspect, 1.0) * wave * 0.018 * u_strength * u_hover;
  } else {
    // Lens: magnify inside a soft circle around the pointer.
    float r = 0.22;
    float k = smoothstep(r, 0.0, dist) * 0.45 * u_strength * u_hover;
    uv = u_mouse + (uv - u_mouse) * (1.0 - k);
  }
  gl_FragColor = texture2D(u_tex, uv);
}`;

export function createRipple(canvas: HTMLCanvasElement) {
  return createTextShader(canvas, FRAGMENT);
}
