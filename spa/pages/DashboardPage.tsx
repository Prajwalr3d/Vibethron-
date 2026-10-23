import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Sparkles,
  ShieldCheck,
  Zap,
  Clock,
  Flame,
  Layers,
  ChevronRight,
  Send
} from 'lucide-react';
import { Dashboard3DCanvas } from '../components/Dashboard3DCanvas';
import { useApp, timeAgo } from '../context/AppContext';
import { PERSONAS } from '../types/transformer';

export function DashboardPage() {
  const { history, user } = useApp();
  // Every number here comes from your own Vault (transformations saved in this browser).
  const stats = (() => {
    if (!history.length) return { parity: '—', risks: 0, dominant: '—', share: 'NO DATA YET' };
    const counts: Record<string, number> = {};
    for (const h of history) counts[h.persona] = (counts[h.persona] || 0) + 1;
    const [top, n] = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    return {
      parity: `${Math.round((100 * history.filter((h) => h.intentPreserved).length) / history.length)}%`,
      risks: history.reduce((s, h) => s + (h.risksFlagged || 0), 0),
      dominant: top.toUpperCase(),
      share: `${Math.round((100 * n) / history.length)}% SHARE`,
    };
  })();
  const navigate = useNavigate();
  const [quickDraft, setQuickDraft] = useState('');

  const handleQuickLaunch = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickDraft.trim()) {
      // The Studio picks this up as its starting draft.
      try { sessionStorage.setItem('intent_shift_draft', quickDraft.trim()); } catch { /* ignore */ }
      navigate('/transformer');
    }
  };

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 76px)',
        backgroundColor: 'transparent',
        position: 'relative',
        paddingTop: 'clamp(2rem, 4vw, 3.5rem)',
        paddingBottom: 'clamp(4rem, 8vw, 6rem)',
        overflowX: 'hidden'
      }}
    >
      {/* 3D Telemetry Matrix Visual */}
      <Dashboard3DCanvas />

      <div className="site-container" style={{ position: 'relative', zIndex: 10 }}>
        {/* Header */}
        <div style={{ maxWidth: '780px', marginBottom: '36px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-eyebrow)',
              color: 'var(--color-chartreuse)',
              letterSpacing: 'var(--tracking-eyebrow)',
              textTransform: 'uppercase',
              marginBottom: '10px'
            }}
          >
            <LayoutDashboard size={14} />
            <span>EXECUTIVE TELEMETRY // INTENTSHIFT OS</span>
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-h1)',
              fontWeight: 700,
              letterSpacing: 'var(--tracking-tight)',
              textTransform: 'uppercase',
              color: 'var(--color-white)',
              lineHeight: 0.95,
              marginBottom: '12px'
            }}
          >
            COMMUNICATION <span style={{ color: 'var(--color-hot-pink)' }}>TELEMETRY</span>
          </h1>

          <p style={{ color: 'var(--color-muted-grey)', fontSize: 'var(--text-body-md)', lineHeight: 1.6 }}>
            Welcome back, <strong style={{ color: 'var(--color-white)' }}>{user.name}</strong>. Here is the
            real-time dimensional analysis of your outbound communications, persona usage, and IntentLock
            liability safeguards.
          </p>
        </div>

        {/* 4 Dimensional Floating Data Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px',
            marginBottom: '36px'
          }}
        >
          {/* Card 1: Total Transformed */}
          <div
            className="brutalist-card"
            style={{
              padding: '22px',
              borderTop: '3px solid var(--color-hot-pink)',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--glow-subtle)'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '12px'
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: 'var(--color-muted-grey)',
                  letterSpacing: '0.08em'
                }}
              >
                TOTAL TRANSMUTATIONS
              </span>
              <Sparkles size={16} color="var(--color-hot-pink)" />
            </div>

            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '38px',
                fontWeight: 700,
                color: 'var(--color-white)',
                lineHeight: 1,
                marginBottom: '8px'
              }}
            >
              {history.length}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
              <span style={{ color: 'var(--color-chartreuse)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                SAVED
              </span>
              <span style={{ color: 'var(--color-muted-grey)' }}>in this browser&apos;s Vault</span>
            </div>
          </div>

          {/* Card 2: Intent Parity */}
          <div
            className="brutalist-card"
            style={{
              padding: '22px',
              borderTop: '3px solid var(--color-chartreuse)',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--glow-subtle)'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '12px'
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: 'var(--color-muted-grey)',
                  letterSpacing: '0.08em'
                }}
              >
                INTENT PARITY SCORE
              </span>
              <ShieldCheck size={16} color="var(--color-chartreuse)" />
            </div>

            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '38px',
                fontWeight: 700,
                color: 'var(--color-chartreuse)',
                lineHeight: 1,
                marginBottom: '8px'
              }}
            >
              {stats.parity}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
              <span style={{ color: 'var(--color-white)', fontFamily: 'var(--font-mono)' }}>ZERO</span>
              <span style={{ color: 'var(--color-muted-grey)' }}>unauthorized promise creeps</span>
            </div>
          </div>

          {/* Card 3: Liabilities Prevented */}
          <div
            className="brutalist-card"
            style={{
              padding: '22px',
              borderTop: '3px solid var(--color-white)',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--glow-subtle)'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '12px'
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: 'var(--color-muted-grey)',
                  letterSpacing: '0.08em'
                }}
              >
                RISKS THWARTED
              </span>
              <Flame size={16} color="var(--color-hot-pink)" />
            </div>

            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '38px',
                fontWeight: 700,
                color: 'var(--color-white)',
                lineHeight: 1,
                marginBottom: '8px'
              }}
            >
              {stats.risks}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
              <span style={{ color: 'var(--color-hot-pink)', fontFamily: 'var(--font-mono)' }}>INTENTLOCK</span>
              <span style={{ color: 'var(--color-muted-grey)' }}>risks flagged across saved rewrites</span>
            </div>
          </div>

          {/* Card 4: Dominant Persona */}
          <div
            className="brutalist-card"
            style={{
              padding: '22px',
              borderTop: '3px solid var(--color-chartreuse)',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--glow-subtle)'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '12px'
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: 'var(--color-muted-grey)',
                  letterSpacing: '0.08em'
                }}
              >
                PRIMARY CALIBRATION
              </span>
              <Layers size={16} color="var(--color-chartreuse)" />
            </div>

            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '28px',
                fontWeight: 700,
                color: 'var(--color-white)',
                lineHeight: 1.2,
                marginBottom: '8px'
              }}
            >
              {stats.dominant}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
              <span style={{ color: 'var(--color-chartreuse)', fontFamily: 'var(--font-mono)' }}>{stats.share}</span>
              <span style={{ color: 'var(--color-muted-grey)' }}>of your saved rewrites</span>
            </div>
          </div>
        </div>

        {/* Dual Section Grid: Quick Launcher + Recent Transformations */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
            marginBottom: '36px'
          }}
        >
          {/* Quick Launcher Box */}
          <div
            style={{
              backgroundColor: 'var(--surface-card)',
              border: '1px solid var(--border-medium)',
              borderRadius: '2px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px',
                paddingBottom: '12px',
                borderBottom: '1px solid var(--border-subtle)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Zap size={16} color="var(--color-hot-pink)" />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 600 }}>
                  QUICK TRANSMUTE LAUNCHPAD
                </span>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-chartreuse)' }}>
                READY
              </span>
            </div>

            <form onSubmit={handleQuickLaunch} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <textarea
                value={quickDraft}
                onChange={(e) => setQuickDraft(e.target.value)}
                placeholder="Draft a rapid message here to jump into Studio..."
                rows={5}
                style={{
                  width: '100%',
                  backgroundColor: 'var(--color-jet-black)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '2px',
                  padding: '14px',
                  color: 'var(--color-white)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '15px',
                  lineHeight: 1.5,
                  resize: 'none'
                }}
              />

              <button type="submit" className="btn-primary" style={{ padding: '0.8rem', width: '100%' }}>
                <span>OPEN IN TRANSFORMER STUDIO</span>
                <Send size={15} />
              </button>
            </form>

            {/* Persona Quick Distribution */}
            <div style={{ marginTop: '24px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: 'var(--color-muted-grey)',
                  marginBottom: '12px'
                }}
              >
                // ACTIVE PERSONA CALIBRATION PROFILES
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {PERSONAS.map((p) => (
                  <div
                    key={p.id}
                    style={{
                      padding: '10px',
                      backgroundColor: 'var(--surface-panel)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '2px'
                    }}
                  >
                    <div style={{ fontSize: '12px', fontWeight: 600, color: p.accentColor }}>{p.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-muted-grey)', fontFamily: 'var(--font-mono)' }}>
                      Formality: {p.attributes.formality}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Transmutations Stream */}
          <div
            style={{
              backgroundColor: 'var(--surface-card)',
              border: '1px solid var(--border-medium)',
              borderRadius: '2px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px',
                paddingBottom: '12px',
                borderBottom: '1px solid var(--border-subtle)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={16} color="var(--color-chartreuse)" />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 600 }}>
                  RECENT AUDITED TRANSMUTATIONS
                </span>
              </div>
              <Link
                to="/history"
                style={{
                  color: 'var(--color-chartreuse)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11.5px',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <span>VIEW VAULT</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', maxHeight: '420px' }}>
              {history.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  style={{
                    backgroundColor: 'var(--color-jet-black)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '2px',
                    padding: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '10px',
                        padding: '2px 6px',
                        backgroundColor: 'rgba(255, 45, 168, 0.1)',
                        color: 'var(--color-hot-pink)',
                        border: '1px solid rgba(255, 45, 168, 0.3)',
                        borderRadius: '2px',
                        textTransform: 'uppercase'
                      }}
                    >
                      {item.persona}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-muted-grey)' }}>
                      {timeAgo(item.timestamp)}
                    </span>
                  </div>

                  <p
                    style={{
                      fontSize: '13.5px',
                      color: 'var(--color-white)',
                      lineHeight: 1.5,
                      margin: '4px 0 0 0'
                    }}
                  >
                    "{item.transformedText}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
