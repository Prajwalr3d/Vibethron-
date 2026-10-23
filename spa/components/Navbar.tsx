import { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
  LayoutDashboard,
  Archive,
  Settings,
  User as UserIcon,
  LogOut
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinkStyle = ({ isActive }: { isActive: boolean }) => ({
    color: isActive ? 'var(--color-chartreuse)' : 'var(--color-muted-grey)',
    textDecoration: 'none',
    fontFamily: 'var(--font-body)',
    fontSize: '13.5px',
    fontWeight: 500,
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 10px',
    borderRadius: '2px',
    borderBottom: isActive ? '2px solid var(--color-chartreuse)' : '2px solid transparent',
    transition: 'color var(--transition-fast), border-color var(--transition-fast)'
  });

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        width: '100%',
        backgroundColor: scrolled ? 'rgba(11, 11, 11, 0.94)' : 'rgba(11, 11, 11, 0.8)',
        backdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${scrolled ? 'var(--border-medium)' : 'var(--border-subtle)'}`,
        transition: 'background-color 0.25s ease, border-color 0.25s ease'
      }}
    >
      <div className="site-container">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '76px'
          }}
        >
          {/* Wordmark Brand Logo */}
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              textDecoration: 'none',
              color: 'var(--color-white)'
            }}
            aria-label="INTENT / SHIFT Homepage"
          >
            <div
              style={{
                width: '34px',
                height: '34px',
                backgroundColor: 'var(--color-jet-black)',
                border: '1.5px solid var(--color-hot-pink)',
                borderRadius: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                boxShadow: '2px 2px 0px var(--color-chartreuse)'
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: 'var(--color-hot-pink)',
                  borderRadius: '50%',
                  display: 'inline-block'
                }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: '20px',
                  letterSpacing: '-0.03em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>INTENT</span>
                <span style={{ color: 'var(--color-hot-pink)' }}>/</span>
                <span style={{ color: 'var(--color-chartreuse)' }}>SHIFT</span>
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9.5px',
                  letterSpacing: '0.14em',
                  color: 'var(--color-muted-grey)',
                  textTransform: 'uppercase'
                }}
              >
                AI COMMUNICATION TRANSFORMER
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '6px'
            }}
            className="desktop-nav"
          >
            <NavLink to="/" style={navLinkStyle}>
              Overview
            </NavLink>

            <NavLink to="/transformer" style={navLinkStyle}>
              <Sparkles size={14} />
              <span>Studio</span>
            </NavLink>

            <NavLink to="/intentlock" style={navLinkStyle}>
              <ShieldCheck size={14} />
              <span>IntentLock™</span>
            </NavLink>

            <NavLink to="/dashboard" style={navLinkStyle}>
              <LayoutDashboard size={14} />
              <span>Dashboard</span>
            </NavLink>

            <NavLink to="/history" style={navLinkStyle}>
              <Archive size={14} />
              <span>Vault</span>
            </NavLink>

            <NavLink to="/settings" style={navLinkStyle}>
              <Settings size={14} />
              <span>Settings</span>
            </NavLink>
          </nav>

          {/* Desktop Right Actions */}
          <div
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '14px'
            }}
            className="desktop-actions"
          >
            {user.isLoggedIn ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Link
                  to="/settings"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 12px',
                    backgroundColor: 'var(--surface-card)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '2px',
                    textDecoration: 'none',
                    color: 'var(--color-white)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px'
                  }}
                  title="Account Settings"
                >
                  <span
                    style={{
                      width: '7px',
                      height: '7px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-chartreuse)'
                    }}
                  />
                  <span>{user.name}</span>
                </Link>

                <button
                  onClick={logout}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-muted-grey)',
                    cursor: 'pointer',
                    padding: '6px',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  title="Sign Out"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                style={{
                  color: 'var(--color-white)',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12.5px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 10px'
                }}
              >
                <UserIcon size={14} />
                <span>SIGN IN</span>
              </Link>
            )}

            <button
              onClick={() => navigate('/transformer')}
              className="btn-primary"
              style={{
                padding: '0.65rem 1.25rem',
                fontSize: '13.5px'
              }}
            >
              <span>STUDIO</span>
              <ArrowUpRight size={15} />
            </button>
          </div>

          {/* Mobile Menu Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'transparent',
              border: '1px solid var(--border-medium)',
              color: 'var(--color-white)',
              padding: '8px',
              borderRadius: '2px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            className="mobile-toggle"
            aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: 'var(--color-jet-black)',
            borderTop: '1px solid var(--border-medium)',
            padding: '24px 20px 32px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
          className="mobile-drawer"
        >
          <Link
            to="/"
            style={{
              color: 'var(--color-white)',
              textDecoration: 'none',
              fontFamily: 'var(--font-display)',
              fontSize: '18px',
              fontWeight: 600,
              padding: '8px 0',
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <span>Overview</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-muted-grey)' }}>01</span>
          </Link>

          <Link
            to="/transformer"
            style={{
              color: 'var(--color-hot-pink)',
              textDecoration: 'none',
              fontFamily: 'var(--font-display)',
              fontSize: '18px',
              fontWeight: 600,
              padding: '8px 0',
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <span>Transformer Studio</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-hot-pink)' }}>02</span>
          </Link>

          <Link
            to="/intentlock"
            style={{
              color: 'var(--color-chartreuse)',
              textDecoration: 'none',
              fontFamily: 'var(--font-display)',
              fontSize: '18px',
              fontWeight: 600,
              padding: '8px 0',
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <span>IntentLock™ Audit</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-chartreuse)' }}>03</span>
          </Link>

          <Link
            to="/dashboard"
            style={{
              color: 'var(--color-white)',
              textDecoration: 'none',
              fontFamily: 'var(--font-display)',
              fontSize: '18px',
              fontWeight: 600,
              padding: '8px 0',
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <span>Telemetry Dashboard</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-muted-grey)' }}>04</span>
          </Link>

          <Link
            to="/history"
            style={{
              color: 'var(--color-white)',
              textDecoration: 'none',
              fontFamily: 'var(--font-display)',
              fontSize: '18px',
              fontWeight: 600,
              padding: '8px 0',
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <span>Transformation Vault</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-muted-grey)' }}>05</span>
          </Link>

          <Link
            to="/settings"
            style={{
              color: 'var(--color-white)',
              textDecoration: 'none',
              fontFamily: 'var(--font-display)',
              fontSize: '18px',
              fontWeight: 600,
              padding: '8px 0',
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <span>System Settings</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-muted-grey)' }}>06</span>
          </Link>

          <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
            <button
              onClick={() => navigate('/transformer')}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <span>LAUNCH STUDIO NOW</span>
              <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 900px) {
          .desktop-nav { display: flex !important; }
          .desktop-actions { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
      `}</style>
    </header>
  );
}
