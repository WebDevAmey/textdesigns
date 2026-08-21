/**
 * MATHEMATICAL DESIGN TOKENS
 * 
 * Base unit: 4px
 * Typography ratio: 1.25 (Major Third)
 * 
 * This file provides TypeScript constants that mirror the CSS custom properties
 * in globals.css, enabling type-safe access to design tokens in components.
 */

// ═══════════════════════════════════════════════════════════════════
// SPACING SCALE
// Base: 4px, scaled by unit multiples
// ═══════════════════════════════════════════════════════════════════

export const spacing = {
  '0': '0px',
  'px': '1px',
  '0.5': '2px',    // 0.5 × unit
  '1': '4px',      // 1 × unit
  '1.5': '6px',    // 1.5 × unit
  '2': '8px',      // 2 × unit
  '2.5': '10px',   // 2.5 × unit
  '3': '12px',     // 3 × unit
  '3.5': '14px',   // 3.5 × unit
  '4': '16px',     // 4 × unit
  '5': '20px',     // 5 × unit
  '6': '24px',     // 6 × unit
  '7': '28px',     // 7 × unit
  '8': '32px',     // 8 × unit
  '9': '36px',     // 9 × unit
  '10': '40px',    // 10 × unit
  '12': '48px',    // 12 × unit
  '14': '56px',    // 14 × unit
  '16': '64px',    // 16 × unit
  '20': '80px',    // 20 × unit
  '24': '96px',    // 24 × unit
  '28': '112px',   // 28 × unit
  '32': '128px',   // 32 × unit
  '40': '160px',   // 40 × unit
  '48': '192px',   // 48 × unit
  '56': '224px',   // 56 × unit
  '64': '256px',   // 64 × unit
} as const;

// ═══════════════════════════════════════════════════════════════════
// TYPOGRAPHY SCALE
// Ratio: 1.25 (Major Third)
// Base: 16px
// ═══════════════════════════════════════════════════════════════════

export const typography = {
  // Font sizes (in rem, relative to 16px base)
  fontSize: {
    xs: '0.64rem',    // 10.24px — 16 × 1.25^(-2)
    sm: '0.8rem',     // 12.8px  — 16 × 1.25^(-1)
    base: '1rem',     // 16px    — base
    lg: '1.25rem',    // 20px    — 16 × 1.25
    xl: '1.563rem',   // 25px    — 16 × 1.25^2
    '2xl': '1.953rem', // 31.25px — 16 × 1.25^3
    '3xl': '2.441rem', // 39.06px — 16 × 1.25^4
    '4xl': '3.052rem', // 48.83px — 16 × 1.25^5
    '5xl': '3.815rem', // 61.04px — 16 × 1.25^6
    '6xl': '4.768rem', // 76.29px — 16 × 1.25^7
    '7xl': '5.96rem',  // 95.37px — 16 × 1.25^8
    '8xl': '7.451rem', // 119.22px — 16 × 1.25^9
  },

  // Line heights
  lineHeight: {
    none: 1,
    tight: 1.15,     // Headings
    snug: 1.3,       // Subheadings
    normal: 1.5,     // Body text
    relaxed: 1.625,  // Reading text
    loose: 2,        // Spacious
  },

  // Letter spacing (in em)
  letterSpacing: {
    tighter: '-0.05em',  // Hero/display
    tight: '-0.025em',   // Headings
    normal: '0em',       // Body
    wide: '0.025em',     // Labels
    wider: '0.05em',     // Small caps
    widest: '0.1em',     // Eyebrows
  },

  // Font weights
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
} as const;

// ═══════════════════════════════════════════════════════════════════
// ANIMATION TIMING SCALE
// ═══════════════════════════════════════════════════════════════════

export const timing = {
  // Durations (in milliseconds)
  duration: {
    instant: 0,
    micro: 75,
    fast: 150,
    normal: 300,
    moderate: 500,
    slow: 750,
    dramatic: 1000,
    cinematic: 1500,
  },

  // Stagger intervals (in seconds)
  stagger: {
    micro: 0.01,    // 10ms
    fast: 0.025,    // 25ms
    normal: 0.04,   // 40ms
    moderate: 0.06, // 60ms
    slow: 0.08,     // 80ms
    dramatic: 0.1,  // 100ms
  },

  // Easing functions
  ease: {
    outExpo: [0.16, 1, 0.3, 1] as const,
    outQuart: [0.25, 1, 0.5, 1] as const,
    outBack: [0.33, 1, 0.68, 1] as const,
    inOutQuart: [0.76, 0, 0.24, 1] as const,
    spring: [0.34, 1.56, 0.64, 1] as const,
  },
} as const;

// ═══════════════════════════════════════════════════════════════════
// BORDER RADIUS SCALE
// Base: 0.625rem (10px)
// ═══════════════════════════════════════════════════════════════════

export const radius = {
  none: '0',
  xs: '0.25rem',    // 4px
  sm: '0.375rem',   // 6px
  md: '0.5rem',     // 8px
  lg: '0.625rem',   // 10px — base
  xl: '0.875rem',   // 14px
  '2xl': '1.125rem', // 18px
  '3xl': '1.375rem', // 22px
  full: '9999px',
} as const;

// ═══════════════════════════════════════════════════════════════════
// GOLDEN RATIO
// ═══════════════════════════════════════════════════════════════════

export const PHI = 1.618;

// ═══════════════════════════════════════════════════════════════════
// CONTAINER WIDTHS
// ═══════════════════════════════════════════════════════════════════

export const containers = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1440px',
} as const;

// ═══════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════

/**
 * Calculate stagger delay for character-based animations.
 * delay(i) = i × Δt
 * 
 * @param index - Character index
 * @param staggerInterval - Time between each character (in seconds)
 * @returns Delay in seconds
 */
export function staggerDelay(index: number, staggerInterval: number): number {
  return index * staggerInterval;
}

/**
 * Calculate wave position.
 * y(i, t) = A × sin(ωt + iφ)
 * 
 * @param index - Character index
 * @param time - Current time
 * @param amplitude - Wave height
 * @param frequency - Wave frequency
 * @param phase - Phase offset per character
 * @returns Y position
 */
export function wavePosition(
  index: number,
  time: number,
  amplitude: number,
  frequency: number,
  phase: number
): number {
  return amplitude * Math.sin(frequency * time + index * phase);
}

/**
 * Calculate distance-based falloff.
 * strength = max(0, 1 - distance / radius)
 * 
 * @param distance - Distance from cursor
 * @param radius - Interaction radius
 * @returns Strength factor (0-1)
 */
export function distanceFalloff(distance: number, radius: number): number {
  return Math.max(0, 1 - distance / radius);
}

/**
 * Apply golden ratio to a value.
 * @param value - Base value
 * @returns Value × φ
 */
export function goldenRatio(value: number): number {
  return value * PHI;
}

/**
 * Calculate proportional spacing.
 * @param base - Base spacing value
 * @param multiplier - Multiplier (can be golden ratio)
 * @returns Proportional spacing
 */
export function proportionalSpace(base: number, multiplier: number): number {
  return base * multiplier;
}
