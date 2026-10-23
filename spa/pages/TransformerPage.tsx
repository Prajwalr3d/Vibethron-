import { useCallback, useState } from 'react';
import { Sparkles, Sliders } from 'lucide-react';
import { Transformer3DCanvas } from '../components/Transformer3DCanvas';
import { PERSONAS, type PersonaId } from '../types/transformer';
import { useApp } from '../context/AppContext';
import Workbench from '@/components/Workbench';
import { vibeForPersona } from '@/lib/personas';

// The Studio: the persona selector and 3D core from the original design, driving the live engine
// (Gemini rewrite + IntentLock, Fact Guard and Meaning Match checks) below.
export function TransformerPage() {
  const { settings } = useApp();
  const [selectedPersona, setSelectedPersona] = useState<PersonaId>(settings.defaultPersona);
  const [isTransforming, setIsTransforming] = useState(false);
  const onTransformingChange = useCallback((busy: boolean) => setIsTransforming(busy), []);
  const currentPersona = PERSONAS.find((p) => p.id === selectedPersona) || PERSONAS[0];

  const selectPersona = (id: PersonaId) => {
    setSelectedPersona(id);
    // Jump to that persona's rewrite if there is one.
    document.getElementById(`vibe-${vibeForPersona(id)}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 76px)',
        backgroundColor: 'transparent',
        position: 'relative',
        paddingTop: 'clamp(2rem, 4vw, 3.5rem)',
        paddingBottom: 'clamp(2rem, 4vw, 3rem)',
        overflowX: 'hidden'
      }}
    >
      <Transformer3DCanvas persona={selectedPersona} isTransforming={isTransforming} />

      <div className="site-container" style={{ position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: '780px', marginBottom: '32px' }}>
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
              marginBottom: '10px'
            }}
          >
            <Sparkles size={14} />
            <span>TRANSFORMER STUDIO // LIVE ENGINE</span>
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
            PRECISION <span style={{ color: 'var(--color-hot-pink)' }}>COMMUNICATION</span> STUDIO
          </h1>

          <p style={{ color: 'var(--color-muted-grey)', fontSize: 'var(--text-body-md)', lineHeight: 1.6 }}>
            One transformation writes all four personas. IntentLock and Fact Guard check every rewrite in plain code,
            and Meaning Match compares it with your draft using a model that runs in your browser.
          </p>
        </div>

        <div style={{ marginBottom: '32px' }}>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--color-muted-grey)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '6px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sliders size={13} color="var(--color-chartreuse)" />
              <span>FOCUS PERSONA (all four are written every time)</span>
            </div>
            <span style={{ color: currentPersona.accentColor }}>GEOMETRIC STATE: {currentPersona.name.toUpperCase()}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
            {PERSONAS.map((p) => {
              const isSelected = selectedPersona === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => selectPersona(p.id)}
                  aria-pressed={isSelected}
                  style={{
                    textAlign: 'left',
                    backgroundColor: isSelected ? 'var(--surface-elevated)' : 'var(--surface-card)',
                    border: `1.5px solid ${isSelected ? p.accentColor : 'var(--border-subtle)'}`,
                    borderRadius: '2px',
                    padding: '16px',
                    cursor: 'pointer',
                    color: 'var(--color-white)',
                    transition: 'all var(--transition-fast)',
                    boxShadow: isSelected ? `3px 3px 0px ${p.accentColor}` : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '9.5px',
                        color: isSelected ? p.accentColor : 'var(--color-muted-grey)',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase'
                      }}
                    >
                      {p.badge}
                    </span>
                    <h2
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '18px',
                        fontWeight: 700,
                        color: isSelected ? p.accentColor : 'var(--color-white)',
                        margin: '6px 0 4px'
                      }}
                    >
                      {p.name}
                    </h2>
                    <p style={{ fontSize: '12.5px', color: 'var(--color-muted-grey)', lineHeight: 1.45 }}>{p.tagline}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <Workbench focusVibe={vibeForPersona(selectedPersona)} onTransformingChange={onTransformingChange} />
      </div>
    </div>
  );
}
