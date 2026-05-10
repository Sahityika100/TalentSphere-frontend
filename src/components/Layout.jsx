import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Users, Building2, Star, LayoutDashboard, ChevronRight, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const NAV = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/employees', label: 'Employees', icon: Users },
  { to: '/departments', label: 'Departments', icon: Building2 },
  { to: '/designations', label: 'Designations', icon: Star },
];

export default function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const handleLogout = () => { logout(); navigate('/login'); };

  const showLabels = !collapsed || isMobile;

  const SidebarContent = () => (
    <>
      <div style={{
        padding: showLabels ? '24px 20px' : '20px 0',
        display: 'flex', alignItems: 'center', gap: 12,
        borderBottom: '1px solid var(--border)',
        justifyContent: showLabels ? 'space-between' : 'center',
      }}>
        {showLabels ? (
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: 'var(--text)', letterSpacing: '-0.03em' }}>
              Talent<span style={{ color: 'var(--accent)' }}>Sphere</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-3)', letterSpacing: '0.08em', marginTop: 2 }}>HR MANAGEMENT</div>
          </div>
        ) : (
          <div style={{ width: 36, height: 36, background: 'var(--accent)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, color: '#fff' }}>T</div>
        )}
        {isMobile ? (
          <button onClick={() => setMobileOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', padding: 4, borderRadius: 6, display: 'flex' }}>
            <X size={20} />
          </button>
        ) : (
          <button onClick={() => setCollapsed(c => !c)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', padding: 4, borderRadius: 6, display: 'flex', alignItems: 'center', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-3)'}
          >
            <ChevronRight size={16} style={{ transform: collapsed ? 'rotate(0)' : 'rotate(180deg)', transition: 'transform 0.25s' }} />
          </button>
        )}
      </div>

      <nav style={{ flex: 1, padding: '16px 10px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {NAV.map(({ to, label, icon: Icon }) => {
          const active = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);
          return (
            <NavLink key={to} to={to} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: showLabels ? '10px 12px' : '10px 0',
              borderRadius: 'var(--radius)', textDecoration: 'none',
              justifyContent: showLabels ? 'flex-start' : 'center',
              background: active ? 'var(--accent-soft)' : 'transparent',
              color: active ? 'var(--accent)' : 'var(--text-2)',
              fontWeight: active ? 600 : 400, fontSize: 14,
              transition: 'all 0.15s ease', position: 'relative',
            }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
            >
              {active && <div style={{ position: 'absolute', left: 0, top: '20%', height: '60%', width: 3, background: 'var(--accent)', borderRadius: '0 2px 2px 0' }} />}
              <Icon size={18} />
              {showLabels && <span>{label}</span>}
            </NavLink>
          );
        })}
      </nav>

      <div style={{
        padding: showLabels ? '16px 14px' : '16px 0',
        borderTop: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column', gap: 10,
        alignItems: showLabels ? 'stretch' : 'center',
      }}>
        {showLabels && user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--accent-soft)', border: '1px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: 'var(--accent)', flexShrink: 0 }}>
              {user.fullName?.charAt(0).toUpperCase()}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.fullName}</div>
              <div style={{ fontSize: 11, color: 'var(--text-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
            </div>
          </div>
        )}
        <button onClick={handleLogout} style={{
          display: 'flex', alignItems: 'center', justifyContent: showLabels ? 'flex-start' : 'center',
          gap: 8, background: 'none', border: '1px solid var(--border)',
          borderRadius: 'var(--radius)', padding: showLabels ? '8px 12px' : '8px',
          color: 'var(--text-3)', cursor: 'pointer', fontSize: 13,
          fontFamily: 'var(--font-body)', transition: 'all 0.15s', width: '100%',
        }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--red)'; e.currentTarget.style.borderColor = 'rgba(248,113,113,0.4)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-3)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
        >
          <LogOut size={15} />
          {showLabels && <span>Sign out</span>}
        </button>
      </div>
    </>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      {/* Mobile Top Bar */}
      <div className="mobile-topbar">
        <button onClick={() => setMobileOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-2)', display: 'flex', padding: 4 }}>
          <Menu size={22} />
        </button>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, color: 'var(--text)', letterSpacing: '-0.03em' }}>
          Talent<span style={{ color: 'var(--accent)' }}>Sphere</span>
        </div>
        {user && (
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent-soft)', border: '1px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'var(--accent)' }}>
            {user.fullName?.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {/* Mobile Overlay */}
        {isMobile && mobileOpen && (
          <div
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 45, backdropFilter: 'blur(3px)', animation: 'fadeIn 0.2s ease' }}
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Desktop Sidebar */}
        {!isMobile && (
          <aside style={{
            width: collapsed ? 68 : 240, minWidth: collapsed ? 68 : 240,
            background: 'var(--bg-2)', borderRight: '1px solid var(--border)',
            display: 'flex', flexDirection: 'column',
            transition: 'width 0.25s ease, min-width 0.25s ease',
            position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', zIndex: 50,
          }}>
            <SidebarContent />
          </aside>
        )}

        {/* Mobile Drawer */}
        {isMobile && (
          <aside style={{
            position: 'fixed', top: 0, left: 0, bottom: 0, width: 260,
            background: 'var(--bg-2)', borderRight: '1px solid var(--border)',
            display: 'flex', flexDirection: 'column',
            zIndex: 50, overflowY: 'auto',
            transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform 0.28s cubic-bezier(0.4,0,0.2,1)',
          }}>
            <SidebarContent />
          </aside>
        )}

        {/* Main Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowX: 'hidden' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
