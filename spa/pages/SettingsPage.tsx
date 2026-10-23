import { useEffect, useState } from 'react';
import {
  Settings,
  Shield,
  Sliders,
  Save,
  Check,
  Cpu,
  User
} from 'lucide-react';
import { Settings3DCanvas } from '../components/Settings3DCanvas';
import { useApp } from '../context/AppContext';
import { PERSONAS, type PersonaId } from '../types/transformer';

export function SettingsPage() {
  const { user, settings, updateSettings } = useApp();
  const [strictness, setStrictness] = useState(settings.intentLockStrictness);
  const [defaultPersona, setDefaultPersona] = useState<PersonaId>(settings.defaultPersona);
  const [autoSave, setAutoSave] = useState(settings.autoSaveHistory);
  const [preserveQuotes, setPreserveQuotes] = useState(settings.preserveQuotes);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      intentLockStrictness: strictness,
      defaultPersona,
      autoSaveHistory: autoSave,
      preserveQuotes
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2200);
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
      {/* 3D Calibration Gyroscope Canvas */}
      <Settings3DCanvas />

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
            <Settings size={14} />
            <span>CALIBRATION SUITE // SYSTEM DIRECTIVES</span>
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
            SYSTEM <span style={{ color: 'var(--color-chartreuse)' }}>CALIBRATION</span>
          </h1>

          <p style={{ color: 'var(--color-muted-grey)', fontSize: 'var(--text-body-md)', lineHeight: 1.6 }}>
            Adjust the algorithmic sensitivity of the IntentLock engine, see which server keys are configured for
            enterprise LLMs, and tailor default persona baselines.
          </p>
        </div>

        {/* Settings Form Container */}
        <form onSubmit={handleSave} style={{ maxWidth: '820px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Section 1: User Profile Panel */}
          <div
            style={{
              backgroundColor: 'var(--surface-card)',
              border: '1px solid var(--border-medium)',
              borderRadius: '2px',
              padding: '24px'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                paddingBottom: '12px',
                borderBottom: '1px solid var(--border-subtle)',
                marginBottom: '18px'
              }}
            >
              <User size={16} color="var(--color-hot-pink)" />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 600 }}>
                USER IDENTITY & SEED PROFILE
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-muted-grey)', marginBottom: '6px' }}>
                  OPERATOR NAME
                </label>
                <input
                  type="text"
                  disabled
                  value={user.name}
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--color-jet-black)',
                    border: '1px solid var(--border-subtle)',
                    padding: '10px 14px',
                    borderRadius: '2px',
                    color: 'var(--color-white)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                    opacity: 0.8
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-muted-grey)', marginBottom: '6px' }}>
                  REGISTERED EMAIL
                </label>
                <input
                  type="text"
                  disabled
                  value={user.email || 'alex@intent-shift.ai'}
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--color-jet-black)',
                    border: '1px solid var(--border-subtle)',
                    padding: '10px 14px',
                    borderRadius: '2px',
                    color: 'var(--color-white)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                    opacity: 0.8
                  }}
                />
              </div>
            </div>
          </div>

          {/* Section 2: IntentLock Verification Rules */}
          <div
            style={{
              backgroundColor: 'var(--surface-card)',
              border: '1px solid var(--border-medium)',
              borderRadius: '2px',
              padding: '24px'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                paddingBottom: '12px',
                borderBottom: '1px solid var(--border-subtle)',
                marginBottom: '18px'
              }}
            >
              <Shield size={16} color="var(--color-chartreuse)" />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 600 }}>
                INTENTLOCK™ STRICTNESS SENSITIVITY
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {(['strict', 'standard', 'lenient'] as const).map((level) => {
                const isSelected = strictness === level;
                return (
                  <div
                    key={level}
                    onClick={() => setStrictness(level)}
                    style={{
                      padding: '14px 18px',
                      backgroundColor: isSelected ? 'var(--color-jet-black)' : 'var(--surface-panel)',
                      border: `1.5px solid ${isSelected ? 'var(--color-chartreuse)' : 'var(--border-subtle)'}`,
                      borderRadius: '2px',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: '16px',
                          fontWeight: 700,
                          color: isSelected ? 'var(--color-chartreuse)' : 'var(--color-white)',
                          textTransform: 'uppercase'
                        }}
                      >
                        {level === 'strict' && 'Strict Parity (Zero Tolerance)'}
                        {level === 'standard' && 'Standard Business Protection (Recommended)'}
                        {level === 'lenient' && 'Lenient Creative Latitude'}
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--color-muted-grey)', marginTop: '4px' }}>
                        {level === 'strict' &&
                          'Flags any alteration of modal verbs ("might" to "will"), conditional drops, or date format changes.'}
                        {level === 'standard' &&
                          'Catches binding promises and missing prerequisites while allowing graceful synonym reframing.'}
                        {level === 'lenient' &&
                          'Prioritizes maximal creative rewriting; only flags direct factual inversions or contradictions.'}
                      </div>
                    </div>

                    <div
                      style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        border: `2px solid ${isSelected ? 'var(--color-chartreuse)' : 'var(--border-medium)'}`,
                        backgroundColor: isSelected ? 'var(--color-chartreuse)' : 'transparent'
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Default Persona Calibration */}
          <div
            style={{
              backgroundColor: 'var(--surface-card)',
              border: '1px solid var(--border-medium)',
              borderRadius: '2px',
              padding: '24px'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                paddingBottom: '12px',
                borderBottom: '1px solid var(--border-subtle)',
                marginBottom: '18px'
              }}
            >
              <Sliders size={16} color="var(--color-hot-pink)" />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 600 }}>
                DEFAULT PERSONA BOOT STRATEGY
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
              {PERSONAS.map((p) => {
                const isSelected = defaultPersona === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setDefaultPersona(p.id)}
                    style={{
                      padding: '12px',
                      backgroundColor: isSelected ? 'var(--color-jet-black)' : 'var(--surface-panel)',
                      border: `1px solid ${isSelected ? p.accentColor : 'var(--border-subtle)'}`,
                      color: isSelected ? p.accentColor : 'var(--color-white)',
                      borderRadius: '2px',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <div style={{ fontSize: '14px', fontWeight: 700 }}>{p.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-muted-grey)', fontFamily: 'var(--font-mono)' }}>
                      Formality: {p.attributes.formality}%
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4: AI Backend Credentials */}
          <div
            style={{
              backgroundColor: 'var(--surface-card)',
              border: '1px solid var(--border-medium)',
              borderRadius: '2px',
              padding: '24px'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                paddingBottom: '12px',
                borderBottom: '1px solid var(--border-subtle)',
                marginBottom: '18px'
              }}
            >
              <Cpu size={16} color="var(--color-chartreuse)" />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 600 }}>
                AI MODEL ORCHESTRATION // SERVER KEYS
              </span>
            </div>

            <ServerStatus />
          </div>

          {/* Section 5: Preferences */}
          <div
            style={{
              backgroundColor: 'var(--surface-card)',
              border: '1px solid var(--border-medium)',
              borderRadius: '2px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13.5px' }}>
              <input
                type="checkbox"
                checked={autoSave}
                onChange={(e) => setAutoSave(e.target.checked)}
                style={{ accentColor: 'var(--color-chartreuse)' }}
              />
              <span>Automatically archive transformed communications into Vault history</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13.5px' }}>
              <input
                type="checkbox"
                checked={preserveQuotes}
                onChange={(e) => setPreserveQuotes(e.target.checked)}
                style={{ accentColor: 'var(--color-hot-pink)' }}
              />
              <span>Strictly preserve quoted terms and verbatim technical definitions</span>
            </label>
          </div>

          {/* Save Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button type="submit" className="btn-primary" style={{ padding: '0.85rem 2rem' }}>
              {savedSuccess ? (
                <>
                  <Check size={16} />
                  <span>CALIBRATION SAVED!</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>SAVE PREFERENCES</span>
                </>
              )}
            </button>
            {savedSuccess && (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-chartreuse)' }}>
                Directives updated successfully.
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

// API keys live only on the server (.env.local); this shows whether they're set, never the keys.
function ServerStatus() {
  const [status, setStatus] = useState<{ gemini: boolean; groq: boolean; model: string } | null>(null);
  useEffect(() => {
    fetch('/api/status').then((r) => r.json()).then(setStatus).catch(() => setStatus(null));
  }, []);
  const row = (label: string, ok: boolean | undefined, detail: string) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
      <span style={{ color: 'var(--color-muted-grey)' }}>{label}</span>
      <span style={{ color: ok ? 'var(--color-chartreuse)' : 'var(--color-risk-red)' }}>{ok === undefined ? '...' : ok ? detail : 'NOT SET'}</span>
    </div>
  );
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {row('GEMINI_API_KEY', status?.gemini, `SET / ${status?.model ?? ''}`)}
      {row('GROQ_API_KEY (voice)', status?.groq, 'SET / WHISPER-LARGE-V3')}
      <div style={{ fontSize: '12px', color: 'var(--color-muted-grey)', lineHeight: 1.5 }}>
        Keys are read only on the server from .env.local and are never sent to the browser. Without a Gemini key, the
        sample drafts run in offline demo mode; without a Groq key, voice uses your browser&apos;s speech recognition.
      </div>
    </div>
  );
}
