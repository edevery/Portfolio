"use client";

import { useRef, useEffect, FC } from "react";
import * as THREE from "three";
import { SHIMMER_CONFIG, getShimmerPosition } from "@/lib/shimmer-config";

const vertexShader = /* glsl */ `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = /* glsl */ `
varying vec2 vUv;

uniform sampler2D u_sdfTexture;
uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform float u_pixelRatio;
uniform float u_circleSize;
uniform float u_circleEdge;
uniform float u_borderSize;
uniform float u_time;

// Anti-aliased step using screen-space derivatives
float aastep(float threshold, float value) {
    float afwidth = length(vec2(dFdx(value), dFdy(value))) * 0.70710678118654757;
    return smoothstep(threshold - afwidth, threshold + afwidth, value);
}

// Stroke with anti-aliasing and variable edge softness
float strokeAA(float x, float size, float w, float edge) {
    float afwidth = length(vec2(dFdx(x), dFdy(x))) * 0.70710678;
    float d = smoothstep(size - edge - afwidth, size + edge + afwidth, x + w * 0.5)
            - smoothstep(size - edge - afwidth, size + edge + afwidth, x - w * 0.5);
    return clamp(d, 0.0, 1.0);
}

// Fill with variable edge softness
float fillSoft(float x, float edge) {
    return 1.0 - smoothstep(-edge, edge, x);
}

