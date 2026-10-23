// Proofreader's caret, inked in red pen, over a paper square.
export default function Logo({ size = 34 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <rect x="2.5" y="2.5" width="35" height="35" rx="6" fill="var(--paper)" stroke="var(--rule-strong)" />
      <path d="M9 13.5 20 29l11-15.5" fill="none" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12.5 9.5c5.5-2.6 11.5-2.4 16 .6" fill="none" stroke="var(--redpen)" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}
