"use client";

import { useRef, useEffect, FC } from "react";
import * as THREE from "three";

const EMILY_PATH =
  "M50.12,610.21c0-152.3,110.76-318.44,243.28-318.44,62.3,0,97.9,36.59,97.9,87.03,0,118.67-180.97,188.89-279.87,160.21-2.97,18.79-4.95,36.59-4.95,53.4,0,107.79,42.53,151.31,104.83,151.31s136.47-59.34,158.23-202.73h1.98c-22.75,192.84-119.66,244.26-187.9,244.26s-133.51-55.38-133.51-175.04ZM336.91,376.82c0-49.45-18.79-72.19-54.39-72.19-82.08,0-150.32,119.66-170.1,227.45,107.79,20.77,224.49-41.53,224.49-155.26ZM849.89,729.87c0-25.71,10.88-63.29,21.76-97.91l54.39-168.12c11.87-37.58,20.77-75.16,20.77-95.93,0-27.69-14.83-38.57-43.51-38.57-51.42,0-99.88,51.42-140.43,137.46-18.79,40.55-47.47,119.66-94.94,310.52h-57.36l88.01-313.49c10.88-36.59,20.77-75.16,20.77-95.93,0-27.69-13.85-38.57-42.52-38.57-52.41,0-102.85,51.42-143.4,137.46-18.79,40.55-47.47,118.67-94.94,310.52h-55.38l112.74-427.22c2.97-11.87.99-13.85-9.89-17.8l-83.07-26.7v-1.98l167.13-11.87-66.26,220.53h1.98c49.45-146.36,124.6-220.53,197.79-220.53,46.48,0,69.22,30.66,69.22,73.18,0,30.66-22.74,94.94-39.56,147.35h1.98c48.46-146.36,120.65-220.53,194.82-220.53,46.48,0,73.18,30.66,73.18,73.18,0,30.66-12.86,74.17-23.73,107.79l-55.38,168.12c-8.9,26.7-18.79,53.4-18.79,76.15,0,16.81,5.93,30.66,25.71,30.66s44.5-15.82,64.28-47.47c30.66-46.48,45.49-117.68,50.44-161.2h1.98c-8.9,163.17-90.98,246.24-150.32,246.24-28.68,0-47.47-19.78-47.47-55.38ZM1052.22,729.87c0-19.78,5.94-50.44,13.85-82.08l76.15-297.67c2.97-11.87,0-13.85-10.88-17.8l-83.07-26.7v-1.98l163.17-11.87-89,348.1c-6.92,27.69-13.85,57.36-13.85,77.14,0,16.81,5.94,30.66,25.71,30.66s44.5-15.82,64.28-47.47c30.66-46.48,45.49-117.68,50.44-161.2h1.98c-8.9,163.17-90.98,246.24-150.32,246.24-28.68,0-48.46-19.78-48.46-55.38ZM1199.57,118.71c25.71,0,45.49,20.77,45.49,45.49s-20.77,45.49-45.49,45.49-45.49-20.77-45.49-45.49,20.77-45.49,45.49-45.49ZM1257.74,729.87c0-19.78,5.94-50.44,13.85-82.08l124.6-517.21c2.97-12.86,1.98-16.81-8.9-19.78l-87.03-26.7v-1.98l165.15-12.86-137.46,570.61c-6.92,27.69-13.85,57.36-13.85,77.14,0,16.81,5.93,30.66,25.71,30.66s44.5-15.82,64.28-47.47c30.66-46.48,45.49-117.68,50.44-161.2h1.98c-3.96,70.21-21.76,125.59-44.5,166.14-30.66,53.4-72.19,80.1-105.81,80.1-28.68,0-48.46-19.78-48.46-55.38ZM1382.33,1007.76l42.53-127.57h1.98l32.64,78.13c6.92,15.82,14.83,17.8,30.66,8.9,47.47-26.7,86.04-68.24,128.56-116.69,6.92-7.91,6.92-11.87,6.92-22.74,7.91-199.76-6.92-377.77-38.57-459.85-9.89-25.71-17.8-38.57-33.63-38.57-24.72,0-61.31,54.39-92.96,192.84h-1.98c23.73-132.52,53.4-230.42,122.63-230.42,21.76,0,42.53,10.88,56.37,53.4,35.6,105.82,42.52,257.12,37.58,437.11h1.98c103.84-139.44,149.33-266.02,149.33-345.14,0-46.48-14.83-87.03-35.6-116.69v-1.98l79.11-26.7c-13.84,220.53-73.18,357-201.74,521.17-94.94,120.65-178.01,197.79-267.01,197.79-6.92,0-13.84-.99-18.79-2.97Z";

const SVG_VIEWBOX = { width: 1920, height: 1080 };

// Vertex shader for fullscreen quad
const vertexShader = /* glsl */ `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

// First pass: render the text to a texture with SDF-like properties
const textFragmentShader = /* glsl */ `
varying vec2 vUv;
uniform sampler2D u_texture;

