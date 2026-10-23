import { ArrowRight, ShieldCheck, Sparkles, Terminal } from 'lucide-react';

interface HeroSectionProps {
  onTransformClick: () => void;
  onExploreIntentLockClick: () => void;
}

export function HeroSection({ onTransformClick, onExploreIntentLockClick }: HeroSectionProps) {
  return (
    <section
      style={{
        position: 'relative',
        minHeight: 'calc(100vh - 76px)',
        display: 'flex',
        alignItems: 'center',
        paddingTop: 'clamp(2.5rem, 6vw, 5rem)',
        paddingBottom: 'clamp(3rem, 7vw, 6rem)',
        overflow: 'hidden',
        backgroundColor: 'transparent',
      }}
      aria-label="Hero Introduction"
    >
      {/* Foreground Content */}
      <div className="site-container" style={{ position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: '1080px' }}>
          {/* Eyebrow Label */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '6px 14px',
              backgroundColor: 'rgba(255, 45, 168, 0.1)',
              border: '1px solid rgba(255, 45, 168, 0.35)',
              borderRadius: '2px',
              marginBottom: 'clamp(1.2rem, 2.5vw, 2rem)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <Terminal size={14} color="var(--color-hot-pink)" />
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-eyebrow)',
                fontWeight: 600,
                letterSpacing: 'var(--tracking-eyebrow)',
                color: 'var(--color-hot-pink)',
                textTransform: 'uppercase',
              }}
            >
              AI-POWERED COMMUNICATION / 01
            </span>
          </div>

          {/* Oversized Headline */}
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 'var(--text-display-xl)',
              lineHeight: 0.88,
              letterSpacing: '-0.055em',
              textTransform: 'uppercase',
              marginBottom: 'clamp(1.5rem, 3vw, 2.4rem)',
              display: 'flex',
              flexDirection: 'column',
              userSelect: 'none',
            }}
          >
            <span
              style={{
                color: 'var(--color-hot-pink)',
                textShadow: '0 0 45px rgba(255, 45, 168, 0.3)',
                display: 'inline-block',
              }}
            >
              CHANGE YOUR TONE.
            </span>
            <span
              style={{
                color: 'var(--color-chartreuse)',
                textShadow: '0 0 45px rgba(212, 255, 63, 0.28)',
                display: 'inline-block',
                marginTop: 'clamp(0.15rem, 0.8vw, 0.4rem)',
              }}
            >
              KEEP YOUR INTENT.
            </span>
          </h1>

          {/* Supporting Copy */}
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-body-lg)',
              lineHeight: 1.6,
              color: 'var(--color-white)',
              maxWidth: '640px',
              marginBottom: 'clamp(2rem, 4vw, 3rem)',
            }}
          >
            Rewrite for any audience. Protect what you really mean.
            <span
              style={{
                display: 'block',
                marginTop: '8px',
                fontSize: 'var(--text-body-md)',
                color: 'var(--color-muted-grey)',
              }}
            >
              Transform raw drafts into executive, supportive, legal, or Gen-Z messages while our patent-pending{' '}
              <strong style={{ color: 'var(--color-chartreuse)', fontWeight: 600 }}>IntentLock™</strong> engine prevents
              accidental commitments, date slips, and omitted terms.
            </span>
          </p>

          {/* Action CTAs */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '16px',
              alignItems: 'center',
              marginBottom: 'clamp(3rem, 6vw, 4.5rem)',
            }}
          >
            <button
              onClick={onTransformClick}
              className="btn-primary"
              id="hero-transform-btn"
            >
              <span>TRANSFORM A MESSAGE</span>
              <ArrowRight size={18} />
            </button>

            <button
              onClick={onExploreIntentLockClick}
              className="btn-secondary"
              id="hero-intentlock-btn"
            >
              <ShieldCheck size={18} />
              <span>EXPLORE INTENTLOCK</span>
            </button>
          </div>

          {/* Brutalist Metadata Metric Badges */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '16px',
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: '24px',
              maxWidth: '880px',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: 'var(--color-hot-pink)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                }}
              >
                // 01 ARCHITECTURE
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '15px',
                  fontWeight: 600,
                  color: 'var(--color-white)',
                }}
              >
                Instant 4-Persona Engine
              </div>
              <div
                style={{
                  fontSize: '13px',
                  color: 'var(--color-muted-grey)',
                }}
              >
                Executive, Supportive, Legal & Gen-Z
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: 'var(--color-chartreuse)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                }}
              >
                // 02 SIGNATURE DEFENSE
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '15px',
                  fontWeight: 600,
                  color: 'var(--color-white)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>IntentLock™ Safeguard</span>
                <Sparkles size={14} color="var(--color-chartreuse)" />
              </div>
              <div
                style={{
                  fontSize: '13px',
                  color: 'var(--color-muted-grey)',
                }}
              >
                Guards commitments, dates & facts
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: 'var(--color-white)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                }}
              >
                // 03 INTEGRITY AUDIT
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '15px',
                  fontWeight: 600,
                  color: 'var(--color-white)',
                }}
              >
                Zero Phantom Warranties
              </div>
              <div
                style={{
                  fontSize: '13px',
                  color: 'var(--color-muted-grey)',
                }}
              >
                Catches inadvertent promise creep
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
