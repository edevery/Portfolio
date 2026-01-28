"use client";

import { useRef, useEffect, FC } from "react";
import * as THREE from "three";

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

// MSDF: take median of RGB channels to get the signed distance
float median(float r, float g, float b) {
    return max(min(r, g), min(max(r, g), b));
}

// Stroke with anti-aliasing and variable edge softness
float strokeAA(float x, float size, float w, float edge) {
    float afwidth = length(vec2(dFdx(x), dFdy(x))) * 0.70710678;
    float d = smoothstep(size - edge - afwidth, size + edge + afwidth, x + w * 0.5)
            - smoothstep(size - edge - afwidth, size + edge + afwidth, x - w * 0.5);
    return clamp(d, 0.0, 1.0);
}

void main() {
    // Mouse position in UV space
    vec2 mouseUV = u_mouse / (u_resolution / u_pixelRatio);
    mouseUV.y = 1.0 - mouseUV.y;

    // Aspect ratio correction for circular mouse influence
    vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);
    float dist = length((vUv - mouseUV) * aspect);

    // Mouse influence with LARGE falloff range (like original's circleEdge=0.5)
    // This creates gradual effect over significant distance
    float mouseInfluence = 1.0 - smoothstep(u_circleSize - u_circleEdge, u_circleSize + u_circleEdge, dist);

    // Direction towards mouse
    vec2 toMouse = mouseUV - vUv;

    // MULTI-SAMPLE TRAIL: Sample at multiple points towards the mouse
    // This creates the "drawn towards" smear effect without gray circles
    float result = 0.0;
    float totalWeight = 0.0;

    const int SAMPLES = 12;
    float maxPull = 0.35; // Maximum pull distance

    for (int i = 0; i < SAMPLES; i++) {
        float t = float(i) / float(SAMPLES - 1);

        // Pull strength increases along the trail
        float pullStrength = mouseInfluence * maxPull * t;
        vec2 sampleUV = vUv + toMouse * pullStrength;

        // Sample MSDF at this position
        vec3 msdfSample = texture2D(u_msdfTexture, sampleUV).rgb;
        float sdfSample = median(msdfSample.r, msdfSample.g, msdfSample.b);
        float sdf = (0.5 - sdfSample) * 2.0;

        // Soft edge that increases with distance along trail
        float edgeSoft = 0.02 + t * mouseInfluence * 0.15;
        float filled = 1.0 - smoothstep(-edgeSoft, edgeSoft, sdf);

        // Weight: samples closer to original position have more weight
        // But also fade based on how far along the trail
        float weight = (1.0 - t * 0.6) * (0.3 + mouseInfluence * 0.7);

        result += filled * weight;
        totalWeight += weight;
    }

    result /= totalWeight;

    // Boost intensity
    float stroke = clamp(result * 1.3, 0.0, 1.0);

    // Subtle animated gradient
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

interface EmilyMsdfCanvasProps {
  className?: string;
  circleSize?: number;
  circleEdge?: number;
  borderSize?: number;
}

const EmilyMsdfCanvas: FC<EmilyMsdfCanvasProps> = ({
  className = "",
  circleSize = 0.3,
  circleEdge = 0.5,
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

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0, 1);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Load the MSDF texture
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
      const rect = mount.getBoundingClientRect();
      vMouse.set(e.clientX - rect.left, e.clientY - rect.top);
    };

    document.addEventListener("mousemove", onPointerMove);
    document.addEventListener("pointermove", onPointerMove);

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
      const dt = time - lastTime;
      lastTime = time;

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
      mount.removeChild(renderer.domElement);
      renderer.dispose();
      msdfTexture.dispose();
    };
  }, [circleSize, circleEdge, borderSize]);

  return <div ref={mountRef} className={`w-full h-full ${className}`} />;
};

export default EmilyMsdfCanvas;
