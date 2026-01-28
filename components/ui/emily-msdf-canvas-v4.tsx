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

// IRIDESCENT COLOR SYSTEM
// Inspired by: mother of pearl, soap bubbles, beetle shells
// Colors shift based on position, mouse proximity, and time
// Creating a living, breathing palette

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

// HSL to RGB conversion for natural color mixing
vec3 hsl2rgb(vec3 hsl) {
    float h = hsl.x;
    float s = hsl.y;
    float l = hsl.z;

    float c = (1.0 - abs(2.0 * l - 1.0)) * s;
    float x = c * (1.0 - abs(mod(h * 6.0, 2.0) - 1.0));
    float m = l - c * 0.5;

    vec3 rgb;
    if (h < 1.0/6.0) rgb = vec3(c, x, 0.0);
    else if (h < 2.0/6.0) rgb = vec3(x, c, 0.0);
    else if (h < 3.0/6.0) rgb = vec3(0.0, c, x);
    else if (h < 4.0/6.0) rgb = vec3(0.0, x, c);
    else if (h < 5.0/6.0) rgb = vec3(x, 0.0, c);
    else rgb = vec3(c, 0.0, x);

    return rgb + m;
}

void main() {
    vec2 mouseUV = u_mouse / (u_resolution / u_pixelRatio);
    mouseUV.y = 1.0 - mouseUV.y;

    vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);
    float dist = length((vUv - mouseUV) * aspect);

    float mouseInfluence = 1.0 - smoothstep(u_circleSize - u_circleEdge, u_circleSize + u_circleEdge, dist);
    mouseInfluence = pow(mouseInfluence, 0.8);

    vec2 toMouse = mouseUV - vUv;

    float result = 0.0;
    float totalWeight = 0.0;
    float colorShift = 0.0; // Track how far along the trail we are for color

    const int SAMPLES = 16;
    float maxPull = 0.22;

    for (int i = 0; i < SAMPLES; i++) {
        float t = float(i) / float(SAMPLES - 1);
        float tEased = t * t * (3.0 - 2.0 * t);

        float pullStrength = mouseInfluence * maxPull * tEased;
        vec2 sampleUV = vUv + toMouse * pullStrength;

        vec3 msdfSample = texture2D(u_msdfTexture, sampleUV).rgb;
        float sdfSample = median(msdfSample.r, msdfSample.g, msdfSample.b);
        float sdf = (0.5 - sdfSample) * 2.0;

        float edgeSoft = 0.03 + tEased * mouseInfluence * 0.08;
        float filled = 1.0 - smoothstep(-edgeSoft, edgeSoft, sdf);

        float weight = 1.0 / (1.0 + t * 2.0) * (0.4 + mouseInfluence * 0.6);

        result += filled * weight;
        colorShift += filled * weight * t; // Accumulate trail position for color
        totalWeight += weight;
    }

    result /= totalWeight;
    colorShift /= totalWeight;

    float stroke = clamp(result * 1.35, 0.0, 1.0);

    // === IRIDESCENT COLOR SYSTEM ===

    // 1. SPATIAL HUE: Diagonal gradient across canvas
    //    Deep violet (0.75) → Cyan (0.5) → Magenta (0.85)
    float spatialHue = 0.72 + (vUv.x * 0.4 + vUv.y * 0.3) * 0.25;

    // 2. TIME BREATHING: Slow, subtle hue rotation
    float timeShift = sin(u_time * 0.3) * 0.08;

    // 3. MOUSE WARMTH: Proximity to mouse shifts toward coral/warm
    //    Creates "heat" where interaction happens
    float warmthShift = mouseInfluence * -0.15; // Shift toward red/orange

    // 4. TRAIL COLOR EVOLUTION: Further along trail = shifted hue
    //    Creates rainbow trail effect
    float trailShift = colorShift * mouseInfluence * 0.2;

    // Combine all hue influences
    float finalHue = mod(spatialHue + timeShift + warmthShift + trailShift, 1.0);

    // 5. SATURATION: Rich but not garish
    //    Slightly more saturated near mouse (more alive)
    float saturation = 0.65 + mouseInfluence * 0.2;

    // 6. LIGHTNESS: Bright enough to pop on black
    //    Subtle variation for depth
    float wave = sin((vUv.x + vUv.y) * 3.0 + u_time * 0.5) * 0.5 + 0.5;
    float lightness = 0.6 + wave * 0.1 + mouseInfluence * 0.1;

    // Convert to RGB
    vec3 color = hsl2rgb(vec3(finalHue, saturation, lightness));

    // 7. ACCENT HIGHLIGHT: Add subtle white/bright highlight at mouse center
    //    Like light catching on a soap bubble
    float highlight = pow(mouseInfluence, 3.0) * 0.3;
    color = mix(color, vec3(1.0), highlight);

    gl_FragColor = vec4(color, stroke);
}
`;

interface EmilyMsdfCanvasV4Props {
  className?: string;
  circleSize?: number;
  circleEdge?: number;
  borderSize?: number;
}

const EmilyMsdfCanvasV4: FC<EmilyMsdfCanvasV4Props> = ({
  className = "",
  circleSize = 0.25,
  circleEdge = 0.3,
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

      vMouseDamp.x = THREE.MathUtils.damp(vMouseDamp.x, vMouse.x, 10, dt);
      vMouseDamp.y = THREE.MathUtils.damp(vMouseDamp.y, vMouse.y, 10, dt);

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

export default EmilyMsdfCanvasV4;
