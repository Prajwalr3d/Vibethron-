import { ArrowUp, Sparkles, ShieldCheck } from 'lucide-react';

interface CallToActionSectionProps {
  onScrollToTransformer: () => void;
  onScrollToIntentLock: () => void;
}

export function CallToActionSection({
  onScrollToTransformer,
  onScrollToIntentLock,
}: CallToActionSectionProps) {
  return (
    <section
      style={{
        paddingTop: 'clamp(4.5rem, 9vw, 8rem)',
        paddingBottom: 'clamp(4.5rem, 9vw, 8rem)',
        backgroundColor: 'transparent',
        position: 'relative',
        overflow: 'hidden',
      }}
      aria-label="Call to Action"
    >
      {/* Background Neon Ambient Glows */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'clamp(320px, 60vw, 800px)',
          height: 'clamp(320px, 40vw, 500px)',
          background: 'radial-gradient(ellipse at center, rgba(255, 45, 168, 0.16) 0%, rgba(212, 255, 63, 0.08) 50%, rgba(11, 11, 11, 0) 75%)',
          pointerEvents: 'none',
          filter: 'blur(50px)',
        }}
        aria-hidden="true"
      />

      <div className="site-container" style={{ position: 'relative', zIndex: 10 }}>
        <div
          style={{
            border: '2px solid var(--border-medium)',
            backgroundColor: 'var(--surface-panel)',
            padding: 'clamp(2.5rem, 6vw, 5rem) clamp(1.5rem, 4vw, 3.5rem)',
            borderRadius: '2px',
            textAlign: 'center',
            position: 'relative',
            boxShadow: 'var(--glow-subtle)',
          }}
        >
          {/* Eyebrow */}
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
              marginBottom: 'clamp(1rem, 2vw, 1.6rem)',
            }}
          >
            <Sparkles size={14} />
            <span>05 // ZERO COMPROMISE COMMUNICATION</span>
          </div>

          {/* Bold Closing Headline */}
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-display-lg)',
              fontWeight: 700,
              lineHeight: 0.9,
              letterSpacing: 'var(--tracking-tighter)',
              textTransform: 'uppercase',
              marginBottom: 'clamp(1.5rem, 3vw, 2.2rem)',
            }}
          >
            <span style={{ color: 'var(--color-white)', display: 'block' }}>MAKE EVERY</span>
            <span style={{ color: 'var(--color-hot-pink)', display: 'block' }}>WORD COUNT.</span>
          </h2>

          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-body-lg)',
              lineHeight: 1.6,
              color: 'var(--color-muted-grey)',
              maxWidth: '620px',
              marginLeft: 'auto',
              marginRight: 'auto',
              marginBottom: 'clamp(2rem, 4vw, 3rem)',
            }}
          >
            Whether you are delivering executive reports, managing delicate team dynamics, or clarifying
            complex contractual timelines, let IntentLock protect your promises.
          </p>

          {/* CTA Buttons */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '16px',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <button
              onClick={onScrollToTransformer}
              className="btn-primary"
              id="cta-scroll-btn"
              style={{ padding: '1rem 2.2rem', fontSize: '16px' }}
            >
              <span>TRANSFORM A MESSAGE NOW</span>
              <ArrowUp size={18} />
            </button>

            <button
              onClick={onScrollToIntentLock}
              className="btn-secondary"
              style={{ padding: '1rem 2.2rem', fontSize: '16px' }}
            >
              <ShieldCheck size={18} />
              <span>EXPLORE INTENTLOCK</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
