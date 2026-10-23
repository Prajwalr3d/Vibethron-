import { PenTool, Shuffle, ShieldCheck, ArrowRight } from 'lucide-react';

const STEPS = [
  {
    number: '01',
    title: 'Write your rough draft.',
    subtitle: 'RAW • UNFILTERED • EMOTIONAL',
    description:
      'Paste your unvarnished message — whether blunt, venting, or disorganized. No need to self-censor during the ideation phase.',
    icon: PenTool,
    accent: '#FF2DA8',
    detailLabel: 'INPUT PHASE',
    detailSnippet: '"Your work is late. Finish it quickly."',
  },
  {
    number: '02',
    title: 'Transform it for your audience.',
    subtitle: 'EXECUTIVE • SUPPORTIVE • LEGAL • GEN-Z',
    description:
      'Select a persona tuned to your recipient. Our contextual engines reframe tone, empathy, and vocabulary for the exact audience.',
    icon: Shuffle,
    accent: '#D4FF3F',
    detailLabel: 'TONE SHIFT',
    detailSnippet: 'Calibrating formality, warmth, and velocity.',
  },
  {
    number: '03',
    title: 'Review important changes before copying.',
    subtitle: 'INTENTLOCK™ INTEGRITY GATE',
    description:
      'IntentLock highlights altered dates, escalated promises, or stripped conditions so you never hit send with unintended legal or business liability.',
    icon: ShieldCheck,
    accent: '#FFFFFF',
    detailLabel: 'SAFETY AUDIT',
    detailSnippet: 'Zero phantom commitments. 100% intent preserved.',
  },
];

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      style={{
        paddingTop: 'clamp(3.5rem, 7vw, 6.5rem)',
        paddingBottom: 'clamp(4rem, 8vw, 7.5rem)',
        backgroundColor: 'transparent',
        borderBottom: '1px solid var(--border-subtle)',
        position: 'relative',
      }}
      aria-label="How the Transformer Works"
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
              color: 'var(--color-chartreuse)',
              letterSpacing: 'var(--tracking-eyebrow)',
              textTransform: 'uppercase',
              marginBottom: '10px',
            }}
          >
            <span>04 // WORKFLOW VELOCITY</span>
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
            THREE STEPS TO <span style={{ color: 'var(--color-hot-pink)' }}>UNCOMPROMISED COMMUNICATION</span>
          </h2>

          <p
            style={{
              color: 'var(--color-muted-grey)',
              fontSize: 'var(--text-body-md)',
              maxWidth: '640px',
              lineHeight: 1.6,
            }}
          >
            Built for executive leaders, product teams, engineers, and founders who need to move
            rapidly without triggering unintended escalation or contractual ambiguity.
          </p>
        </div>

        {/* 3 Step Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
            alignItems: 'stretch',
          }}
        >
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="brutalist-card"
                style={{
                  padding: 'clamp(1.5rem, 3vw, 2.2rem)',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  borderTop: `3px solid ${step.accent}`,
                  boxShadow: 'var(--glow-subtle)',
                }}
              >
                {/* Step Top Bar */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '20px',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '36px',
                      fontWeight: 700,
                      color: step.accent,
                      lineHeight: 1,
                    }}
                  >
                    {step.number}
                  </span>

                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '2px',
                      backgroundColor: 'var(--color-jet-black)',
                      border: `1px solid ${step.accent}44`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon size={20} color={step.accent} />
                  </div>
                </div>

                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    color: step.accent,
                    letterSpacing: '0.1em',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                  }}
                >
                  {step.subtitle}
                </div>

                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '22px',
                    fontWeight: 700,
                    color: 'var(--color-white)',
                    marginBottom: '12px',
                    lineHeight: 1.25,
                  }}
                >
                  {step.title}
                </h3>

                <p
                  style={{
                    fontSize: '14.5px',
                    color: 'var(--color-muted-grey)',
                    lineHeight: 1.6,
                    marginBottom: '24px',
                  }}
                >
                  {step.description}
                </p>

                {/* Bottom Step Code Accent */}
                <div
                  style={{
                    marginTop: 'auto',
                    backgroundColor: 'var(--color-jet-black)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '2px',
                    padding: '12px 14px',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      color: 'var(--color-muted-grey)',
                      letterSpacing: '0.08em',
                      marginBottom: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>{step.detailLabel}</span>
                    {idx < 2 && <ArrowRight size={12} color="var(--color-chartreuse)" />}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '12.5px',
                      color: 'var(--color-white)',
                    }}
                  >
                    {step.detailSnippet}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
