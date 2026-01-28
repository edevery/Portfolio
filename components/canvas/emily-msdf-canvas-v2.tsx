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

uniform sampler2D u_msdfTexture;
uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform float u_pixelRatio;
uniform float u_circleSize;
uniform float u_circleEdge;
uniform float u_borderSize;
uniform float u_time;

float median(float r, float g, float b) {
    return max(min(r, g), min(max(r, g), b));
}

void main() {
    vec2 mouseUV = u_mouse / (u_resolution / u_pixelRatio);
    mouseUV.y = 1.0 - mouseUV.y;

    vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);
    float dist = length((vUv - mouseUV) * aspect);

    // Moderate influence range
    float mouseInfluence = 1.0 - smoothstep(u_circleSize - u_circleEdge, u_circleSize + u_circleEdge, dist);

    // Subtle curve boost
    mouseInfluence = pow(mouseInfluence, 0.8);

    vec2 toMouse = mouseUV - vUv;

    float result = 0.0;
    float totalWeight = 0.0;

    const int SAMPLES = 20;
    float maxPull = 0.4; // Moderate pull

    for (int i = 0; i < SAMPLES; i++) {
        float t = float(i) / float(SAMPLES - 1);

        // Cubic easing - smooth acceleration
        float tEased = t * t * (3.0 - 2.0 * t);

        float pullStrength = mouseInfluence * maxPull * tEased;
        vec2 sampleUV = vUv + toMouse * pullStrength;

        vec3 msdfSample = texture2D(u_msdfTexture, sampleUV).rgb;
        float sdfSample = median(msdfSample.r, msdfSample.g, msdfSample.b);
        float sdf = (0.5 - sdfSample) * 2.0;

        // Moderate softness with gradual increase
        float edgeSoft = 0.06 + tEased * mouseInfluence * 0.2;
        float filled = 1.0 - smoothstep(-edgeSoft, edgeSoft, sdf);

        // Smooth inverse falloff
        float weight = 1.0 / (1.0 + t * 2.0) * (0.4 + mouseInfluence * 0.6);

        result += filled * weight;
        totalWeight += weight;
    }

    result /= totalWeight;

    // Balanced intensity
    float stroke = clamp(result * 1.35, 0.0, 1.0);

    // Animated gradient - slightly faster, more contrast
    float gradientSpeed = 0.25;
    float gradientScale = 2.0;
    float wave1 = sin((vUv.x + vUv.y * 0.5) * gradientScale + u_time * gradientSpeed) * 0.5 + 0.5;
    float wave2 = sin((vUv.x * 0.7 - vUv.y * 0.3) * gradientScale * 1.3 + u_time * gradientSpeed * 0.7) * 0.5 + 0.5;
    float combinedWave = mix(wave1, wave2, 0.5);
    float brightness = 0.82 + combinedWave * 0.18;

    vec3 color = vec3(brightness);
    gl_FragColor = vec4(color, stroke);
}
`;

interface EmilyMsdfCanvasV2Props {
  className?: string;
  circleSize?: number;
  circleEdge?: number;
  borderSize?: number;
}

const EmilyMsdfCanvasV2: FC<EmilyMsdfCanvasV2Props> = ({
  className = "",
  circleSize = 0.35,
  circleEdge = 0.55,
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

    const textureLoader = new THREE.TextureLoader();
    const msdfTexture = textureLoader.load("/Assets/emily-msdf.png");
    msdfTexture.minFilter = THREE.LinearFilter;
    msdfTexture.magFilter = THREE.LinearFilter;

    const geo = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        u_msdfTexture: { value: msdfTexture },
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

      // Slightly smoother mouse following than homepage3
      vMouseDamp.x = THREE.MathUtils.damp(vMouseDamp.x, vMouse.x, 6, dt);
      vMouseDamp.y = THREE.MathUtils.damp(vMouseDamp.y, vMouse.y, 6, dt);

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
      msdfTexture.dispose();
    };
  }, [circleSize, circleEdge, borderSize]);

  return <div ref={mountRef} className={`w-full h-full ${className}`} />;
};

export default EmilyMsdfCanvasV2;