void main() {
    vec4 texColor = texture2D(u_texture, vUv);
    gl_FragColor = texColor;
}
`;

// Kawase blur - much higher quality than Gaussian, used in AAA games
const blurFragmentShader = /* glsl */ `
varying vec2 vUv;
uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform float u_offset;

void main() {
    vec2 texelSize = 1.0 / u_resolution;
    float offset = u_offset;

    vec4 color = vec4(0.0);

    // Kawase blur kernel - samples in a cross pattern with offset
    color += texture2D(u_texture, vUv + vec2(-offset, -offset) * texelSize);
    color += texture2D(u_texture, vUv + vec2( offset, -offset) * texelSize);
    color += texture2D(u_texture, vUv + vec2(-offset,  offset) * texelSize);
    color += texture2D(u_texture, vUv + vec2( offset,  offset) * texelSize);

    gl_FragColor = color * 0.25;
}
`;

// Final composite shader - blends sharp and blurred based on mouse
const compositeFragmentShader = /* glsl */ `
varying vec2 vUv;
uniform sampler2D u_textureSharp;
uniform sampler2D u_textureBlur1;
uniform sampler2D u_textureBlur2;
uniform sampler2D u_textureBlur3;
uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform float u_pixelRatio;
uniform float u_circleSize;
uniform float u_circleEdge;
uniform float u_time;

