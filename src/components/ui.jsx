import React, { useState } from 'react';
import { X, AlertTriangle, Loader2 } from 'lucide-react';

// ─── Page Header ──────────────────────────────────────────────
export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="page-header-row" style={{
      display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
      marginBottom: 28, flexWrap: 'wrap', gap: 12,
    }}>
      <div>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontWeight: 800,
          fontSize: 'clamp(20px, 5vw, 28px)', letterSpacing: '-0.03em', color: 'var(--text)',
        }}>{title}</h1>
        {subtitle && <p style={{ color: 'var(--text-2)', marginTop: 4, fontSize: 14 }}>{subtitle}</p>}
      </div>
      {action && <div style={{ flexShrink: 0 }}>{action}</div>}
    </div>
  );
}

// ─── Button ───────────────────────────────────────────────────
export function Button({ children, onClick, variant = 'primary', size = 'md', disabled, loading, style: extraStyle }) {
  const sizes = {
    sm: { padding: '6px 14px', fontSize: 13 },
    md: { padding: '9px 20px', fontSize: 14 },
    lg: { padding: '12px 28px', fontSize: 15 },
  };
  const variants = {
    primary: { background: 'var(--accent)', color: '#fff', border: 'none', boxShadow: '0 0 20px var(--accent-glow)' },
    secondary: { background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)' },
    danger: { background: 'var(--red-soft)', color: 'var(--red)', border: '1px solid rgba(248,113,113,0.3)' },
    ghost: { background: 'transparent', color: 'var(--text-2)', border: '1px solid var(--border)' },
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        ...sizes[size], ...variants[variant],
        borderRadius: 'var(--radius)',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        display: 'inline-flex', alignItems: 'center', gap: 8,
        fontFamily: 'var(--font-body)', fontWeight: 500,
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.15s ease',
        whiteSpace: 'nowrap',
        ...extraStyle,
      }}
      onMouseEnter={e => { if (!disabled && !loading) { e.currentTarget.style.opacity = '0.85'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
      onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      {loading && <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />}
      {children}
    </button>
  );
}

// ─── Card ─────────────────────────────────────────────────────
export function Card({ children, style: extra }) {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 24, ...extra }}>
      {children}
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────
export function StatCard({ label, value, icon: Icon, color = 'var(--accent)', delay = 0 }) {
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)', padding: '16px 20px',
      display: 'flex', alignItems: 'center', gap: 14,
      animation: `fadeUp 0.4s ease ${delay}s both`,
    }}>
      <div style={{ width: 46, height: 46, borderRadius: 12, background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={20} color={color} />
      </div>
      <div>
        <div className="stat-value" style={{ fontSize: 24, fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text)' }}>{value}</div>
        <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 1 }}>{label}</div>
      </div>
    </div>
  );
}