void main() {
    // Mouse position in UV space (0-1)
    vec2 mouseUV = u_mouse / (u_resolution / u_pixelRatio);
    mouseUV.y = 1.0 - mouseUV.y;

    // Aspect ratio correction for circular mouse influence
    vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);
    float dist = length((vUv - mouseUV) * aspect);

    // Soft circle following mouse
    float mouseInfluence = 1.0 - smoothstep(u_circleSize - u_circleEdge, u_circleSize + u_circleEdge, dist);

    // UV DISTORTION: Pull texture towards mouse for "magnetizing" effect
    vec2 toMouse = mouseUV - vUv;
    float pullStrength = mouseInfluence * 0.12;
    vec2 distortedUV = vUv + toMouse * pullStrength;

    // Sample the SDF texture at DISTORTED position
    float sdfSample = texture2D(u_sdfTexture, distortedUV).r;

    // Remap to signed distance
    float sdf = (0.5 - sdfSample) * 2.0;

    // Moderate edge blur - keeps effect near the actual shape
    float edgeSoftness = mouseInfluence * 0.4;

    // Create stroke
    float stroke = strokeAA(sdf, 0.0, u_borderSize, edgeSoftness) * 4.0;

    // Subtle animated gradient (matching original)
    float gradientSpeed = 0.15;
    float gradientScale = 1.5;
    float wave1 = sin((vUv.x + vUv.y * 0.5) * gradientScale + u_time * gradientSpeed) * 0.5 + 0.5;
    float wave2 = sin((vUv.x * 0.7 - vUv.y * 0.3) * gradientScale * 1.3 + u_time * gradientSpeed * 0.7) * 0.5 + 0.5;
    float combinedWave = mix(wave1, wave2, 0.5);
    float brightness = 0.88 + combinedWave * 0.12;

    vec3 color = vec3(brightness);
    float alpha = stroke;

    gl_FragColor = vec4(color, alpha);
}
`;

interface EmilySdfCanvasProps {
  className?: string;
  circleSize?: number;
  circleEdge?: number;
  borderSize?: number;
}

const EmilySdfCanvas: FC<EmilySdfCanvasProps> = ({
  className = "",
  circleSize = 0.3,
  circleEdge = 0.15,
  borderSize = 0.45,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let animationFrameId: number;
    let lastTime = 0;

    const vMouse = new THREE.Vector2();
    const vMouseDamp = new THREE.Vector2();
    const vResolution = new THREE.Vector2();

    let w = 1,
      h = 1;

    // Shimmer animation state
    let shimmerPhase: "waiting" | "fading" | "shimmering" | "complete" =
      "waiting";
    let shimmerStartTime = 0;
    let loadTime = 0;

    // Start hidden for fade-in
    mount.style.opacity = "0";
    mount.style.transition = `opacity ${SHIMMER_CONFIG.FADE_DURATION_MS}ms ease-out`;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0, 1);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Load the SDF texture
    const textureLoader = new THREE.TextureLoader();
    const sdfTexture = textureLoader.load("/Assets/emily-sdf.png");
    sdfTexture.minFilter = THREE.LinearFilter;
    sdfTexture.magFilter = THREE.LinearFilter;

    const geo = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        u_sdfTexture: { value: sdfTexture },
        u_mouse: { value: vMouseDamp },
        u_resolution: { value: vResolution },
        u_pixelRatio: { value: 2 },
        u_circleSize: { value: circleSize },
        u_circleEdge: { value: circleEdge },
        u_borderSize: { value: borderSize },
        u_time: { value: 0 },
      },
      transparent: true,
    });

    const quad = new THREE.Mesh(geo, material);
    scene.add(quad);

    const onPointerMove = (e: PointerEvent | MouseEvent) => {
      if (!mount) return;
      if (shimmerPhase !== "complete") shimmerPhase = "complete";
      const rect = mount.getBoundingClientRect();
      vMouse.set(e.clientX - rect.left, e.clientY - rect.top);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!mount || e.touches.length === 0) return;
      if (shimmerPhase !== "complete") shimmerPhase = "complete";
      const touch = e.touches[0];
      const rect = mount.getBoundingClientRect();
      vMouse.set(touch.clientX - rect.left, touch.clientY - rect.top);
    };

    document.addEventListener("mousemove", onPointerMove);
    document.addEventListener("pointermove", onPointerMove);
    document.addEventListener("touchmove", onTouchMove, { passive: true });
    document.addEventListener("touchstart", onTouchMove, { passive: true });

    const resize = () => {
      if (!mountRef.current) return;
      const container = mountRef.current;
      w = container.clientWidth;
      h = container.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      renderer.setSize(w, h);
      renderer.setPixelRatio(dpr);

      vResolution.set(w, h).multiplyScalar(dpr);
      material.uniforms.u_pixelRatio.value = dpr;
    };

    resize();
    window.addEventListener("resize", resize);

    const ro = new ResizeObserver(() => resize());
    ro.observe(mountRef.current as Element);

    const update = () => {
      const time = performance.now() * 0.001;
      const now = performance.now();
      const dt = time - lastTime;
      lastTime = time;

      // Initialize load time on first frame
      if (loadTime === 0) {
        loadTime = now;
        shimmerStartTime = now + SHIMMER_CONFIG.DELAY_MS;
        const startPos = getShimmerPosition(0, w, h);
        vMouse.set(startPos.x, startPos.y);
        vMouseDamp.set(startPos.x, startPos.y);
      }

      // Handle shimmer phases
      if (shimmerPhase === "waiting") {
        mount.style.opacity = "1";
        shimmerPhase = "fading";
      } else if (shimmerPhase === "fading") {
        if (now >= shimmerStartTime) shimmerPhase = "shimmering";
        const shimmerPos = getShimmerPosition(0, w, h);
        vMouse.set(shimmerPos.x, shimmerPos.y);
      } else if (shimmerPhase === "shimmering") {
        const elapsed = now - shimmerStartTime;
        const shimmerPos = getShimmerPosition(elapsed, w, h);
        vMouse.set(shimmerPos.x, shimmerPos.y);
        if (shimmerPos.complete) shimmerPhase = "complete";
      }

      // Smooth mouse following
      vMouseDamp.x = THREE.MathUtils.damp(vMouseDamp.x, vMouse.x, 8, dt);
      vMouseDamp.y = THREE.MathUtils.damp(vMouseDamp.y, vMouse.y, 8, dt);

      material.uniforms.u_time.value = time;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(update);
    };
    update();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
      ro.disconnect();
      document.removeEventListener("mousemove", onPointerMove);
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchstart", onTouchMove);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
      sdfTexture.dispose();
    };
  }, [circleSize, circleEdge, borderSize]);

  return <div ref={mountRef} className={`w-full h-full ${className}`} />;
};

export default EmilySdfCanvas;
