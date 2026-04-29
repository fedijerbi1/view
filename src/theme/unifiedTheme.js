/**
 * Unified Theme Object for All Components
 * Light theme with white background - modern, clean, scalable design
 * Compatible with existing "C" object pattern
 */

// ═══════════════════════════════════════════════════════════════════════════
// DEFINED COLOR VALUES - Light Theme (White Background)
// ═══════════════════════════════════════════════════════════════════════════

const COLORS = {
  // Primary brand colors
  primary: '#0c5cab',
  primaryLight: '#e3f2fd',
  primaryDark: '#0a4a8a',
  secondary: '#0a4a8a',
  
  // Status colors
  success: '#10b981',
  successLight: '#d1fae5',
  warning: '#f59e0b',
  warningLight: '#fef3c7',
  danger: '#ef4444',
  dangerLight: '#fee2e2',
  info: '#3b82f6',
  infoLight: '#dbeafe',
  accent: '#10b981',
  
  // Surfaces & Text - Light Theme
  surface: '#ffffff',        // Pure white background
  surfaceAlt: '#f9fafb',     // Light gray for cards
  surfaceHover: '#f3f4f6',   // Light gray for hover states
  text: '#1f2937',           // Dark gray for text
  textMid: '#6b7280',        // Medium gray
  textLight: '#9ca3af',      // Light gray
  textMuted: '#d1d5db',      // Muted gray
  
  // Borders
  border: '#e5e7eb',         // Light border
  borderLight: '#f3f4f6',    // Very light border
};

const SHADOWS = {
  inset: 'inset 0 2px 4px rgba(0, 0, 0, 0.05)',
  card: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
  modal: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  hover: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  focus: '0 0 0 3px rgba(12, 92, 171, 0.1), 0 0 0 1px #0c5cab',
};

const ACCENTS = {
  primary: COLORS.primary,
  secondary: COLORS.secondary,
  success: COLORS.success,
  warning: COLORS.warning,
  danger: COLORS.danger,
  info: COLORS.info,
};

const THEME = {
  // ═══════════════════════════════════════════════════════════════════════════
  // COLORS - Direct hex values
  // ═══════════════════════════════════════════════════════════════════════════
  
  primary: COLORS.primary,
  primaryLight: COLORS.primaryLight,
  primaryDark: COLORS.primaryDark,
  secondary: COLORS.secondary,
  
  // Status
  success: COLORS.success,
  warning: COLORS.warning,
  danger: COLORS.danger,
  info: COLORS.info,
  accent: COLORS.accent,
  
  // Surfaces & Text
  surface: COLORS.surface,
  surfaceAlt: COLORS.surfaceAlt,
  surfaceHover: COLORS.surfaceHover,
  text: COLORS.text,
  textMid: COLORS.textMid,
  textLight: COLORS.textLight,
  textMuted: COLORS.textMuted,
  
  // Borders
  border: COLORS.border,
  borderLight: COLORS.borderLight,
  
  // ═══════════════════════════════════════════════════════════════════════════
  // SHADOWS - Direct shadow definitions
  // ═══════════════════════════════════════════════════════════════════════════
  
  insetShadow: SHADOWS.inset,
  cardShadow: SHADOWS.card,
  modalShadow: SHADOWS.modal,
  hoverShadow: SHADOWS.hover,
  
  // ═══════════════════════════════════════════════════════════════════════════
  // SPACING - Using CSS Variables
  // ═══════════════════════════════════════════════════════════════════════════
  
  spacing: {
    1: 'var(--space-1)',
    2: 'var(--space-2)',
    3: 'var(--space-3)',
    4: 'var(--space-4)',
    5: 'var(--space-5)',
    6: 'var(--space-6)',
    8: 'var(--space-8)',
    10: 'var(--space-10)',
    12: 'var(--space-12)',
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // TYPOGRAPHY - Using CSS Variables
  // ═══════════════════════════════════════════════════════════════════════════
  
  fontSize: {
    xs: 'var(--font-size-xs)',
    sm: 'var(--font-size-sm)',
    base: 'var(--font-size-base)',
    md: 'var(--font-size-md)',
    lg: 'var(--font-size-lg)',
    xl: 'var(--font-size-xl)',
  },
  
  fontFamily: 'var(--font-primary)',
  fontMono: 'var(--font-mono)',
  
  // ═══════════════════════════════════════════════════════════════════════════
  // RADIUS - Using CSS Variables
  // ═══════════════════════════════════════════════════════════════════════════
  
  radius: {
    sm: 'var(--radius-sm)',
    md: 'var(--radius-md)',
    lg: 'var(--radius-lg)',
    xl: 'var(--radius-xl)',
    full: 'var(--radius-full)',
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // TRANSITIONS - Using CSS Variables
  // ═══════════════════════════════════════════════════════════════════════════
  
  transition: {
    fast: 'var(--transition-fast)',
    base: 'var(--transition-base)',
    slow: 'var(--transition-slow)',
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // RESPONSIVE BREAKPOINTS
  // ═══════════════════════════════════════════════════════════════════════════
  
  breakpoint: {
    xs: 0,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
  },
};

/**
 * Backward Compatible "C" Object
 * For use in existing components - exactly replaces old C object
 */
export const C = {
  // Colors
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
  borderLight: COLORS.borderLight,
  accent: COLORS.accent,
  warning: COLORS.warning,
  danger: COLORS.danger,
  success: COLORS.success,
  info: COLORS.info,
  
  // Shadows
  insetShadow: SHADOWS.inset,
  cardShadow: SHADOWS.card,
  modalShadow: SHADOWS.modal,
  
  // Typography
  fontFamily: "'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
};

/**
 * Theme presets for different accent colors
 */
export const THEMES = {
  primary: {
    accent: COLORS.primary,
    surface: COLORS.surface,
    text: COLORS.text,
  },
  secondary: {
    accent: COLORS.secondary,
    surface: COLORS.surface,
    text: COLORS.text,
  },
  success: {
    accent: COLORS.success,
    surface: COLORS.surface,
    text: COLORS.text,
  },
  warning: {
    accent: COLORS.warning,
    surface: COLORS.surface,
    text: COLORS.text,
  },
  danger: {
    accent: COLORS.danger,
    surface: COLORS.surface,
    text: COLORS.text,
  },
};

/**
 * Shadow definitions exported separately
 */
export { SHADOWS, ACCENTS, COLORS };

/**
 * Predefined Style Objects for Common Components
 */
export const STYLES = {
  // Container/Card
  card: {
    background: COLORS.surface,
    border: `1px solid ${COLORS.border}`,
    borderRadius: '12px',
    padding: '20px 24px',
    boxShadow: SHADOWS.card,
    transition: 'all 200ms ease-in-out',
  },
  
  // Button Primary
  buttonPrimary: {
    background: COLORS.primary,
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    padding: '8px 20px',
    fontWeight: 600,
    fontSize: '14px',
    cursor: 'pointer',
    boxShadow: SHADOWS.card,
    transition: 'all 200ms ease-in-out',
  },
  
  // Input
  input: {
    background: COLORS.surface,
    color: COLORS.text,
    border: 'none',
    borderRadius: '10px',
    padding: '8px 12px',
    fontSize: '16px',
    boxShadow: SHADOWS.inset,
    outline: 'none',
    transition: 'all 200ms ease-in-out',
  },
  
  // Badge
  badge: {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 600,
    background: COLORS.surfaceAlt,
    color: COLORS.textMid,
    border: `1px solid ${COLORS.border}`,
  },
};

export default THEME;
