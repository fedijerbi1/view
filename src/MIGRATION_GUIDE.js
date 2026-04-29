/**
 * Dashboard Design System - Component Migration Guide
 * How to migrate existing components to the new unified design system
 */

// ═══════════════════════════════════════════════════════════════════════════
// MIGRATION PATTERNS
// ═══════════════════════════════════════════════════════════════════════════

// ✅ BEFORE: Old inline styles with "C" object
// ─────────────────────────────────────────────────────────────────────────

const OldPattern = () => {
  const C = {
    primary: '#0C5CAB',
    surface: '#09090b',
    text: '#fafafa',
    textMid: '#a1a1a6',
    cardShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    insetShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.25)',
    border: '#2d2d33',
  };

  return (
    <div style={{
      background: C.surface,
      borderRadius: 16,
      padding: '20px 24px',
      border: `1px solid ${C.border}`,
      boxShadow: C.cardShadow,
    }}>
      <h2 style={{ color: C.text, fontSize: 20, fontWeight: 700 }}>Title</h2>
      <button style={{
        background: C.primary,
        color: 'white',
        padding: '12px 20px',
        borderRadius: 10,
        border: 'none',
        cursor: 'pointer',
      }}>
        Click me
      </button>
    </div>
  );
};

// ✅ AFTER: New CSS Variable Pattern
// ─────────────────────────────────────────────────────────────────────────

