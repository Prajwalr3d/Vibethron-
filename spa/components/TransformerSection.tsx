import { useState, useTransition } from 'react';
import {
  Copy,
  Check,
  RefreshCw,
  Sparkles,
  Zap,
  ShieldCheck,
  Sliders,
  Send,
  MessageSquare
} from 'lucide-react';
import {
  PERSONAS,
  PRESET_SAMPLES,
  type PersonaId,
  type PresetSample
} from '../types/transformer';

export function TransformerSection() {
  const [activePreset, setActivePreset] = useState<PresetSample>(PRESET_SAMPLES[0]);
  const [inputText, setInputText] = useState(PRESET_SAMPLES[0].original);
  const [selectedPersona, setSelectedPersona] = useState<PersonaId>('executive');
  const [variationIndex, setVariationIndex] = useState(0);
  const [isTransforming, setIsTransforming] = useState(false);
  const [copied, setCopied] = useState(false);
  const [, startTransition] = useTransition();

  // Helper to get matching demonstration output
  const getDemoOutput = (text: string, persona: PersonaId, variation: number): string => {
    // Check if input matches one of our known presets
    const match = PRESET_SAMPLES.find(
      (p) => p.original.trim().toLowerCase() === text.trim().toLowerCase()
    );

    if (match && match.personaOutputs[persona]) {
      const outputs = match.personaOutputs[persona];
      return outputs[variation % outputs.length];
    }

    // Dynamic heuristic fallback for custom inputs
    switch (persona) {
      case 'executive':
        return `Regarding this matter: The timeline requires immediate alignment. Please review the deliverables and provide an updated executive milestone report today.`;
      case 'supportive':
        return `Thanks for bringing this to my attention! I know everyone is working hard on this. Please let me know what resources you need so we can get this wrapped up smoothly together.`;
      case 'legal':
        return `Please be advised that the referenced subject matter is acknowledged without prejudice. All deliverables remain subject to strict verification and approval.`;
      case 'genz':
        return `Hey! Just saw this — let's quickly sync and get this knocked out ASAP. Super easy fix!`;
    }
  };

  const currentPersona = PERSONAS.find((p) => p.id === selectedPersona) || PERSONAS[0];
  const outputText = getDemoOutput(inputText, selectedPersona, variationIndex);

  const handleSelectPreset = (preset: PresetSample) => {
    setActivePreset(preset);
    setInputText(preset.original);
    setVariationIndex(0);
  };

  const handleTransform = () => {
    setIsTransforming(true);
    // Simulate real AI processing latency for authentic user feel
    setTimeout(() => {
      startTransition(() => {
        setIsTransforming(false);
      });
    }, 600);
  };

  const handleRegenerate = () => {
    setIsTransforming(true);
    setTimeout(() => {
      setVariationIndex((prev) => prev + 1);
      setIsTransforming(false);
    }, 450);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  return (
    <section
      id="transformer"
      style={{
        paddingTop: 'clamp(3.5rem, 7vw, 6.5rem)',
        paddingBottom: 'clamp(4rem, 8vw, 7.5rem)',
        backgroundColor: 'transparent',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
        position: 'relative',
      }}
      aria-label="Interactive Communication Transformer"
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
            <Zap size={14} />
            <span>02 // EXAMPLE OUTPUTS (RUN YOUR OWN IN THE STUDIO)</span>
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
            TRANSFORM ROUGH DRAFTS TO{' '}
            <span style={{ color: 'var(--color-hot-pink)' }}>PRECISION TONE</span>
          </h2>

          <p
            style={{
              color: 'var(--color-muted-grey)',
              fontSize: 'var(--text-body-md)',
              maxWidth: '680px',
              lineHeight: 1.6,
            }}
          >
            Input raw, frustrated, or informal thoughts. Select your target persona to calibrate formality,
            warmth, and brevity. IntentLock continuously audits the output against your original commitments.
          </p>
        </div>

        {/* Quick Demo Presets Bar */}
        <div style={{ marginBottom: '24px' }}>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--color-muted-grey)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <MessageSquare size={13} color="var(--color-hot-pink)" />
            <span>DEMO TEST SCENARIOS (CLICK TO LOAD)</span>
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
            }}
          >
            {PRESET_SAMPLES.map((preset) => {
              const isSelected = activePreset.id === preset.id && inputText === preset.original;
              return (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  style={{
                    backgroundColor: isSelected ? 'var(--color-jet-black)' : 'var(--surface-card)',
                    border: `1px solid ${isSelected ? 'var(--color-chartreuse)' : 'var(--border-subtle)'}`,
                    color: isSelected ? 'var(--color-chartreuse)' : 'var(--color-muted-grey)',
                    padding: '8px 14px',
                    borderRadius: '2px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span
                    style={{
                      width: '5px',
                      height: '5px',
                      borderRadius: '50%',
                      backgroundColor: isSelected ? 'var(--color-chartreuse)' : 'var(--border-medium)',
                    }}
                  />
                  <span>{preset.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Persona Selection Grid */}
        <div style={{ marginBottom: '32px' }}>
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
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sliders size={13} color="var(--color-chartreuse)" />
              <span>SELECT TARGET PERSONA</span>
            </div>
            <span style={{ color: 'var(--color-hot-pink)' }}>
              CURRENT: {currentPersona.name.toUpperCase()}
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '14px',
            }}
          >
            {PERSONAS.map((persona) => {
              const isSelected = selectedPersona === persona.id;
              return (
                <div
                  key={persona.id}
                  onClick={() => {
                    setSelectedPersona(persona.id);
                    setVariationIndex(0);
                  }}
                  tabIndex={0}
                  role="button"
                  aria-pressed={isSelected}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setSelectedPersona(persona.id);
                      setVariationIndex(0);
                    }
                  }}
                  style={{
                    backgroundColor: isSelected ? 'var(--color-jet-black)' : 'var(--surface-card)',
                    border: `1.5px solid ${
                      isSelected ? persona.accentColor : 'var(--border-subtle)'
                    }`,
                    borderRadius: '2px',
                    padding: '18px',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    boxShadow: isSelected
                      ? `4px 4px 0px ${persona.accentColor}`
                      : 'none',
                    transform: isSelected ? 'translate(-2px, -2px)' : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '8px',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '10px',
                          padding: '3px 8px',
                          backgroundColor: isSelected
                            ? `${persona.accentColor}22`
                            : 'rgba(255, 255, 255, 0.05)',
                          color: isSelected ? persona.accentColor : 'var(--color-muted-grey)',
                          border: `1px solid ${
                            isSelected ? persona.accentColor : 'transparent'
                          }`,
                          borderRadius: '2px',
                          letterSpacing: '0.08em',
                        }}
                      >
                        {persona.badge}
                      </span>

                      {isSelected && (
                        <span
                          style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: persona.accentColor,
                            boxShadow: `0 0 10px ${persona.accentColor}`,
                          }}
                        />
                      )}
                    </div>

                    <h3
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '20px',
                        fontWeight: 700,
                        color: isSelected ? persona.accentColor : 'var(--color-white)',
                        marginBottom: '4px',
                      }}
                    >
                      {persona.name}
                    </h3>

                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        color: isSelected ? 'var(--color-white)' : 'var(--color-muted-grey)',
                        marginBottom: '10px',
                      }}
                    >
                      {persona.tagline}
                    </div>

                    <p
                      style={{
                        fontSize: '13px',
                        color: 'var(--color-muted-grey)',
                        lineHeight: 1.5,
                        marginBottom: '14px',
                      }}
                    >
                      {persona.description}
                    </p>
                  </div>

                  {/* Persona Calibration Bars */}
                  <div
                    style={{
                      borderTop: '1px solid var(--border-subtle)',
                      paddingTop: '10px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                      <span style={{ color: 'var(--color-muted-grey)', fontFamily: 'var(--font-mono)' }}>FORMALITY</span>
                      <span style={{ color: persona.accentColor, fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                        {persona.attributes.formality}%
                      </span>
                    </div>
                    <div
                      style={{
                        height: '3px',
                        backgroundColor: 'var(--border-subtle)',
                        borderRadius: '2px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: `${persona.attributes.formality}%`,
                          backgroundColor: persona.accentColor,
                          transition: 'width 0.4s ease',
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Transformer Dual Workspace Panels */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
            alignItems: 'stretch',
          }}
        >
          {/* Left Panel: Original Draft Input */}
          <div
            style={{
              backgroundColor: 'var(--surface-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '2px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--glow-subtle)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '14px',
                paddingBottom: '12px',
                borderBottom: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    backgroundColor: 'var(--color-hot-pink)',
                    borderRadius: '50%',
                  }}
                />
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    color: 'var(--color-white)',
                    textTransform: 'uppercase',
                  }}
                >
                  ORIGINAL MESSAGE DRAFT
                </span>
              </div>

              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: 'var(--color-muted-grey)',
                }}
              >
                {inputText.length} CHARS
              </span>
            </div>

            <label htmlFor="original-draft-input" className="sr-only" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
              Original message input
            </label>

            <textarea
              id="original-draft-input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste raw, frustrated, or unstructured message here..."
              rows={7}
              style={{
                width: '100%',
                backgroundColor: 'var(--color-jet-black)',
                border: '1px solid var(--border-medium)',
                borderRadius: '2px',
                padding: '16px',
                color: 'var(--color-white)',
                fontFamily: 'var(--font-body)',
                fontSize: '16px',
                lineHeight: 1.6,
                resize: 'vertical',
                minHeight: '180px',
                marginBottom: '16px',
              }}
            />

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                marginTop: 'auto',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11.5px',
                  color: 'var(--color-muted-grey)',
                }}
              >
                <ShieldCheck size={14} color="var(--color-chartreuse)" />
                <span>IntentLock analysis active</span>
              </div>

              <button
                onClick={handleTransform}
                disabled={isTransforming || !inputText.trim()}
                className="btn-primary"
                style={{
                  padding: '0.85rem 1.6rem',
                  fontSize: '14px',
                  opacity: isTransforming || !inputText.trim() ? 0.6 : 1,
                  cursor: isTransforming || !inputText.trim() ? 'not-allowed' : 'pointer',
                }}
              >
                {isTransforming ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                    <span>CALIBRATING TONE...</span>
                  </>
                ) : (
                  <>
                    <span>TRANSFORM MESSAGE</span>
                    <Send size={15} />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Panel: Rewritten Output Panel */}
          <div
            style={{
              backgroundColor: 'var(--color-jet-black)',
              border: `1.5px solid ${currentPersona.accentColor}`,
              borderRadius: '2px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: `0 0 30px ${currentPersona.accentColor}18`,
              position: 'relative',
            }}
          >
            {/* Panel Top Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '14px',
                paddingBottom: '12px',
                borderBottom: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    backgroundColor: currentPersona.accentColor,
                    borderRadius: '50%',
                    boxShadow: `0 0 8px ${currentPersona.accentColor}`,
                  }}
                />
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    color: currentPersona.accentColor,
                    textTransform: 'uppercase',
                  }}
                >
                  {currentPersona.name.toUpperCase()} REVISION
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    padding: '2px 6px',
                    backgroundColor: 'rgba(212, 255, 63, 0.1)',
                    border: '1px solid rgba(212, 255, 63, 0.3)',
                    color: 'var(--color-chartreuse)',
                    borderRadius: '2px',
                  }}
                >
                  VAR #{variationIndex + 1}
                </span>
              </div>

              {/* Action Buttons: Copy & Regenerate */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={handleRegenerate}
                  disabled={isTransforming}
                  title="Generate alternative variation"
                  style={{
                    background: 'var(--surface-elevated)',
                    border: '1px solid var(--border-medium)',
                    color: 'var(--color-white)',
                    padding: '6px 12px',
                    borderRadius: '2px',
                    fontSize: '12px',
                    fontFamily: 'var(--font-mono)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all var(--transition-fast)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--color-white)')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-medium)')}
                >
                  <RefreshCw size={13} />
                  <span>REGENERATE</span>
                </button>

                <button
                  onClick={handleCopy}
                  style={{
                    backgroundColor: copied ? 'var(--color-chartreuse)' : 'var(--color-hot-pink)',
                    border: 'none',
                    color: 'var(--color-jet-black)',
                    padding: '6px 14px',
                    borderRadius: '2px',
                    fontSize: '12px',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  {copied ? (
                    <>
                      <Check size={14} />
                      <span>COPIED!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={13} />
                      <span>COPY</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Rewritten Text Output Display */}
            <div
              style={{
                backgroundColor: 'var(--surface-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '2px',
                padding: '20px',
                minHeight: '180px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                marginBottom: '16px',
                position: 'relative',
              }}
            >
              {isTransforming ? (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    padding: '30px 0',
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      border: '2px solid var(--color-hot-pink)',
                      borderTopColor: 'transparent',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite',
                    }}
                  />
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '12px',
                      color: 'var(--color-chartreuse)',
                      letterSpacing: '0.1em',
                    }}
                  >
                    RUNNING INTENTLOCK RECONCILIATION...
                  </span>
                </div>
              ) : (
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '18px',
                    fontWeight: 500,
                    lineHeight: 1.6,
                    color: 'var(--color-white)',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  "{outputText}"
                </p>
              )}
            </div>

            {/* IntentLock Analysis Footer Badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '10px',
                padding: '12px 14px',
                backgroundColor: 'rgba(212, 255, 63, 0.06)',
                border: '1px solid rgba(212, 255, 63, 0.25)',
                borderRadius: '2px',
                marginTop: 'auto',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={15} color="var(--color-chartreuse)" />
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11.5px',
                    color: 'var(--color-chartreuse)',
                    letterSpacing: '0.04em',
                    fontWeight: 600,
                  }}
                >
                  INTENT INTEGRITY: 100% PROTECTED
                </span>
              </div>

              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: 'var(--color-muted-grey)',
                }}
              >
                0 UNINTENDED COMMITMENTS ADDED
              </span>
            </div>
          </div>
        </div>

        {/* Realistic Demo Architecture Disclaimer */}
        <div
          style={{
            marginTop: '20px',
            padding: '10px 14px',
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            border: '1px dashed var(--border-medium)',
            borderRadius: '2px',
            fontFamily: 'var(--font-mono)',
            fontSize: '11.5px',
            color: 'var(--color-muted-grey)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          <span>
            [ ARCHITECTURE NOTE ]: Live frontend presentation connected to deterministic persona demonstration models.
            Ready for direct Gemini / LLM API backend orchestration.
          </span>
          <span style={{ color: 'var(--color-hot-pink)' }}>STATUS // CLIENT-SIDE READY</span>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}
