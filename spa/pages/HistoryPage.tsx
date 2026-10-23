import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Archive,
  Search,
  Copy,
  Check,
  Trash2,
  Download,
  ShieldCheck
} from 'lucide-react';
import { Vault3DCanvas } from '../components/Vault3DCanvas';
import { useApp, timeAgo } from '../context/AppContext';

export function HistoryPage() {
  const { history, deleteHistoryItem, clearHistory } = useApp();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredHistory = history.filter((item) => {
    const matchesFilter = selectedFilter === 'all' || item.persona === selectedFilter;
    const matchesSearch =
      item.originalText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.transformedText.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `intent_shift_vault_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
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
      {/* 3D Archival Slabs Canvas */}
      <Vault3DCanvas />

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
              color: 'var(--color-hot-pink)',
              letterSpacing: 'var(--tracking-eyebrow)',
              textTransform: 'uppercase',
              marginBottom: '10px'
            }}
          >
            <Archive size={14} />
            <span>COMMUNICATION VAULT // SECURE ARCHIVE</span>
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
            TRANSFORMATION <span style={{ color: 'var(--color-hot-pink)' }}>VAULT</span>
          </h1>

          <p style={{ color: 'var(--color-muted-grey)', fontSize: 'var(--text-body-md)', lineHeight: 1.6 }}>
            Browse, search, and replay all historical drafts and IntentLock-protected communications.
            Dimensional archival records are encrypted in local memory.
          </p>
        </div>

        {/* Search & Actions Bar */}
        <div
          style={{
            backgroundColor: 'var(--surface-card)',
            border: '1px solid var(--border-medium)',
            padding: '16px 20px',
            borderRadius: '2px',
            marginBottom: '28px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '14px',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          {/* Search box */}
          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search vault messages..."
              style={{
                width: '100%',
                backgroundColor: 'var(--color-jet-black)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '2px',
                padding: '10px 14px 10px 36px',
                color: 'var(--color-white)',
                fontFamily: 'var(--font-body)',
                fontSize: '14px'
              }}
            />
            <Search
              size={15}
              color="var(--color-muted-grey)"
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
            />
          </div>

          {/* Persona Filter Buttons */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {['all', 'executive', 'supportive', 'legal', 'genz'].map((f) => (
              <button
                key={f}
                onClick={() => setSelectedFilter(f)}
                style={{
                  backgroundColor: selectedFilter === f ? 'var(--color-hot-pink)' : 'var(--surface-panel)',
                  border: `1px solid ${selectedFilter === f ? 'var(--color-hot-pink)' : 'var(--border-subtle)'}`,
                  color: selectedFilter === f ? 'var(--color-jet-black)' : 'var(--color-muted-grey)',
                  padding: '6px 12px',
                  borderRadius: '2px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textTransform: 'uppercase'
                }}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Export & Clear Actions */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleExportJSON}
              style={{
                backgroundColor: 'var(--surface-elevated)',
                border: '1px solid var(--border-medium)',
                color: 'var(--color-white)',
                padding: '8px 12px',
                borderRadius: '2px',
                fontFamily: 'var(--font-mono)',
                fontSize: '11.5px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Download size={13} />
              <span>EXPORT JSON</span>
            </button>

            {history.length > 0 && (
              <button
                onClick={clearHistory}
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--color-muted-grey)',
                  padding: '8px 10px',
                  borderRadius: '2px',
                  cursor: 'pointer'
                }}
                title="Clear all vault records"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Stacked Dimensional History Cards List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredHistory.length === 0 ? (
            <div
              style={{
                backgroundColor: 'var(--surface-card)',
                border: '1px dashed var(--border-medium)',
                padding: '40px 20px',
                textAlign: 'center',
                borderRadius: '2px',
                color: 'var(--color-muted-grey)'
              }}
            >
              <Archive size={32} style={{ margin: '0 auto 12px auto', opacity: 0.4 }} />
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', marginBottom: '8px' }}>
                NO VAULT ENTRIES MATCH THE SPECIFIED FILTER
              </div>
              <button
                onClick={() => navigate('/transformer')}
                className="btn-primary"
                style={{ marginTop: '12px', padding: '0.6rem 1.4rem', fontSize: '13px' }}
              >
                <span>OPEN STUDIO & TRANSMUTE FIRST DRAFT</span>
              </button>
            </div>
          ) : (
            filteredHistory.map((item) => (
              <div
                key={item.id}
                className="brutalist-card"
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  borderLeft:
                    item.persona === 'executive'
                      ? '3px solid var(--color-hot-pink)'
                      : item.persona === 'supportive'
                      ? '3px solid var(--color-chartreuse)'
                      : item.persona === 'legal'
                      ? '3px solid var(--color-white)'
                      : '3px solid var(--color-chartreuse)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        padding: '3px 8px',
                        backgroundColor: 'rgba(255, 45, 168, 0.1)',
                        border: '1px solid rgba(255, 45, 168, 0.3)',
                        color: 'var(--color-hot-pink)',
                        borderRadius: '2px',
                        textTransform: 'uppercase'
                      }}
                    >
                      {item.persona}
                    </span>

                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '10.5px',
                        color: 'var(--color-chartreuse)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <ShieldCheck size={13} />
                      <span>INTENTLOCK SECURED</span>
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-muted-grey)' }}>
                      {timeAgo(item.timestamp)}
                    </span>

                    <button
                      onClick={() => handleCopy(item.id, item.transformedText)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: copiedId === item.id ? 'var(--color-chartreuse)' : 'var(--color-muted-grey)',
                        cursor: 'pointer',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px'
                      }}
                    >
                      {copiedId === item.id ? <Check size={13} /> : <Copy size={13} />}
                      <span>{copiedId === item.id ? 'COPIED' : 'COPY'}</span>
                    </button>

                    <button
                      onClick={() => deleteHistoryItem(item.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--color-muted-grey)',
                        cursor: 'pointer',
                        padding: '4px'
                      }}
                      title="Delete entry"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '16px'
                  }}
                >
                  {/* Original */}
                  <div
                    style={{
                      backgroundColor: 'var(--color-jet-black)',
                      padding: '14px',
                      borderRadius: '2px',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', color: 'var(--color-muted-grey)', marginBottom: '6px' }}>
                      ORIGINAL DRAFT:
                    </div>
                    <div style={{ fontSize: '14px', color: 'var(--color-muted-grey)', lineHeight: 1.5 }}>
                      "{item.originalText}"
                    </div>
                  </div>

                  {/* Transformed */}
                  <div
                    style={{
                      backgroundColor: 'var(--surface-panel)',
                      padding: '14px',
                      borderRadius: '2px',
                      border: '1px solid var(--border-medium)'
                    }}
                  >
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', color: 'var(--color-chartreuse)', marginBottom: '6px' }}>
                      TRANSFORMED REVISION:
                    </div>
                    <div style={{ fontSize: '15px', color: 'var(--color-white)', lineHeight: 1.5, fontWeight: 500 }}>
                      "{item.transformedText}"
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