const NewPattern = () => {
  return (
    <div className="card">
      <h2>Title</h2>
      <button className="btn btn-primary">Click me</button>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// SPECIFIC COMPONENT MIGRATIONS
// ═══════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────
// 1. CARD COMPONENT
// ─────────────────────────────────────────────────────────────────────────

// BEFORE:
function CardOld({ children, style = {} }) {
  const C = {
    surface: '#09090b',
    border: '#2d2d33',
    cardShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  };
  
  return (
    <div style={{
      background: C.surface,
      borderRadius: 16,
      border: `1px solid ${C.border}`,
      boxShadow: C.cardShadow,
      padding: "20px 24px",
      ...style
    }}>
      {children}
    </div>
  );
}

// AFTER:
function CardNew({ children, className = '', ...props }) {
  return (
    <div className={`card ${className}`} {...props}>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// 2. BUTTON COMPONENT
// ─────────────────────────────────────────────────────────────────────────

// BEFORE:
function ButtonOld({ onClick, children }) {
  const C = {
    primary: '#0C5CAB',
    cardShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  };
  
  return (
    <button
      onClick={onClick}
      style={{
        background: C.primary,
        color: '#fff',
        border: 'none',
        borderRadius: 12,
        padding: '12px 20px',
        fontSize: 15,
        fontWeight: 700,
        cursor: 'pointer',
        boxShadow: C.cardShadow,
      }}
    >
      {children}
    </button>
  );
}

// AFTER:
function ButtonNew({ onClick, children, variant = 'primary', ...props }) {
  return (
    <button
      className={`btn btn-${variant}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// 3. BADGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────

// BEFORE:
function BadgeOld({ children, color = 'bg' }) {
  const colors = {
    bg: { bg: '#1a1a1e', text: '#fafafa' },
    success: { bg: '#10b981', text: '#fff' },
    warning: { bg: '#f59e0b', text: '#fff' },
  };
  
  const c = colors[color] || colors.bg;
  
  return (
    <span style={{
      background: c.bg,
      color: c.text,
      borderRadius: 20,
      padding: '3px 10px',
      fontSize: 12,
      fontWeight: 600,
    }}>
      {children}
    </span>
  );
}

// AFTER:
function BadgeNew({ children, variant = 'default' }) {
  const variantClass = variant === 'default' ? '' : `badge-${variant}`;
  return (
    <span className={`badge ${variantClass}`}>
      {children}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// 4. METRIC TILE COMPONENT
// ─────────────────────────────────────────────────────────────────────────

// BEFORE:
function MetricTileOld({ label, value, unit, status, icon }) {
  const C = {
    surfaceAlt: '#1a1a1e',
    border: '#2d2d33',
    textMid: '#a1a1a6',
    text: '#fafafa',
    accent: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
  };
  
  const statusColor = status === "normal" ? C.accent
    : status === "warning" ? C.warning : C.danger;
  
  return (
    <div style={{
      background: C.surfaceAlt,
      border: `1px solid ${C.border}`,
      borderRadius: 12,
      padding: '14px 18px',
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 13, color: C.textMid, fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: 18 }}>{icon}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span style={{ fontSize: 26, fontWeight: 700, color: C.text }}>{value}</span>
        <span style={{ fontSize: 13, color: C.textMid }}>{unit}</span>
      </div>
      <div style={{ width: '100%', height: 3, background: C.border, borderRadius: 2 }}>
        <div style={{
          width: `${status === 'normal' ? 100 : status === 'warning' ? 65 : 35}%`,
          height: 3,
          background: statusColor,
          borderRadius: 2,
        }} />
      </div>
    </div>
  );
}

// AFTER:
function MetricTileNew({ label, value, unit, status, icon }) {
  const statusColor = {
    normal: 'var(--color-success)',
    warning: 'var(--color-warning)',
    danger: 'var(--color-danger)',
  }[status] || 'var(--color-primary)';
  
  const statusPercent = {
    normal: 100,
    warning: 65,
    danger: 35,
  }[status] || 0;
  
  return (
    <div className="panel" style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-2)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-mid)' }}>
          {label}
        </span>
        <span style={{ fontSize: 18 }}>{icon}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)' }}>
        <span style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700 }}>{value}</span>
        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-light)' }}>
          {unit}
        </span>
      </div>
      <div className="progress">
        <div
          className="progress-bar"
          style={{
            width: `${statusPercent}%`,
            background: statusColor,
          }}
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// 5. FORM INPUT COMPONENT
// ─────────────────────────────────────────────────────────────────────────

// BEFORE:
function InputOld({ label, value, onChange, unit, type = 'number' }) {
  const C = {
    surface: '#09090b',
    text: '#fafafa',
    textMid: '#a1a1a6',
    insetShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.25)',
  };
  
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{
        fontSize: 13,
        fontWeight: 600,
        color: C.textMid,
        display: 'block',
        marginBottom: 5,
      }}>
        {label}
      </label>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            flex: 1,
            padding: '10px 12px',
            border: 'none',
            borderRadius: 10,
            fontSize: 15,
            color: C.text,
            background: C.surface,
            outline: 'none',
            boxShadow: C.insetShadow,
          }}
        />
        {unit && <span style={{ fontSize: 13, color: C.textMid }}>{unit}</span>}
      </div>
    </div>
  );
}

// AFTER:
function InputNew({ label, value, onChange, unit, type = 'number', ...props }) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="form-control"
          {...props}
        />
        {unit && (
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-mid)' }}>
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// 6. MODAL COMPONENT
// ─────────────────────────────────────────────────────────────────────────

// BEFORE:
function ModalOld({ title, onClose, children }) {
  const C = {
    surface: '#09090b',
    primaryDark: '#0A4A8A',
    textMid: '#a1a1a6',
  };
  
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.35)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        background: C.surface,
        borderRadius: 20,
        padding: 28,
        width: 420,
        maxWidth: '90vw',
        boxShadow: '0 12px 40px rgba(0,0,0,0.18)',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
        }}>
          <h3 style={{ margin: 0, fontSize: 18, color: C.primaryDark }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 20,
              cursor: 'pointer',
              color: C.textMid,
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// AFTER:
function ModalNew({ title, onClose, children, className = '' }) {
  return (
    <div className="modal">
      <div className={`modal-content ${className}`}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--space-5)',
        }}>
          <h3 style={{ margin: 0, fontSize: 'var(--font-size-md)', color: 'var(--color-primary)' }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            className="btn btn-ghost"
            style={{ padding: 0, minHeight: 'auto' }}
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MIGRATION STRATEGY
// ═══════════════════════════════════════════════════════════════════════════

/*
STEP-BY-STEP GUIDE:

1. IMPORT GLOBAL STYLES
   - Add to App.js: import './styles/global.css'
   - Verify colors are applied

2. AUDIT COMPONENTS
   - Identify components using inline "C" object
   - List all color/spacing/radius values used
   - Map to new CSS variables

3. CREATE WRAPPER COMPONENTS
   - Don't change existing components immediately
   - Create new versions with -New suffix
   - Test side-by-side

4. REPLACE INCREMENTALLY
   - Update one component per commit
   - Run visual tests after each change
   - Keep git history clean

5. TEST THOROUGHLY
   - Desktop, tablet, mobile views
   - Light/dark modes (if applicable)
   - Keyboard navigation
   - Screen reader

6. REMOVE OLD CODE
   - Delete duplicate styles
   - Update all references
   - Clean up unused CSS variables

ESTIMATED EFFORT:
- Planning & audit: 1-2 hours
- Component migration: 2-3 hours (6-8 components)
- Testing & refinement: 2-3 hours
- Documentation: 1 hour
- TOTAL: ~6-9 hours

*/

export {
  CardNew as Card,
  ButtonNew as Button,
  BadgeNew as Badge,
  MetricTileNew as MetricTile,
  InputNew as Input,
  ModalNew as Modal,
};
