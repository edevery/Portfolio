"use client";

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

interface LazyVideoProps
  extends Omit<React.VideoHTMLAttributes<HTMLVideoElement>, "src"> {
  src: string;
  rootMargin?: string;
}

export const LazyVideo = forwardRef<HTMLVideoElement, LazyVideoProps>(
  function LazyVideo({ src, rootMargin = "200px", poster, ...props }, ref) {
    const innerRef = useRef<HTMLVideoElement>(null);
    const [activeSrc, setActiveSrc] = useState<string | undefined>(undefined);
    const [hasError, setHasError] = useState(false);

    useImperativeHandle(ref, () => innerRef.current as HTMLVideoElement);

    useEffect(() => {
      const el = innerRef.current;
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSrc(src);
            observer.disconnect();
          }
        },
        { rootMargin },
      );

      observer.observe(el);
      return () => observer.disconnect();
    }, [src, rootMargin]);

    // Explicitly play after src is set (some browsers don't auto-trigger)
    useEffect(() => {
      const el = innerRef.current;
      if (!el || !activeSrc) return;

      const handleCanPlay = () => {
        el.play().catch(() => {
          // Autoplay may be blocked — non-fatal
        });
      };

      el.addEventListener("canplay", handleCanPlay, { once: true });
      return () => el.removeEventListener("canplay", handleCanPlay);
    }, [activeSrc]);

    if (hasError) {
      if (poster) {
        return (
          <img
            src={poster}
            alt=""
            className={props.className}
            style={props.style}
          />
        );
      }
      return null;
    }

    return (
      <video
        ref={innerRef}
        src={activeSrc}
        poster={poster}
        onError={() => setHasError(true)}
        {...props}
      />
    );
  },
);
