/**
 * Modern Dashboard Card Component (Updated Example)
 * Fully compatible with new design system
 */

import React from 'react';

/**
 * Generic Card Component
 * Provides consistent styling following dashboard design system
 * 
 * @param {ReactNode} children - Content inside card
 * @param {string} title - Optional card title
 * @param {string} subtitle - Optional card subtitle
 * @param {object} style - Additional inline styles
 * @param {string} className - Additional CSS classes
 */
export function Card({ children, title, subtitle, style = {}, className = '' }) {
  return (
    <div className={`card ${className}`} style={style}>
      {title && (
        <div style={{ marginBottom: 'var(--space-5)' }}>
          <h3 style={{
            margin: 0,
            fontSize: 'var(--font-size-md)',
            fontWeight: 700,
            color: 'var(--color-primary-dark)',
          }}>
            {title}
          </h3>
          {subtitle && (
            <p style={{
              margin: 'var(--space-1) 0 0',
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-text-mid)',
            }}>
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

/**
 * Metric Display Component
 * Shows a key metric with status indicator and progress
 * 
 * @param {string} label - Metric label
 * @param {number|string} value - Metric value
 * @param {string} unit - Unit of measurement
 * @param {'normal'|'warning'|'danger'} status - Status indicator
 * @param {string} icon - Emoji or icon
 */
export function MetricTile({ label, value, unit, status = 'normal', icon = '•' }) {
  const statusConfig = {
    normal: { color: 'var(--color-success)', percent: 100 },
    warning: { color: 'var(--color-warning)', percent: 65 },
    danger: { color: 'var(--color-danger)', percent: 35 },
  };
  
  const config = statusConfig[status] || statusConfig.normal;
  
  return (
    <div className="panel" style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-2)',
      height: '100%',
    }}>
      {/* Header: Label + Icon */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{
          fontSize: 'var(--font-size-xs)',
          color: 'var(--color-text-mid)',
          fontWeight: 500,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}>
          {label}
        </span>
        <span style={{ fontSize: '18px' }}>{icon}</span>
      </div>
      
      {/* Value Display */}
      <div style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: 'var(--space-2)',
      }}>
        <span style={{
          fontSize: 'var(--font-size-lg)',
          fontWeight: 700,
          color: 'var(--color-text)',
        }}>
          {value}
        </span>
        <span style={{
          fontSize: 'var(--font-size-xs)',
          color: 'var(--color-text-light)',
        }}>
          {unit}
        </span>
      </div>
      
      {/* Progress Indicator */}
      <div className="progress" style={{ margin: 'var(--space-2) 0' }}>
        <div
          className="progress-bar"
          style={{
            width: `${config.percent}%`,
            background: config.color,
          }}
        />
      </div>
      
      {/* Status Badge */}
      <div style={{ marginTop: 'var(--space-3)' }}>
        <span className={`badge badge-${status}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>
    </div>
  );
}

/**
 * Data Table Component
 * Displays tabular data with consistent styling
 * 
 * @param {array} columns - Column definitions: { key, label, render? }
 * @param {array} rows - Row data
 * @param {string} className - Additional classes
 */
export function DataTable({ columns, rows = [], className = '' }) {
  return (
    <div style={{
      overflowX: 'auto',
      borderRadius: 'var(--radius-lg)',
      background: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
    }}>
      <table className={`data-table ${className}`}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={{
                textAlign: col.align || 'left',
              }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                style={{
                  textAlign: 'center',
                  padding: 'var(--space-6)',
                  color: 'var(--color-text-light)',
                  fontStyle: 'italic',
                }}
              >
                No data available
              </td>
            </tr>
          ) : (
            rows.map((row, idx) => (
              <tr key={idx}>
                {columns.map((col) => (
                  <td key={col.key} style={{ textAlign: col.align || 'left' }}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Form Input Group
 * Wraps input with label and error message
 * 
 * @param {string} label - Input label
 * @param {string} type - Input type
 * @param {string} value - Current value
 * @param {function} onChange - Change handler
 * @param {string} error - Error message
 * @param {string} unit - Optional unit suffix
 */
export function FormInput({
  label,
  type = 'text',
  value,
  onChange,
  error,
  unit,
  required = false,
  ...props
}) {
  return (
    <div className="form-group">
      <label className="form-label">
        {label}
        {required && <span style={{ color: 'var(--color-danger)' }}>*</span>}
      </label>
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
      }}>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`form-control ${error ? 'is-invalid' : ''}`}
          {...props}
        />
        {unit && (
          <span style={{
            fontSize: 'var(--font-size-xs)',
            color: 'var(--color-text-light)',
            whiteSpace: 'nowrap',
          }}>
            {unit}
          </span>
        )}
      </div>
      
      {error && (
        <div style={{
          fontSize: 'var(--font-size-xs)',
          color: 'var(--color-danger)',
          marginTop: 'var(--space-1)',
        }}>
          ⚠️ {error}
        </div>
      )}
    </div>
  );
}

/**
 * Alert/Notification Component
 * 
 * @param {string} type - 'success' | 'warning' | 'danger' | 'info'
 * @param {string} message - Alert message
 * @param {ReactNode} children - Content (alternative to message)
 * @param {string} icon - Custom icon
 */
export function Alert({ type = 'info', message, children, icon, onClose }) {
  const icons = {
    success: '✅',
    warning: '⚠️',
    danger: '❌',
    info: 'ℹ️',
  };
  
  return (
    <div className={`alert alert-${type}`} style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: 'var(--space-3)',
    }}>
      <span style={{ fontSize: '18px', flexShrink: 0 }}>
        {icon || icons[type]}
      </span>
      <div style={{ flex: 1 }}>
        {message || children}
      </div>
      {onClose && (
        <button
          className="btn btn-ghost"
          onClick={onClose}
          style={{ padding: 0, minHeight: 'auto' }}
          aria-label="Close alert"
        >
          ✕
        </button>
      )}
    </div>
  );
}

/**
 * Modal Component
 * Accessible dialog with overlay
 */
export function Modal({ title, onClose, children, size = 'md' }) {
  const sizes = {
    sm: '340px',
    md: '420px',
    lg: '600px',
  };
  
  return (
    <div
      className="modal"
      onClick={(e) => {
        // Close on overlay click
        if (e.target === e.currentTarget) {
          onClose?.();
        }
      }}
    >
      <div
        className="modal-content"
        style={{ maxWidth: sizes[size] }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--space-5)',
          borderBottom: '1px solid var(--color-border)',
          paddingBottom: 'var(--space-4)',
        }}>
          <h2 id="modal-title" style={{
            margin: 0,
            fontSize: 'var(--font-size-md)',
            color: 'var(--color-primary)',
            fontWeight: 700,
          }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            className="btn btn-ghost"
            style={{ padding: 0, minHeight: 'auto' }}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>
        
        {/* Content */}
        <div>{children}</div>
      </div>
    </div>
  );
}

/**
 * Button Group Component
 * Displays multiple buttons consistently
 */
export function ButtonGroup({ children, direction = 'horizontal', gap = 'var(--space-3)' }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: direction === 'vertical' ? 'column' : 'row',
        gap,
        alignItems: direction === 'vertical' ? 'stretch' : 'center',
        flexWrap: 'wrap',
      }}
    >
      {children}
    </div>
  );
}

/**
 * Status Badge Component
 * Visual status indicator
 */
export function StatusBadge({ status = 'active', size = 'md' }) {
  const statusConfig = {
    active: { color: 'success', label: 'Active' },
    inactive: { color: 'warning', label: 'Inactive' },
    error: { color: 'danger', label: 'Error' },
    pending: { color: 'info', label: 'Pending' },
  };
  
  const config = statusConfig[status] || statusConfig.active;
  
  return (
    <span
      className={`badge badge-${config.color}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--space-1)',
      }}
    >
      <span
        className="status-indicator"
        style={{
          width: size === 'sm' ? '6px' : '8px',
          height: size === 'sm' ? '6px' : '8px',
          background: `var(--color-${config.color})`,
        }}
      />
      {config.label}
    </span>
  );
}

/**
 * Loading Spinner Component
 */
export function Spinner({ size = 'md', color = 'primary' }) {
  const sizes = {
    sm: 24,
    md: 32,
    lg: 48,
  };
  
  return (
    <div
      style={{
        display: 'inline-block',
        width: sizes[size],
        height: sizes[size],
        border: `3px solid var(--color-border)`,
        borderTop: `3px solid var(--color-${color})`,
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }}
    >
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default {
  Card,
  MetricTile,
  DataTable,
  FormInput,
  Alert,
  Modal,
  ButtonGroup,
  StatusBadge,
  Spinner,
};
