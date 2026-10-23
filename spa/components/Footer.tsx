import { Link } from 'react-router-dom';
import { ArrowUp, Terminal, Shield, Cpu } from 'lucide-react';

interface FooterProps {
  onScrollToTop: () => void;
}

export function Footer({ onScrollToTop }: FooterProps) {
  return (
    <footer
      style={{
        backgroundColor: 'var(--color-jet-black)',
        borderTop: '1px solid var(--border-medium)',
        paddingTop: 'clamp(3rem, 6vw, 4.5rem)',
        paddingBottom: 'clamp(2.5rem, 5vw, 3.5rem)',
        position: 'relative',
        zIndex: 10
      }}
    >
      <div className="site-container">
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '36px',
            marginBottom: '40px',
            paddingBottom: '32px',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          {/* Brand Col */}
          <div style={{ maxWidth: '380px' }}>
            <Link
              to="/"
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '24px',
                letterSpacing: '-0.03em',
                marginBottom: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                textDecoration: 'none',
                color: 'var(--color-white)'
              }}
            >
              <span>INTENT</span>
              <span style={{ color: 'var(--color-hot-pink)' }}>/</span>
              <span style={{ color: 'var(--color-chartreuse)' }}>SHIFT</span>
            </Link>

            <p
              style={{
                fontSize: '14px',
                color: 'var(--color-muted-grey)',
                lineHeight: 1.6,
                marginBottom: '16px',
              }}
            >
              Instant Persona and Communication Transformer with IntentLock™ semantic parity defense.
              Rewrite rough drafts for any audience while protecting core commitments.
            </p>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--color-chartreuse)',
              }}
            >
              <Shield size={14} />
              <span>INTENTLOCK PATENT-PENDING SEMANTIC VERIFICATION</span>
            </div>
          </div>

          {/* Quick Nav Col */}
          <div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--color-hot-pink)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom: '14px',
              }}
            >
              // NAVIGATION ROUTES
            </div>
            <ul
              style={{
                listStyle: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                fontSize: '14px',
              }}
            >
              <li>
                <Link
                  to="/transformer"
                  style={{ color: 'var(--color-muted-grey)', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-white)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-muted-grey)')}
                >
                  Transformer Studio
                </Link>
              </li>
              <li>
                <Link
                  to="/intentlock"
                  style={{ color: 'var(--color-muted-grey)', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-white)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-muted-grey)')}
                >
                  IntentLock™ Architecture
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  style={{ color: 'var(--color-muted-grey)', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-white)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-muted-grey)')}
                >
                  Telemetry Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/history"
                  style={{ color: 'var(--color-muted-grey)', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-white)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-muted-grey)')}
                >
                  Transformation Vault
                </Link>
              </li>
              <li>
                <Link
                  to="/settings"
                  style={{ color: 'var(--color-muted-grey)', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-white)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-muted-grey)')}
                >
                  System Settings
                </Link>
              </li>
            </ul>
          </div>

          {/* Tech Stack Badges Col */}
          <div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--color-chartreuse)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom: '14px',
              }}
            >
              // RUNTIME SPECIFICATION
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', maxWidth: '240px' }}>
              {['THREE.JS 3D', 'R3F ENGINE', 'REACT 19', 'TYPESCRIPT', 'REACT ROUTER', 'ACCESSIBLE'].map(
                (tech) => (
                  <span
                    key={tech}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10.5px',
                      padding: '4px 8px',
                      backgroundColor: 'var(--surface-panel)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '2px',
                      color: 'var(--color-muted-grey)',
                    }}
                  >
                    {tech}
                  </span>
                )
              )}
            </div>
          </div>

          {/* Back to Top Button */}
          <div>
            <button
              onClick={onScrollToTop}
              style={{
                backgroundColor: 'var(--surface-panel)',
                border: '1px solid var(--border-medium)',
                color: 'var(--color-white)',
                padding: '10px 18px',
                borderRadius: '2px',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all var(--transition-fast)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-chartreuse)';
                e.currentTarget.style.color = 'var(--color-chartreuse)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-medium)';
                e.currentTarget.style.color = 'var(--color-white)';
              }}
            >
              <ArrowUp size={14} />
              <span>BACK TO TOP</span>
            </button>
          </div>
        </div>

        {/* Legal & Demonstration Notice */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            fontSize: '12px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--color-muted-grey)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Cpu size={14} color="var(--color-hot-pink)" />
            <span>© {new Date().getFullYear()} INTENT / SHIFT — ALL RIGHTS RESERVED</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Terminal size={14} />
            <span>DESIGNED WITH BRUTALIST PRECISION // 3D NEON EDITORIAL</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