// ─── Badge ────────────────────────────────────────────────────
export function Badge({ children, color = 'accent' }) {
  const colors = {
    accent: { bg: 'var(--accent-soft)', text: 'var(--accent)', border: 'rgba(124,106,245,0.25)' },
    green: { bg: 'var(--green-soft)', text: 'var(--green)', border: 'rgba(74,222,128,0.25)' },
    amber: { bg: 'var(--amber-soft)', text: 'var(--amber)', border: 'rgba(245,166,35,0.25)' },
    red: { bg: 'var(--red-soft)', text: 'var(--red)', border: 'rgba(248,113,113,0.25)' },
  };
  const c = colors[color] || colors.accent;
  return (
    <span style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}`, padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap' }}>
      {children}
    </span>
  );
}

// ─── Modal ────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="modal-sheet-wrapper" style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', animation: 'fadeIn 0.2s ease' }} />
      <div className="modal-sheet" style={{
        position: 'relative', background: 'var(--bg-3)',
        border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)',
        width: '100%', maxWidth: 520,
        boxShadow: 'var(--shadow), var(--shadow-accent)',
        animation: 'fadeUp 0.25s ease',
        maxHeight: '90vh', overflowY: 'auto',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--text)' }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', padding: 4, borderRadius: 6, display: 'flex', alignItems: 'center' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-3)'}
          >
            <X size={18} />
          </button>
        </div>
        <div style={{ padding: '24px' }}>{children}</div>
      </div>
    </div>
  );
}

// ─── Form Field ───────────────────────────────────────────────
export function Field({ label, children, required }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-2)', marginBottom: 6, letterSpacing: '0.01em' }}>
        {label} {required && <span style={{ color: 'var(--accent)' }}>*</span>}
      </label>
      {children}
    </div>
  );
}

export function Input({ value, onChange, placeholder, type = 'text' }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type} value={value} onChange={onChange} placeholder={placeholder}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      style={{
        width: '100%', background: 'var(--surface)',
        border: `1px solid ${focused ? 'var(--accent)' : 'var(--border)'}`,
        borderRadius: 'var(--radius)', padding: '9px 12px',
        color: 'var(--text)', fontSize: 14, fontFamily: 'var(--font-body)',
        outline: 'none', transition: 'border-color 0.15s',
        boxShadow: focused ? '0 0 0 3px var(--accent-soft)' : 'none',
      }}
    />
  );
}

export function Select({ value, onChange, children }) {
  const [focused, setFocused] = useState(false);
  return (
    <select value={value} onChange={onChange}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      style={{
        width: '100%', background: 'var(--surface)',
        border: `1px solid ${focused ? 'var(--accent)' : 'var(--border)'}`,
        borderRadius: 'var(--radius)', padding: '9px 12px',
        color: 'var(--text)', fontSize: 14, fontFamily: 'var(--font-body)',
        outline: 'none', cursor: 'pointer', transition: 'border-color 0.15s',
        boxShadow: focused ? '0 0 0 3px var(--accent-soft)' : 'none',
      }}
    >
      {children}
    </select>
  );
}

// ─── Table ────────────────────────────────────────────────────
export function Table({ columns, data, onEdit, onDelete, emptyMessage = 'No records found' }) {
  if (!data || data.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--text-3)', fontSize: 14 }}>
        <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.4 }}>◯</div>
        {emptyMessage}
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 480 }}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={{
                textAlign: 'left', padding: '10px 16px',
                fontSize: 11, fontWeight: 600, letterSpacing: '0.08em',
                color: 'var(--text-3)', textTransform: 'uppercase',
                borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap',
              }}>
                {col.label}
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th style={{ textAlign: 'right', padding: '10px 16px', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', color: 'var(--text-3)', textTransform: 'uppercase', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}>Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={row.id ?? i}
              style={{ transition: 'background 0.1s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {columns.map((col) => (
                <td key={col.key} style={{ padding: '13px 16px', borderBottom: '1px solid var(--border)', fontSize: 14, color: 'var(--text)' }}>
                  {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td style={{ padding: '13px 16px', borderBottom: '1px solid var(--border)', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                    {onEdit && <Button onClick={() => onEdit(row)} variant="ghost" size="sm">Edit</Button>}
                    {onDelete && <Button onClick={() => onDelete(row)} variant="danger" size="sm">Delete</Button>}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────
export function Toast({ toasts }) {
  return (
    <div className="toast-wrap" style={{ position: 'fixed', bottom: 24, right: 24, display: 'flex', flexDirection: 'column', gap: 10, zIndex: 999, maxWidth: 320 }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background: t.type === 'error' ? 'var(--red-soft)' : 'var(--green-soft)',
          border: `1px solid ${t.type === 'error' ? 'rgba(248,113,113,0.3)' : 'rgba(74,222,128,0.3)'}`,
          color: t.type === 'error' ? 'var(--red)' : 'var(--green)',
          padding: '12px 18px', borderRadius: 'var(--radius)',
          fontSize: 14, fontWeight: 500, animation: 'fadeUp 0.3s ease',
          backdropFilter: 'blur(8px)',
        }}>
          {t.message}
        </div>
      ))}
    </div>
  );
}

// ─── Confirm Dialog ───────────────────────────────────────────
export function ConfirmDialog({ open, onClose, onConfirm, title, message, loading }) {
  return (
    <Modal open={open} onClose={onClose} title={title || 'Confirm Action'}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 24 }}>
        <AlertTriangle size={20} color="var(--amber)" style={{ flexShrink: 0, marginTop: 2 }} />
        <p style={{ color: 'var(--text-2)', fontSize: 14, lineHeight: 1.6 }}>{message}</p>
      </div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <Button onClick={onClose} variant="ghost">Cancel</Button>
        <Button onClick={onConfirm} variant="danger" loading={loading}>Delete</Button>
      </div>
    </Modal>
  );
}

// ─── Spinner ─────────────────────────────────────────────────
export function Spinner() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 0' }}>
      <Loader2 size={32} color="var(--accent)" style={{ animation: 'spin 1s linear infinite' }} />
    </div>
  );
}
