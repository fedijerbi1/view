/**
 * Dashboard Design System - Design Tokens (Universal)
 * Dark-themed cloud-platform aesthetic with modular grids, glass-like panels
 * Style: Heroku/Vercel/GitHub inspired, modern, clean, productivity-focused
 */

// ═══════════════════════════════════════════════════════════════════════════
// COLOR PALETTE
// ═══════════════════════════════════════════════════════════════════════════

export const COLORS = {
  // Primary & Semantic
  primary: '#0C5CAB',           // Main brand color (blue)
  primaryLight: '#4A90E2',      // Primary lighter variant
  primaryDark: '#0A4A8A',       // Primary darker variant
  secondary: '#0a4a8a',         // Secondary brand
  
  // Status
  success: '#10b981',           // Green - healthy/complete
  warning: '#f59e0b',           // Amber - caution
  danger: '#ef4444',            // Red - critical/error
  info: '#3b82f6',              // Blue - informational
  accent: '#10b981',            // Accent (green)
  
  // Surface & Backgrounds
  surface: '#09090b',           // Primary background (near-black)
  surfaceAlt: '#1a1a1e',        // Secondary background (darker variant)
  surfaceHover: '#242429',      // Tertiary background (hover state)
  
  // Text & Contrast
  text: '#fafafa',              // Primary text (near-white)
  textMid: '#a1a1a6',           // Secondary text (medium gray)
  textLight: '#7a7a80',         // Tertiary text (lighter gray)
  textMuted: '#6b7280',         // Muted text (very light)
  
  // Borders & Dividers
  border: '#2d2d33',            // Border color (dark gray)
  borderLight: '#3d3d42',       // Light border variant
};

// ═══════════════════════════════════════════════════════════════════════════
// TYPOGRAPHY SCALE (pt → px @ 16px baseline)
// ═══════════════════════════════════════════════════════════════════════════

