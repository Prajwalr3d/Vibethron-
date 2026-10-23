import { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  FileCheck,
  Flame,
  Info
} from 'lucide-react';
import { INTENTLOCK_DEMO_CASE, INTENTLOCK_PILLARS } from '../types/transformer';

export function IntentLockSection() {
  const [activeTab, setActiveTab] = useState<'risky' | 'safe'>('risky');
  const [selectedPillar, setSelectedPillar] = useState<string>('commitments');

  const activePillarData =
    INTENTLOCK_PILLARS.find((p) => p.id === selectedPillar) || INTENTLOCK_PILLARS[0];

  return (
    <section
      id="intentlock"
      style={{
        paddingTop: 'clamp(3.5rem, 7vw, 6.5rem)',
        paddingBottom: 'clamp(4rem, 8vw, 7.5rem)',
        backgroundColor: 'transparent',
        borderBottom: '1px solid var(--border-subtle)',
        position: 'relative',
      }}
      aria-label="IntentLock Signature Demonstration"
    >
      <div className="site-container">
        {/* Section Header */}
        <div style={{ marginBottom: 'clamp(2rem, 4vw, 3.5rem)' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-eyebrow)',
              color: 'var(--color-hot-pink)',
              letterSpacing: 'var(--tracking-eyebrow)',
              textTransform: 'uppercase',
              marginBottom: '10px',
            }}
          >
            <ShieldAlert size={14} />
            <span>03 // SIGNATURE ARCHITECTURE</span>
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-h2)',
              fontWeight: 700,
              letterSpacing: 'var(--tracking-tight)',
              textTransform: 'uppercase',
              color: 'var(--color-white)',
              lineHeight: 1.05,
              marginBottom: '14px',
            }}
          >
            HOW INTENTLOCK™ PREVENTS{' '}
            <span style={{ color: 'var(--color-chartreuse)' }}>PROMISE CREEP</span>
          </h2>

          <p
            style={{
              color: 'var(--color-muted-grey)',
              fontSize: 'var(--text-body-md)',
              maxWidth: '720px',
              lineHeight: 1.6,
            }}
          >
            Standard AI models ruthlessly streamline words for smoothness, but inadvertently strip
            critical conditional clauses, harden speculative timelines into binding promises, and discard
            prerequisite approvals. IntentLock runs deep semantic parity checks to safeguard your actual intent.
          </p>
        </div>

        {/* Interactive Comparison Card Showcase */}
        <div
          style={{
            backgroundColor: 'var(--surface-card)',
            border: '1.5px solid var(--border-medium)',
            borderRadius: '2px',
            padding: 'clamp(1.5rem, 3.5vw, 2.5rem)',
            marginBottom: '40px',
            boxShadow: 'var(--glow-subtle)',
          }}
        >
          {/* Mode Switcher Buttons */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid var(--border-subtle)',
              paddingBottom: '18px',
              marginBottom: '24px',
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
                  gap: '8px',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <Flame size={14} color="var(--color-risk-red)" />
                <span>UNCHECKED AI REWRITE (HIGH RISK)</span>
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
                  gap: '8px',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <ShieldCheck size={14} color="var(--color-chartreuse)" />
                <span>INTENTLOCK REMEDIATED (SAFE)</span>
              </button>
            </div>

            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--color-muted-grey)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Info size={13} />
              <span>INTENTLOCK EXAMPLE (TRY YOUR OWN ON THE INTENTLOCK PAGE)</span>
            </div>
          </div>

          {/* Three-Column Comparison Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px',
              marginBottom: '28px',
            }}
          >
            {/* 1. Original User Draft */}
            <div
              style={{
                backgroundColor: 'var(--color-jet-black)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '2px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: 'var(--color-muted-grey)',
                  letterSpacing: '0.08em',
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-muted-grey)',
                  }}
                />
                <span>01 // ORIGINAL USER INPUT</span>
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
                  marginBottom: '16px',
                }}
              >
                "{INTENTLOCK_DEMO_CASE.original}"
              </blockquote>

              <div
                style={{
                  marginTop: 'auto',
                  fontSize: '12.5px',
                  color: 'var(--color-muted-grey)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                <div>• Expressed uncertainty: "might"</div>
                <div>• Explicit prerequisite: "need approval first"</div>
              </div>
            </div>

            {/* 2. Unchecked or Remediated Rewrite */}
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
                    : '0 0 25px rgba(212, 255, 63, 0.12)',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: activeTab === 'risky' ? 'var(--color-risk-red)' : 'var(--color-chartreuse)',
                  letterSpacing: '0.08em',
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                {activeTab === 'risky' ? (
                  <>
                    <AlertTriangle size={13} color="var(--color-risk-red)" />
                    <span>02 // UNCHECKED AI REWRITE (DANGEROUS)</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={13} color="var(--color-chartreuse)" />
                    <span>02 // INTENTLOCK SAFER ALTERNATIVE</span>
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
                  marginBottom: '16px',
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
                        borderRadius: '2px',
                        border: '1px solid var(--color-risk-red)',
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
                        borderRadius: '2px',
                        border: '1px solid var(--color-chartreuse)',
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
                        borderRadius: '2px',
                        border: '1px solid var(--color-chartreuse)',
                      }}
                    >
                      subject to approval
                    </mark>
                    ."
                  </>
                )}
              </blockquote>

              <div
                style={{
                  marginTop: 'auto',
                  fontSize: '12.5px',
                  fontFamily: 'var(--font-mono)',
                  color: activeTab === 'risky' ? '#FFA8A3' : 'var(--color-chartreuse)',
                }}
              >
                {activeTab === 'risky' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div>⚠️ "might" converted to unconditional "will"</div>
                    <div>⚠️ Approval prerequisite was deleted</div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div>✓ Retains realistic timeline expectation</div>
                    <div>✓ Explicitly preserves prerequisite approval</div>
                  </div>
                )}
              </div>
            </div>

            {/* 3. IntentLock Analysis Report */}
            <div
              style={{
                backgroundColor: 'var(--color-jet-black)',
                border: '1px solid var(--border-medium)',
                borderRadius: '2px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: 'var(--color-hot-pink)',
                  letterSpacing: '0.08em',
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <FileCheck size={13} color="var(--color-hot-pink)" />
                <span>03 // INTENTLOCK™ DEFENSE AUDIT</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    backgroundColor: 'rgba(255, 59, 48, 0.08)',
                    border: '1px solid rgba(255, 59, 48, 0.3)',
                    padding: '10px 12px',
                    borderRadius: '2px',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      color: 'var(--color-risk-red)',
                      fontWeight: 600,
                      marginBottom: '4px',
                    }}
                  >
                    [ CRITICAL ]: UNINTENDED COMMITMENT DETECTED
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--color-white)', lineHeight: 1.5 }}>
                    The rewrite escalated a tentative intention ("might") into a legally enforceable
                    promise ("will"), introducing binding exposure without author consent.
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: 'rgba(212, 255, 63, 0.08)',
                    border: '1px solid rgba(212, 255, 63, 0.25)',
                    padding: '10px 12px',
                    borderRadius: '2px',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      color: 'var(--color-chartreuse)',
                      fontWeight: 600,
                      marginBottom: '4px',
                    }}
                  >
                    [ REMEDIATION ]: PRESERVED PREREQUISITE
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--color-white)', lineHeight: 1.5 }}>
                    Re-inserted "subject to approval", guarding author against milestone penalties if
                    sign-offs stall.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive 5-Pillar Inspector Tabs */}
          <div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--color-muted-grey)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>EXPLORE THE 5 INTENTLOCK AUDIT PILLARS:</span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '10px',
                marginBottom: '16px',
              }}
            >
              {INTENTLOCK_PILLARS.map((pillar) => {
                const isSelected = selectedPillar === pillar.id;
                return (
                  <button
                    key={pillar.id}
                    onClick={() => setSelectedPillar(pillar.id)}
                    style={{
                      backgroundColor: isSelected ? 'var(--color-jet-black)' : 'var(--surface-panel)',
                      border: `1px solid ${isSelected ? pillar.color : 'var(--border-subtle)'}`,
                      color: isSelected ? pillar.color : 'var(--color-white)',
                      padding: '12px 14px',
                      borderRadius: '2px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all var(--transition-fast)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '10px',
                        color: isSelected ? pillar.color : 'var(--color-muted-grey)',
                      }}
                    >
                      {pillar.shortCode}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '14px',
                        fontWeight: 600,
                      }}
                    >
                      {pillar.title}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Selected Pillar Detail Card */}
            <div
              style={{
                backgroundColor: 'var(--color-jet-black)',
                border: `1px solid ${activePillarData.color}`,
                padding: '16px 20px',
                borderRadius: '2px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
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
                  fontWeight: 600,
                }}
              >
                <span>PILLAR SPECIFICATION //</span>
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
                  marginTop: '4px',
                }}
              >
                Detection rule: {activePillarData.detectionRule}
              </div>
            </div>
          </div>
        </div>

        {/* Clear Demonstration Assessment Label */}
        <div
          style={{
            padding: '14px 18px',
            backgroundColor: 'rgba(255, 45, 168, 0.05)',
            border: '1px solid rgba(255, 45, 168, 0.3)',
            borderRadius: '2px',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            color: 'var(--color-white)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-hot-pink)',
              }}
            />
            <span>
              NOTICE: This is an interactive demonstration of IntentLock™ analysis, not a verified AI
              assessment of your personal legal documents.
            </span>
          </div>

          <span style={{ color: 'var(--color-hot-pink)', fontWeight: 600 }}>
            PATENT PENDING // SEMANTIC PARITY
          </span>
        </div>
      </div>
    </section>
  );
}