void main() {
    // Convert mouse to UV space
    vec2 mouseUV = u_mouse / (u_resolution / u_pixelRatio);
    mouseUV.y = 1.0 - mouseUV.y;

    // Distance from mouse with aspect ratio correction
    vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);
    float dist = length((vUv - mouseUV) * aspect);

    // Smooth falloff
    float t = 1.0 - smoothstep(0.0, u_circleSize, dist);
    t = pow(t, u_circleEdge);

    // Sample all blur levels
    vec4 sharp = texture2D(u_textureSharp, vUv);
    vec4 blur1 = texture2D(u_textureBlur1, vUv);
    vec4 blur2 = texture2D(u_textureBlur2, vUv);
    vec4 blur3 = texture2D(u_textureBlur3, vUv);

    // Progressive blur mixing for smooth gradient
    vec4 blurred = mix(blur1, blur2, t);
    blurred = mix(blurred, blur3, t * t);

    // Boost the glow intensity
    blurred.a *= 1.0 + t * 1.5;
    blurred.a = min(blurred.a, 1.0);

    // Final blend between sharp and blurred
    vec4 finalColor = mix(sharp, blurred, t);

    // Add soft glow halo
    float glow = blur3.a * t * 0.6;
    finalColor.a = max(finalColor.a, glow);

    // Subtle moving gradient - white/off-white/grey
    // Create a diagonal moving wave pattern
    float gradientSpeed = 0.15;
    float gradientScale = 1.5;
    float wave1 = sin((vUv.x + vUv.y * 0.5) * gradientScale + u_time * gradientSpeed) * 0.5 + 0.5;
    float wave2 = sin((vUv.x * 0.7 - vUv.y * 0.3) * gradientScale * 1.3 + u_time * gradientSpeed * 0.7) * 0.5 + 0.5;
    float combinedWave = mix(wave1, wave2, 0.5);
    
    // Map to subtle grey range (0.85 to 1.0 for very subtle effect)
    float brightness = 0.88 + combinedWave * 0.12;
    
    vec3 gradientColor = vec3(brightness);

    gl_FragColor = vec4(gradientColor, finalColor.a);
}
`;

interface EmilyCanvasProps {
  className?: string;
  width?: number;
  height?: number;
  circleSize?: number;
  circleEdge?: number;
}

const EmilyCanvas: FC<EmilyCanvasProps> = ({
  className = "",
  width = 1600,
  height = 900,
  circleSize = 0.35,
  circleEdge = 0.6,
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

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0, 1);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Create render targets for multi-pass blur
    const createRenderTarget = (scale = 1) => {
      return new THREE.WebGLRenderTarget(w * scale, h * scale, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        type: THREE.HalfFloatType,
      });
    };

    let rtText = createRenderTarget();
    let rtBlur1 = createRenderTarget(0.5);
    let rtBlur2 = createRenderTarget(0.25);
    let rtBlur3 = createRenderTarget(0.125);
    let rtTemp = createRenderTarget(0.5);

    // Offscreen canvas for text
    const offscreenCanvas = document.createElement("canvas");
    const offCtx = offscreenCanvas.getContext("2d");

    const createTexture = () => {
      if (!offCtx) return null;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      offscreenCanvas.width = w * dpr;
      offscreenCanvas.height = h * dpr;

      offCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      offCtx.clearRect(0, 0, w, h);

      const scaleX = w / SVG_VIEWBOX.width;
      const scaleY = h / SVG_VIEWBOX.height;
      const scale = Math.min(scaleX, scaleY);

      const offsetX = (w - SVG_VIEWBOX.width * scale) / 2;
      const offsetY = (h - SVG_VIEWBOX.height * scale) / 2;

      offCtx.save();
      offCtx.translate(offsetX, offsetY);
      offCtx.scale(scale, scale);

      const path = new Path2D(EMILY_PATH);
      offCtx.fillStyle = "#ffffff";
      offCtx.fill(path);

      offCtx.restore();

      const texture = new THREE.CanvasTexture(offscreenCanvas);
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.needsUpdate = true;
      return texture;
    };

    // Fullscreen quad geometry
    const geo = new THREE.PlaneGeometry(1, 1);

    // Text pass material
    const textMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader: textFragmentShader,
      uniforms: {
        u_texture: { value: null },
      },
      transparent: true,
    });

    // Blur material
    const blurMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader: blurFragmentShader,
      uniforms: {
        u_texture: { value: null },
        u_resolution: { value: new THREE.Vector2() },
        u_offset: { value: 1.0 },
      },
      transparent: true,
    });

    // Composite material
    const compositeMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader: compositeFragmentShader,
      uniforms: {
        u_textureSharp: { value: null },
        u_textureBlur1: { value: null },
        u_textureBlur2: { value: null },
        u_textureBlur3: { value: null },
        u_mouse: { value: vMouseDamp },
        u_resolution: { value: vResolution },
        u_pixelRatio: { value: 2 },
        u_circleSize: { value: circleSize },
        u_circleEdge: { value: circleEdge },
        u_time: { value: 0 },
      },
      transparent: true,
    });

    const quad = new THREE.Mesh(geo, compositeMaterial);
    scene.add(quad);

    // Kawase blur pass
    const applyBlur = (
      source: THREE.WebGLRenderTarget,
      dest: THREE.WebGLRenderTarget,
      offset: number
    ) => {
      blurMaterial.uniforms.u_texture.value = source.texture;
      blurMaterial.uniforms.u_resolution.value.set(dest.width, dest.height);
      blurMaterial.uniforms.u_offset.value = offset;
      quad.material = blurMaterial;
      renderer.setRenderTarget(dest);
      renderer.render(scene, camera);
    };

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
      compositeMaterial.uniforms.u_pixelRatio.value = dpr;

      // Resize render targets
      rtText.setSize(w * dpr, h * dpr);
      rtBlur1.setSize(w * dpr * 0.5, h * dpr * 0.5);
      rtBlur2.setSize(w * dpr * 0.25, h * dpr * 0.25);
      rtBlur3.setSize(w * dpr * 0.125, h * dpr * 0.125);
      rtTemp.setSize(w * dpr * 0.5, h * dpr * 0.5);

      // Recreate texture
      const oldTexture = textMaterial.uniforms.u_texture.value;
      if (oldTexture) oldTexture.dispose();
      textMaterial.uniforms.u_texture.value = createTexture();
    };

    resize();
    window.addEventListener("resize", resize);

    const ro = new ResizeObserver(() => resize());
    ro.observe(mountRef.current as Element);

    const update = () => {
      const time = performance.now() * 0.001;
      const dt = time - lastTime;
      lastTime = time;

      // Smooth mouse following with easing
      vMouseDamp.x = THREE.MathUtils.damp(vMouseDamp.x, vMouse.x, 6, dt);
      vMouseDamp.y = THREE.MathUtils.damp(vMouseDamp.y, vMouse.y, 6, dt);

      // Update time uniform for animated gradient
      compositeMaterial.uniforms.u_time.value = time;

      // Pass 1: Render text to texture
      quad.material = textMaterial;
      renderer.setRenderTarget(rtText);
      renderer.clear();
      renderer.render(scene, camera);

      // Pass 2-4: Progressive Kawase blur
      // First blur level
      applyBlur(rtText, rtBlur1, 1.0);
      applyBlur(rtBlur1, rtTemp, 2.0);
      applyBlur(rtTemp, rtBlur1, 3.0);

      // Second blur level
      applyBlur(rtBlur1, rtBlur2, 4.0);
      applyBlur(rtBlur2, rtTemp, 5.0);
      applyBlur(rtTemp, rtBlur2, 6.0);

      // Third blur level (maximum blur)
      applyBlur(rtBlur2, rtBlur3, 7.0);
      applyBlur(rtBlur3, rtTemp, 8.0);
      applyBlur(rtTemp, rtBlur3, 9.0);

      // Final composite pass
      compositeMaterial.uniforms.u_textureSharp.value = rtText.texture;
      compositeMaterial.uniforms.u_textureBlur1.value = rtBlur1.texture;
      compositeMaterial.uniforms.u_textureBlur2.value = rtBlur2.texture;
      compositeMaterial.uniforms.u_textureBlur3.value = rtBlur3.texture;

      quad.material = compositeMaterial;
      renderer.setRenderTarget(null);
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

      // Cleanup
      rtText.dispose();
      rtBlur1.dispose();
      rtBlur2.dispose();
      rtBlur3.dispose();
      rtTemp.dispose();
      renderer.dispose();

      const texture = textMaterial.uniforms.u_texture.value;
      if (texture) texture.dispose();
    };
  }, [circleSize, circleEdge]);

  return (
    <div
      ref={mountRef}
      className={`w-full h-full ${className}`}
      style={{ width, height }}
    />
  );
};

export default EmilyCanvas;
