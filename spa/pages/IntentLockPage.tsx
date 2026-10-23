import { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Flame,
  Search,
  Shield
} from 'lucide-react';
import { IntentLock3DCanvas } from '../components/IntentLock3DCanvas';
import { INTENTLOCK_PILLARS, INTENTLOCK_DEMO_CASE } from '../types/transformer';
import { useApp } from '../context/AppContext';
import { checkIntent } from '@/lib/intentlock';

export function IntentLockPage() {
  const [activeTab, setActiveTab] = useState<'risky' | 'safe'>('risky');
  const [selectedPillar, setSelectedPillar] = useState<string>('commitments');
  const { settings } = useApp();
  const [auditOriginal, setAuditOriginal] = useState(INTENTLOCK_DEMO_CASE.original);
  const [auditRewrite, setAuditRewrite] = useState(INTENTLOCK_DEMO_CASE.riskyRewrite);
  // Plain-code IntentLock result; null until the first scan.
  const [audit, setAudit] = useState<ReturnType<typeof checkIntent> | null>(null);

  const activePillarData =
    INTENTLOCK_PILLARS.find((p) => p.id === selectedPillar) || INTENTLOCK_PILLARS[0];

  const handleRunAudit = () => {
    if (!auditOriginal.trim() || !auditRewrite.trim()) return;
    setAudit(checkIntent(auditOriginal, auditRewrite, settings.intentLockStrictness));
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
      {/* 3D Sculptural Shield / Lock Canvas */}
      <IntentLock3DCanvas isSafe={activeTab === 'safe'} />

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
            <Shield size={14} />
            <span>SEMANTIC AUDIT PROTOCOL // INTENTLOCK™ v2.0</span>
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
            PARITY <span style={{ color: 'var(--color-chartreuse)' }}>VERIFICATION</span> ENGINE
          </h1>

          <p style={{ color: 'var(--color-muted-grey)', fontSize: 'var(--text-body-md)', lineHeight: 1.6 }}>
            The sculptural 3D shield reflects real-time semantic integrity. When unintentional commitments or
            omitted conditions are detected, the tumbler shifts to high-risk telemetry with warning frequencies.
          </p>
        </div>

        {/* Live Intent Auditor Bar */}
        <div
          style={{
            backgroundColor: 'var(--surface-card)',
            border: '1.5px solid var(--border-medium)',
            padding: '20px 24px',
            borderRadius: '2px',
            marginBottom: '36px',
            boxShadow: 'var(--glow-subtle)'
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--color-muted-grey)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Search size={13} color="var(--color-chartreuse)" />
            <span>AUDIT ANY ORIGINAL AND REWRITE (PLAIN CODE, NO AI, INSTANT)</span>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <textarea
              value={auditOriginal}
              onChange={(e) => setAuditOriginal(e.target.value)}
              placeholder="Original message"
              rows={3}
              style={{
                flex: 1,
                minWidth: '260px',
                backgroundColor: 'var(--color-jet-black)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '2px',
                padding: '12px 16px',
                color: 'var(--color-white)',
                fontFamily: 'var(--font-body)',
                fontSize: '15px',
                resize: 'vertical'
              }}
            />
            <textarea
              value={auditRewrite}
              onChange={(e) => setAuditRewrite(e.target.value)}
              placeholder="Rewritten message to check"
              rows={3}
              style={{
                flex: 1,
                minWidth: '260px',
                backgroundColor: 'var(--color-jet-black)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '2px',
                padding: '12px 16px',
                color: 'var(--color-white)',
                fontFamily: 'var(--font-body)',
                fontSize: '15px',
                resize: 'vertical'
              }}
            />

            <button
              onClick={handleRunAudit}
              className="btn-secondary"
              style={{ padding: '0.75rem 1.6rem', fontSize: '13.5px' }}
            >
              <ShieldAlert size={15} />
              <span>ANALYZE INTENT</span>
            </button>
          </div>
          {audit && <AuditResults audit={audit} />}
        </div>

        {/* Comparison Showcase with Tab Switcher */}
        <div
          style={{
            backgroundColor: 'var(--surface-card)',
            border: '1.5px solid var(--border-medium)',
            borderRadius: '2px',
            padding: 'clamp(1.5rem, 3vw, 2.5rem)',
            marginBottom: '36px'
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid var(--border-subtle)',
              paddingBottom: '18px',
              marginBottom: '24px'
            }}
          >
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setActiveTab('risky')}
                style={{
                  backgroundColor: activeTab === 'risky' ? 'rgba(255, 59, 48, 0.15)' : 'transparent',
                  border: `1.5px solid ${activeTab === 'risky' ? 'var(--color-risk-red)' : 'var(--border-subtle)'}`,
                  color: activeTab === 'risky' ? 'var(--color-white)' : 'var(--color-muted-grey)',
                  padding: '8px 16px',
                  borderRadius: '2px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Flame size={14} color="var(--color-risk-red)" />
                <span>HIGH RISK (GENERIC AI REWRITE)</span>
              </button>

              <button
                onClick={() => setActiveTab('safe')}
                style={{
                  backgroundColor: activeTab === 'safe' ? 'rgba(212, 255, 63, 0.12)' : 'transparent',
                  border: `1.5px solid ${activeTab === 'safe' ? 'var(--color-chartreuse)' : 'var(--border-subtle)'}`,
                  color: activeTab === 'safe' ? 'var(--color-chartreuse)' : 'var(--color-muted-grey)',
                  padding: '8px 16px',
                  borderRadius: '2px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <ShieldCheck size={14} color="var(--color-chartreuse)" />
                <span>SAFE ALTERNATIVE (INTENTLOCK)</span>
              </button>
            </div>

            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-muted-grey)' }}>
              CURRENT 3D SHIELD STATUS: {activeTab === 'safe' ? 'SECURED / PARITY OK' : 'CRITICAL BREACH WARNING'}
            </div>
          </div>

          {/* Cards Display */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px',
              marginBottom: '28px'
            }}
          >
            {/* Input snippet */}
            <div
              style={{
                backgroundColor: 'var(--color-jet-black)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '2px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: 'var(--color-muted-grey)',
                  letterSpacing: '0.08em',
                  marginBottom: '10px'
                }}
              >
                // 01 RAW AUTHOR DRAFT
              </div>
              <blockquote
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '16px',
                  lineHeight: 1.6,
                  color: 'var(--color-white)',
                  margin: 0,
                  padding: '12px 14px',
                  backgroundColor: 'var(--surface-panel)',
                  borderLeft: '3px solid var(--color-muted-grey)',
                  borderRadius: '2px',
                  marginBottom: '14px'
                }}
              >
                "{INTENTLOCK_DEMO_CASE.original}"
              </blockquote>
              <div style={{ fontSize: '12px', color: 'var(--color-muted-grey)', fontFamily: 'var(--font-mono)' }}>
                Contains probability constraint ("might") and critical milestone prerequisite ("need approval first").
              </div>
            </div>

            {/* AI Output comparison */}
            <div
              style={{
                backgroundColor: 'var(--color-jet-black)',
                border: `1.5px solid ${activeTab === 'risky' ? 'var(--color-risk-red)' : 'var(--color-chartreuse)'}`,
                borderRadius: '2px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                boxShadow:
                  activeTab === 'risky'
                    ? '0 0 25px rgba(255, 59, 48, 0.12)'
                    : '0 0 25px rgba(212, 255, 63, 0.12)'
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: activeTab === 'risky' ? 'var(--color-risk-red)' : 'var(--color-chartreuse)',
                  letterSpacing: '0.08em',
                  marginBottom: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {activeTab === 'risky' ? (
                  <>
                    <AlertTriangle size={13} color="var(--color-risk-red)" />
                    <span>// 02 UNCHECKED REWRITE (RISK INTRODUCED)</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={13} color="var(--color-chartreuse)" />
                    <span>// 02 REMEDIATED SAFE REWRITE</span>
                  </>
                )}
              </div>

              <blockquote
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '16px',
                  lineHeight: 1.6,
                  color: 'var(--color-white)',
                  margin: 0,
                  padding: '12px 14px',
                  backgroundColor: 'var(--surface-panel)',
                  borderLeft: `3px solid ${activeTab === 'risky' ? 'var(--color-risk-red)' : 'var(--color-chartreuse)'}`,
                  borderRadius: '2px',
                  marginBottom: '14px'
                }}
              >
                {activeTab === 'risky' ? (
                  <>
                    "I{' '}
                    <mark
                      style={{
                        backgroundColor: 'rgba(255, 59, 48, 0.3)',
                        color: '#FFA8A3',
                        padding: '2px 6px',
                        border: '1px solid var(--color-risk-red)'
                      }}
                    >
                      will deliver
                    </mark>{' '}
                    the completed project by Friday."
                  </>
                ) : (
                  <>
                    "I{' '}
                    <mark
                      style={{
                        backgroundColor: 'rgba(212, 255, 63, 0.25)',
                        color: 'var(--color-chartreuse)',
                        padding: '2px 6px',
                        border: '1px solid var(--color-chartreuse)'
                      }}
                    >
                      expect to finish
                    </mark>{' '}
                    by Friday,{' '}
                    <mark
                      style={{
                        backgroundColor: 'rgba(212, 255, 63, 0.25)',
                        color: 'var(--color-chartreuse)',
                        padding: '2px 6px',
                        border: '1px solid var(--color-chartreuse)'
                      }}
                    >
                      subject to approval
                    </mark>
                    ."
                  </>
                )}
              </blockquote>

              <div style={{ fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
                {activeTab === 'risky' ? (
                  <span style={{ color: 'var(--color-risk-red)' }}>
                    High-Risk: Promise created; dependency stripped.
                  </span>
                ) : (
                  <span style={{ color: 'var(--color-chartreuse)' }}>
                    Protected: Target preserved; dependency retained.
                  </span>
                )}
              </div>
            </div>

            {/* Audit diagnostics */}
            <div
              style={{
                backgroundColor: 'var(--color-jet-black)',
                border: '1px solid var(--border-medium)',
                borderRadius: '2px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: 'var(--color-hot-pink)',
                  letterSpacing: '0.08em'
                }}
              >
                // 03 INTENTLOCK DIAGNOSTICS
              </div>

              <div
                style={{
                  backgroundColor: 'rgba(255, 59, 48, 0.08)',
                  border: '1px solid rgba(255, 59, 48, 0.3)',
                  padding: '10px 12px',
                  borderRadius: '2px',
                  fontSize: '12px',
                  color: 'var(--color-white)'
                }}
              >
                <div style={{ color: 'var(--color-risk-red)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                  [ COMMITMENT INFLATION ]
                </div>
                <div>Changed tentative "might" to binding promise "will".</div>
              </div>

              <div
                style={{
                  backgroundColor: 'rgba(212, 255, 63, 0.08)',
                  border: '1px solid rgba(212, 255, 63, 0.25)',
                  padding: '10px 12px',
                  borderRadius: '2px',
                  fontSize: '12px',
                  color: 'var(--color-white)'
                }}
              >
                <div style={{ color: 'var(--color-chartreuse)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                  [ PREREQUISITE DEFENSE ]
                </div>
                <div>Restored "subject to approval" clause into final output.</div>
              </div>
            </div>
          </div>

          {/* 5 Pillars Explorer */}
          <div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--color-muted-grey)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '12px'
              }}
            >
              THE FIVE CORE INTENTLOCK VERIFICATION PILLARS:
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '10px',
                marginBottom: '16px'
              }}
            >
              {INTENTLOCK_PILLARS.map((p) => {
                const isSelected = selectedPillar === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPillar(p.id)}
                    style={{
                      backgroundColor: isSelected ? 'var(--color-jet-black)' : 'var(--surface-panel)',
                      border: `1px solid ${isSelected ? p.color : 'var(--border-subtle)'}`,
                      color: isSelected ? p.color : 'var(--color-white)',
                      padding: '12px 14px',
                      borderRadius: '2px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-muted-grey)' }}>
                      {p.shortCode}
                    </span>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 600 }}>
                      {p.title}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Pillar Specification card */}
            <div
              style={{
                backgroundColor: 'var(--color-jet-black)',
                border: `1px solid ${activePillarData.color}`,
                padding: '18px 22px',
                borderRadius: '2px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  color: activePillarData.color,
                  fontWeight: 600
                }}
              >
                <span>SPECIFICATION //</span>
                <span>{activePillarData.title.toUpperCase()}</span>
              </div>
              <p style={{ color: 'var(--color-white)', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
                {activePillarData.description}
              </p>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  color: 'var(--color-muted-grey)',
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '8px',
                  marginTop: '4px'
                }}
              >
                Detection rule: {activePillarData.detectionRule}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const LEVEL_COLOR: Record<string, string> = {
  critical: 'var(--color-risk-red)',
  moderate: '#FFB020',
  safe: 'var(--color-chartreuse)'
};

// Live IntentLock findings, one card per risk, plus the per-category verdicts.
function AuditResults({ audit }: { audit: ReturnType<typeof checkIntent> }) {
  return (
    <div style={{ marginTop: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {Object.entries(audit.categories).map(([category, level]) => (
          <span
            key={category}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10.5px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              padding: '4px 8px',
              borderRadius: '2px',
              border: `1px solid ${LEVEL_COLOR[level]}`,
              color: LEVEL_COLOR[level]
            }}
          >
            {category}: {level}
          </span>
        ))}
      </div>
      {audit.risks.length === 0 ? (
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--color-chartreuse)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={16} /> PARITY OK: commitments, deadlines, facts, conditions and negations all survived.
        </div>
      ) : (
        audit.risks.map((r) => (
          <div
            key={r.id}
            style={{
              backgroundColor: 'var(--color-jet-black)',
              border: `1px solid ${LEVEL_COLOR[r.riskLevel]}`,
              borderLeft: `3px solid ${LEVEL_COLOR[r.riskLevel]}`,
              borderRadius: '2px',
              padding: '12px 14px'
            }}
          >
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: LEVEL_COLOR[r.riskLevel], letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              [ {r.riskLevel} ] {r.categoryLabel}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', margin: '6px 0' }}>
              <span style={{ color: 'var(--color-muted-grey)' }}>&ldquo;{r.originalSnippet}&rdquo;</span>
              <span style={{ color: 'var(--color-hot-pink)', margin: '0 8px' }}>&rarr;</span>
              <span>{r.rewrittenSnippet}</span>
            </div>
            <div style={{ fontSize: '13px', color: 'var(--color-white)' }}>{r.explanation}</div>
            <div style={{ fontSize: '12.5px', color: 'var(--color-chartreuse)', marginTop: '4px' }}>{r.safeguardRecommendation}</div>
          </div>
        ))
      )}
    </div>
  );
}
