"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";

const vertexShader = /* glsl */ `
varying vec2 v_texcoord;
void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  v_texcoord = uv;
}
`;

const fragmentShader = /* glsl */ `
varying vec2 v_texcoord;

uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform float u_pixelRatio;
uniform sampler2D u_texture;

uniform float u_shapeSize;
uniform float u_roundness;
uniform float u_borderSize;
uniform float u_circleSize;
uniform float u_circleEdge;

#ifndef FNC_COORD
#define FNC_COORD
vec2 coord(in vec2 p) {
  p = p / u_resolution.xy;
  if (u_resolution.x > u_resolution.y) {
    p.x *= u_resolution.x / u_resolution.y;
    p.x += (u_resolution.y - u_resolution.x) / u_resolution.y / 2.0;
  } else {
    p.y *= u_resolution.y / u_resolution.x;
    p.y += (u_resolution.x - u_resolution.y) / u_resolution.x / 2.0;
  }
  p -= 0.5;
  p *= vec2(-1.0, 1.0);
  return p;
}
#endif

#define st0 coord(gl_FragCoord.xy)
#define mx coord(u_mouse * u_pixelRatio)

float sdCircle(in vec2 st, in vec2 center) {
  return length(st - center) * 2.0;
}

float fill(float x, float size, float edge) {
  return 1.0 - smoothstep(size - edge, size + edge, x);
}

void main() {
  vec2 st = st0 + 0.5;
  vec2 posMouse = mx * vec2(1., -1.) + 0.5;

  // Calculate mouse proximity field (1.0 = near mouse, 0.0 = far from mouse)
  float mouseProximity = fill(
    sdCircle(st, posMouse),
    u_circleSize,
    u_circleEdge
  );

  // Calculate blur amount: invert so near mouse = sharp, far = blurry
  // Max blur in pixels, scaled by resolution
  float maxBlurRadius = 20.0 / u_resolution.x;
  float blurAmount = (1.0 - mouseProximity) * maxBlurRadius;

  // Multi-sample blur using texture samples in a disc pattern
  vec4 color = vec4(0.0);
  float total = 0.0;

  // 13-tap blur pattern (center + 12 samples in rings)
  const int SAMPLES = 12;
  const float PI = 3.14159265359;

  // Center sample (weighted more heavily)
  color += texture2D(u_texture, v_texcoord) * 2.0;
  total += 2.0;

  // Ring samples
  for (int i = 0; i < SAMPLES; i++) {
    float angle = float(i) * PI * 2.0 / float(SAMPLES);
    vec2 offset = vec2(cos(angle), sin(angle)) * blurAmount;
    color += texture2D(u_texture, v_texcoord + offset);
    total += 1.0;
  }

  // Second ring at half radius
  for (int i = 0; i < SAMPLES; i++) {
    float angle = float(i) * PI * 2.0 / float(SAMPLES) + PI / float(SAMPLES);
    vec2 offset = vec2(cos(angle), sin(angle)) * blurAmount * 0.5;
    color += texture2D(u_texture, v_texcoord + offset);
    total += 1.0;
  }

  color /= total;

  gl_FragColor = color;
}
`;

interface ImageBlurProps {
  className?: string;
  src: string;
  variation?: number;
  pixelRatioProp?: number;
  shapeSize?: number;
  roundness?: number;
  borderSize?: number;
  circleSize?: number;
  circleEdge?: number;
}

export default function ImageBlur({
  className = "",
  src,
  variation = 0,
  pixelRatioProp = 1,
  shapeSize = 1,
  roundness = 0.5,
  borderSize = 0.05,
  circleSize = 0.25,
  circleEdge = 1,
}: ImageBlurProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let animationFrameId: number;
    let time = 0,
      lastTime = 0;

    const vMouse = new THREE.Vector2();
    const vMouseDamp = new THREE.Vector2();
    const vResolution = new THREE.Vector2();

    let w = 1,
      h = 1;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera();
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Load texture
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(src);

    const geo = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        u_mouse: { value: vMouseDamp },
        u_resolution: { value: vResolution },
        u_pixelRatio: { value: pixelRatioProp },
        u_texture: { value: texture },
        u_shapeSize: { value: shapeSize },
        u_roundness: { value: roundness },
        u_borderSize: { value: borderSize },
        u_circleSize: { value: circleSize },
        u_circleEdge: { value: circleEdge },
      },
      defines: { VAR: variation },
      transparent: true,
    });

    const quad = new THREE.Mesh(geo, material);
    scene.add(quad);

    const onPointerMove = (e: MouseEvent | PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      vMouse.set(e.clientX - rect.left, e.clientY - rect.top);
    };

    document.addEventListener("mousemove", onPointerMove);
    document.addEventListener("pointermove", onPointerMove);

    const resize = () => {
      const container = mountRef.current;
      if (!container) return;

      w = container.clientWidth;
      h = container.clientHeight;
      const dpr = Math.min(window.devicePixelRatio, 2);

      renderer.setSize(w, h);
      renderer.setPixelRatio(dpr);

      camera.left = -w / 2;
      camera.right = w / 2;
      camera.top = h / 2;
      camera.bottom = -h / 2;
      camera.updateProjectionMatrix();

      quad.scale.set(w, h, 1);
      vResolution.set(w, h).multiplyScalar(dpr);
      material.uniforms.u_pixelRatio.value = dpr;
    };

    resize();
    window.addEventListener("resize", resize);

    const ro = new ResizeObserver(() => resize());
    if (mountRef.current) ro.observe(mountRef.current);

    const update = () => {
      time = performance.now() * 0.001;
      const dt = time - lastTime;
      lastTime = time;

      (["x", "y"] as const).forEach((k) => {
        vMouseDamp[k] = THREE.MathUtils.damp(vMouseDamp[k], vMouse[k], 8, dt);
      });

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(update);
    };
    update();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
      if (ro) ro.disconnect();
      document.removeEventListener("mousemove", onPointerMove);
      document.removeEventListener("pointermove", onPointerMove);
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      texture.dispose();
    };
  }, [src, variation, pixelRatioProp, shapeSize, roundness, borderSize, circleSize, circleEdge]);

  return (
    <div
      className={className}
      ref={mountRef}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
