import { create } from 'zustand';

/**
 * Performance Tier System
 * 
 * Detects device capability on mount and dynamically adjusts quality tier
 * based on real-time FPS monitoring. Components consume multipliers to
 * scale particle counts, glow layers, and geometry detail.
 * 
 * Tiers:
 *   high   — Desktop with good GPU. Full quality.
 *   medium — Older laptops or mid-range phones. Half particles.
 *   low    — Budget phones or throttled CPUs. Quarter particles, reduced glow.
 */

const TIER_CONFIG = {
  high: {
    particleMultiplier: 1.0,
    starMultiplier: 1.0,
    asteroidMultiplier: 1.0,
    glowLayers: 4,
    sphereSegments: 64,
    enableGlitter: true,
  },
  medium: {
    particleMultiplier: 0.5,
    starMultiplier: 0.6,
    asteroidMultiplier: 0.5,
    glowLayers: 3,
    sphereSegments: 48,
    enableGlitter: true,
  },
  low: {
    particleMultiplier: 0.25,
    starMultiplier: 0.3,
    asteroidMultiplier: 0.25,
    glowLayers: 2,
    sphereSegments: 32,
    enableGlitter: false,
  },
};

// Detect mobile device
const detectMobile = () => {
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent || '';
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  return isTouchDevice && isMobileUA;
};

// Detect initial tier based on hardware hints
const detectInitialTier = () => {
  const isMobile = detectMobile();
  
  if (isMobile) {
    const memory = navigator.deviceMemory; // GB, if available
    const cores = navigator.hardwareConcurrency || 2;
    const dpr = window.devicePixelRatio || 1;
    
    // High-end flagships (e.g. iPhone 15 Pro, Galaxy S24, Pixel 8 Pro)
    if (cores >= 6 && dpr >= 2.5 && (!memory || memory >= 6)) return 'high';
    // Mid-range phones
    if (cores >= 4 && (!memory || memory >= 4)) return 'medium';
    // Budget devices
    return 'low';
  }
  
  // Desktop — check for low-end indicators
  const cores = navigator.hardwareConcurrency || 4;
  if (cores <= 2) return 'medium';
  
  return 'high';
};

// FPS sampling state (module-level for performance — no React re-renders)
const FPS_SAMPLE_SIZE = 60;
let frameTimes = [];
let downgradeTimer = 0;
let upgradeTimer = 0;

const usePerformance = create((set, get) => ({
  tier: detectInitialTier(),
  isMobile: detectMobile(),
  config: TIER_CONFIG[detectInitialTier()],
  
  // Called every frame from <FPSMonitor />
  reportFrame: (delta) => {
    frameTimes.push(delta);
    if (frameTimes.length > FPS_SAMPLE_SIZE) {
      frameTimes.shift();
    }
    
    // Only evaluate after we have enough samples
    if (frameTimes.length < FPS_SAMPLE_SIZE) return;
    
    const avgDelta = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
    const avgFPS = 1 / avgDelta;
    const currentTier = get().tier;
    
    // Downgrade logic: sustained low FPS
    if (avgFPS < 24) {
      downgradeTimer += delta;
      upgradeTimer = 0;
      
      if (downgradeTimer > 2.0) { // 2 seconds of bad performance
        downgradeTimer = 0;
        frameTimes = [];
        
        if (currentTier === 'high') {
          set({ tier: 'medium', config: TIER_CONFIG.medium });
        } else if (currentTier === 'medium') {
          set({ tier: 'low', config: TIER_CONFIG.low });
        }
      }
    }
    // Upgrade logic: sustained good FPS
    else if (avgFPS > 50) {
      upgradeTimer += delta;
      downgradeTimer = 0;
      
      if (upgradeTimer > 5.0) { // 5 seconds of good performance
        upgradeTimer = 0;
        frameTimes = [];
        
        if (currentTier === 'low') {
          set({ tier: 'medium', config: TIER_CONFIG.medium });
        } else if (currentTier === 'medium') {
          set({ tier: 'high', config: TIER_CONFIG.high });
        }
      }
    } else {
      // FPS is acceptable — reset both timers
      downgradeTimer = 0;
      upgradeTimer = 0;
    }
  },
  
  // Manual override for testing
  setTier: (tier) => {
    if (TIER_CONFIG[tier]) {
      set({ tier, config: TIER_CONFIG[tier] });
    }
  },
}));

export default usePerformance;
