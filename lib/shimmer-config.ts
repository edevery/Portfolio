/**
 * SHIMMER ANIMATION CONFIGURATION
 *
 * These constants control the initial "reveal" animation that shows off
 * the interactive effect before the user touches anything.
 *
 * Adjust these to tune the animation feel.
 */

export const SHIMMER_CONFIG = {
  // ═══════════════════════════════════════════════════════════════════
  // TIMING
  // ═══════════════════════════════════════════════════════════════════

  /** Delay before shimmer starts after load (ms) */
  DELAY_MS: 400,

  /** Duration of the shimmer sweep (ms) */
  DURATION_MS: 2000,

  /** Fade-in duration for the canvas (ms) */
  FADE_DURATION_MS: 500,

  // ═══════════════════════════════════════════════════════════════════
  // PATH
  // ═══════════════════════════════════════════════════════════════════

  /** Start X position (fraction of width, negative = off-screen left) */
  START_X: -0.1,

  /** End X position (fraction of width, >1 = off-screen right) */
  END_X: 1.1,

  /** Y position (fraction of height, 0.5 = vertical center) */
  Y: 0.45,

  // ═══════════════════════════════════════════════════════════════════
  // EASING
  // ═══════════════════════════════════════════════════════════════════

  /**
   * Easing function for the shimmer motion
   * Options: 'linear' | 'easeInOutCubic' | 'easeOutCubic' | 'easeInOutQuad' | 'easeOutQuad'
   */
  EASING: "easeInOutCubic" as EasingType,
};

// ═══════════════════════════════════════════════════════════════════════
// EASING FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════

export type EasingType =
  | "linear"
  | "easeInOutCubic"
  | "easeOutCubic"
  | "easeInOutQuad"
  | "easeOutQuad";

export const EASINGS: Record<EasingType, (t: number) => number> = {
  linear: (t) => t,
  easeInOutCubic: (t) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  easeOutCubic: (t) => 1 - Math.pow(1 - t, 3),
  easeInOutQuad: (t) =>
    t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
  easeOutQuad: (t) => 1 - (1 - t) * (1 - t),
};

// ═══════════════════════════════════════════════════════════════════════
// HELPER
// ═══════════════════════════════════════════════════════════════════════

/**
 * Calculate the shimmer "virtual mouse" position at a given time
 */
export function getShimmerPosition(
  elapsedMs: number,
  canvasWidth: number,
  canvasHeight: number,
  config = SHIMMER_CONFIG
): { x: number; y: number; progress: number; complete: boolean } {
  const progress = Math.min(1, Math.max(0, elapsedMs / config.DURATION_MS));
  const easedProgress = EASINGS[config.EASING](progress);

  const x =
    (config.START_X + easedProgress * (config.END_X - config.START_X)) *
    canvasWidth;
  const y = config.Y * canvasHeight;

  return {
    x,
    y,
    progress,
    complete: progress >= 1,
  };
}