export const TYPOGRAPHY = {
  // Font families
  families: {
    primary: "'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    display: "'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    mono: "'IBM Plex Mono', 'Courier New', monospace",
  },
  
  // Scale: 12, 14, 16, 20, 24, 32
  sizes: {
    xs: 12,    // Labels, captions, tags
    sm: 14,    // Small text, subtitles
    base: 16,  // Body text, default
    md: 20,    // Subheadings
    lg: 24,    // Section titles
    xl: 32,    // Page titles
  },
  
  // Font weights: 100, 200, 300, 400, 500, 600, 700, 800, 900
  weights: {
    thin: 100,
    extralight: 200,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// SPACING SCALE (8pt baseline grid)
// ═══════════════════════════════════════════════════════════════════════════

export const SPACING = {
  0: 0,
  1: '4px',    // 0.5 unit
  2: '8px',    // 1 unit
  3: '12px',   // 1.5 units
  4: '16px',   // 2 units
  5: '20px',   // 2.5 units
  6: '24px',   // 3 units
  7: '28px',   // 3.5 units
  8: '32px',   // 4 units
  9: '36px',   // 4.5 units
  10: '40px',  // 5 units
  12: '48px',  // 6 units
  16: '64px',  // 8 units
};

// ═══════════════════════════════════════════════════════════════════════════
// BORDER RADIUS (rounded corners)
// ═══════════════════════════════════════════════════════════════════════════

export const RADIUS = {
  none: 0,
  sm: '6px',        // Small buttons, inputs
  md: '10px',       // Default interactive elements
  lg: '12px',       // Cards, panels
  xl: '14px',       // Large containers
  full: '20px',     // Full rounded (pills, badges)
  circle: '50%',    // Perfect circle
};

// ═══════════════════════════════════════════════════════════════════════════
// SHADOWS (glass-like panels, depth hierarchy)
// ═══════════════════════════════════════════════════════════════════════════

export const SHADOWS = {
  // Subtle inset shadow (neumorphic depression)
  inset: 'inset 0 2px 4px rgba(0, 0, 0, 0.25), inset 0 -2px 4px rgba(255, 255, 255, 0.05)',
  
  // Card shadow (raised elevation)
  card: '0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 6px rgba(0, 0, 0, 0.1)',
  
  // Modal/overlay shadow (strong elevation)
  modal: '0 12px 40px rgba(0, 0, 0, 0.25), 0 8px 20px rgba(0, 0, 0, 0.15)',
  
  // Hover elevation (interactive feedback)
  hover: '0 8px 24px rgba(0, 0, 0, 0.2), 0 4px 12px rgba(0, 0, 0, 0.12)',
  
  // Focus ring (keyboard navigation)
  focus: `0 0 0 3px ${COLORS.primary}40, 0 0 0 1px ${COLORS.primary}`,
};

// ═══════════════════════════════════════════════════════════════════════════
// TRANSITIONS & ANIMATIONS
// ═══════════════════════════════════════════════════════════════════════════

export const MOTION = {
  // Standard easing curves
  fast: '150ms ease-in-out',
  base: '200ms ease-in-out',
  slow: '300ms ease-in-out',
  
  // Specific curves
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
};

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT PRESETS (reusable combinations)
// ═══════════════════════════════════════════════════════════════════════════

export const COMPONENTS = {
  // Button variants
  button: {
    primary: {
      background: COLORS.primary,
      color: COLORS.text,
      padding: `${SPACING[2]} ${SPACING[5]}`,
      borderRadius: RADIUS.md,
      fontWeight: TYPOGRAPHY.weights.semibold,
      fontSize: TYPOGRAPHY.sizes.sm,
      border: 'none',
      cursor: 'pointer',
      transition: `all ${MOTION.base}`,
      boxShadow: SHADOWS.card,
    },
    secondary: {
      background: COLORS.surfaceAlt,
      color: COLORS.primary,
      padding: `${SPACING[2]} ${SPACING[5]}`,
      borderRadius: RADIUS.md,
      fontWeight: TYPOGRAPHY.weights.semibold,
      fontSize: TYPOGRAPHY.sizes.sm,
      border: `1px solid ${COLORS.border}`,
      cursor: 'pointer',
      transition: `all ${MOTION.base}`,
      boxShadow: SHADOWS.inset,
    },
    ghost: {
      background: 'transparent',
      color: COLORS.primary,
      padding: `${SPACING[2]} ${SPACING[5]}`,
      borderRadius: RADIUS.md,
      fontWeight: TYPOGRAPHY.weights.semibold,
      fontSize: TYPOGRAPHY.sizes.sm,
      border: `1px solid ${COLORS.primary}`,
      cursor: 'pointer',
      transition: `all ${MOTION.base}`,
    },
  },
  
  // Input field
  input: {
    background: COLORS.surface,
    color: COLORS.text,
    padding: `${SPACING[2]} ${SPACING[3]}`,
    borderRadius: RADIUS.md,
    border: 'none',
    fontSize: TYPOGRAPHY.sizes.base,
    boxShadow: SHADOWS.inset,
    outline: 'none',
    transition: `all ${MOTION.base}`,
  },
  
  // Card/Panel
  card: {
    background: COLORS.surface,
    border: `1px solid ${COLORS.border}`,
    borderRadius: RADIUS.lg,
    padding: `${SPACING[5]} ${SPACING[6]}`,
    boxShadow: SHADOWS.card,
  },
  
  // Badge
  badge: {
    display: 'inline-block',
    padding: `${SPACING[1]} ${SPACING[3]}`,
    borderRadius: RADIUS.full,
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: TYPOGRAPHY.weights.semibold,
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// ACCESSIBILITY PRESETS
// ═══════════════════════════════════════════════════════════════════════════

export const A11Y = {
  // WCAG 2.2 AA compliant contrast ratios
  minTouchTarget: '44px',  // Min touch area for keyboard users
  
  // Focus states (keyboard navigation)
  focusRing: `
    outline: 2px solid ${COLORS.primary};
    outline-offset: 2px;
  `,
  
  // Reduced motion support
  prefersReducedMotion: '@media (prefers-reduced-motion: reduce)',
};

// ═══════════════════════════════════════════════════════════════════════════
// RESPONSIVE BREAKPOINTS (mobile-first)
// ═══════════════════════════════════════════════════════════════════════════

export const BREAKPOINTS = {
  xs: 0,       // Mobile
  sm: 640,     // Tablet portrait
  md: 768,     // Tablet landscape
  lg: 1024,    // Desktop
  xl: 1280,    // Large desktop
  xxl: 1536,   // Extra large
};

// ═══════════════════════════════════════════════════════════════════════════
// UNIFIED THEME OBJECT (backward compatible with existing codebase)
// ═══════════════════════════════════════════════════════════════════════════

export const THEME = {
  // Existing "C" object compatibility
  primary: COLORS.primary,
  primaryLight: COLORS.primaryLight,
  primaryDark: COLORS.primaryDark,
  secondary: COLORS.secondary,
  surface: COLORS.surface,
  surfaceAlt: COLORS.surfaceAlt,
  surfaceHover: COLORS.surfaceHover,
  text: COLORS.text,
  textMid: COLORS.textMid,
  textLight: COLORS.textLight,
  textMuted: COLORS.textMuted,
  border: COLORS.border,
  accent: COLORS.accent,
  warning: COLORS.warning,
  danger: COLORS.danger,
  success: COLORS.success,
  info: COLORS.info,
  
  // Shadow system
  insetShadow: SHADOWS.inset,
  cardShadow: SHADOWS.card,
  modalShadow: SHADOWS.modal,
  
  // Typography
  fontFamily: TYPOGRAPHY.families.primary,
  monoFamily: TYPOGRAPHY.families.mono,
};

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT DEFAULT (legacy compatibility)
// ═══════════════════════════════════════════════════════════════════════════

export default THEME;
