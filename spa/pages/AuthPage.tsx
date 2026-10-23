import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mail,
  ArrowRight,
  Fingerprint,
  UserCheck
} from 'lucide-react';
import { Auth3DCanvas } from '../components/Auth3DCanvas';
import { useApp } from '../context/AppContext';

export function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('alex@intent-shift.ai');
  const [name, setName] = useState('Alex Vance');
  const { login } = useApp();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, isSignUp ? name : undefined);
    navigate('/dashboard');
  };

  const handleDemoLogin = () => {
    login('', 'Guest');
    navigate('/dashboard');
  };

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 76px)',
        backgroundColor: 'transparent',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(2rem, 5vw, 4rem) 20px',
        overflow: 'hidden'
      }}
    >
      {/* 3D Biometric Identity Visual in Background */}
      <Auth3DCanvas />

      {/* Main Authentication Card */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: '480px',
          backgroundColor: 'rgba(18, 18, 18, 0.92)',
          backdropFilter: 'blur(20px)',
          border: '1.5px solid var(--border-medium)',
          borderRadius: '2px',
          padding: 'clamp(2rem, 4vw, 3rem)',
          boxShadow: '0 0 50px rgba(255, 45, 168, 0.15)'
        }}
      >
        {/* Top Eyebrow */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--color-hot-pink)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: '12px'
          }}
        >
          <Fingerprint size={14} />
          <span>IDENTITY GATEWAY // CRYPTOGRAPHIC PARITY</span>
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-h2)',
            fontWeight: 700,
            color: 'var(--color-white)',
            letterSpacing: 'var(--tracking-tight)',
            lineHeight: 1.05,
            marginBottom: '8px'
          }}
        >
          {isSignUp ? 'CREATE LOCAL PROFILE' : 'YOUR PROFILE'}
        </h1>

        <p style={{ color: 'var(--color-muted-grey)', fontSize: '13.5px', lineHeight: 1.5, marginBottom: '24px' }}>
          {isSignUp
            ? 'Add a name so the dashboard can greet you. There are no accounts or passwords: your profile and Vault are stored only in this browser.'
            : 'Your profile and Vault live only in this browser. Nothing here is sent to a server, so there is no password.'}
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {isSignUp && (
            <div>
              <label
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: 'var(--color-muted-grey)',
                  marginBottom: '6px'
                }}
              >
                FULL LEGAL OR PROFESSIONAL NAME
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Elena Rostova"
                style={{
                  width: '100%',
                  backgroundColor: 'var(--color-jet-black)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: '2px',
                  padding: '12px 14px',
                  color: 'var(--color-white)',
                  fontSize: '14px',
                  fontFamily: 'var(--font-body)'
                }}
              />
            </div>
          )}

          <div>
            <label
              style={{
                display: 'block',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--color-muted-grey)',
                marginBottom: '6px'
              }}
            >
              COMMUNICATION EMAIL
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                style={{
                  width: '100%',
                  backgroundColor: 'var(--color-jet-black)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: '2px',
                  padding: '12px 14px 12px 38px',
                  color: 'var(--color-white)',
                  fontSize: '14px',
                  fontFamily: 'var(--font-body)'
                }}
              />
              <Mail
                size={16}
                color="var(--color-muted-grey)"
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '8px', width: '100%', padding: '0.9rem' }}>
            <span>SAVE PROFILE & ENTER</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Demo Fast Login */}
        <div style={{ margin: '20px 0', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
          <button
            onClick={handleDemoLogin}
            type="button"
            className="btn-secondary"
            style={{ width: '100%', padding: '0.75rem', fontSize: '13px' }}
          >
            <UserCheck size={16} />
            <span>CONTINUE AS GUEST</span>
          </button>
        </div>

        {/* Switch mode */}
        <div style={{ textAlign: 'center', fontSize: '13px', color: 'var(--color-muted-grey)' }}>
          {isSignUp ? 'Already set up a profile here?' : 'First time on this browser?'}{' '}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-chartreuse)',
              fontFamily: 'var(--font-mono)',
              fontSize: '12.5px',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            {isSignUp ? 'Sign in instead' : 'Create new credential'}
          </button>
        </div>
      </div>
    </div>
  );
}
