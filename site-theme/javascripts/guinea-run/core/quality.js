/*
 * How much the game draws, so a small phone stays smooth.
 *
 * The first tier is a guess from the device. Then the frame time is measured
 * every two seconds, and the game drops one tier when frames are slow, at most
 * twice. It never climbs back: a tier that flips back and forth looks worse
 * than one that stays a little lower.
 */

export const TIERS = [
  // 0: weak phones
  { name: "low", pixelRatio: 1, shadows: false, drawDistance: 70, antialias: false },
  // 1: most phones and small laptops
  { name: "medium", pixelRatio: 1.5, shadows: false, drawDistance: 95, antialias: true },
  // 2: desktops
  { name: "high", pixelRatio: 1.75, shadows: true, drawDistance: 110, antialias: true }
];

const SAMPLE_MS = 2000;
const SLOW_FRAME_MS = 22;
const MAX_DROPS = 2;

/** The tier to start with, from what the browser says about the device. */
export function initialTier() {
  const cores = navigator.hardwareConcurrency || 4;
  const memory = navigator.deviceMemory || 4;
  const coarse = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
  const small = Math.min(window.innerWidth, window.innerHeight) < 500;
  if (cores <= 2 || memory <= 2) {
    return 0;
  }
  if (coarse || small) {
    return 1;
  }
  return 2;
}

/** Measures frames and calls onDrop(newTier) when the device cannot keep up. */
export function createQualityMonitor(tier, onDrop) {
  let current = tier;
  let drops = 0;
  let elapsed = 0;
  let frames = 0;
  return {
    get tier() {
      return current;
    },
    frame(deltaMs) {
      // A long pause (tab hidden, debugger) is not a slow device
      if (deltaMs > 250) {
        return;
      }
      elapsed += deltaMs;
      frames += 1;
      if (elapsed < SAMPLE_MS) {
        return;
      }
      const average = elapsed / frames;
      elapsed = 0;
      frames = 0;
      if (average > SLOW_FRAME_MS && current > 0 && drops < MAX_DROPS) {
        current -= 1;
        drops += 1;
        onDrop(current);
      }
    },
    reset() {
      elapsed = 0;
      frames = 0;
    }
  };
}

/** True when the reader asked the system for less motion. */
export function reducedMotion() {
  return Boolean(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
}
