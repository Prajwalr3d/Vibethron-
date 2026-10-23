const VIBES = [
  { name: "Executive C-Level", tilt: "-2.2deg" },
  { name: "Supportive Peer", tilt: "1.4deg" },
  { name: "Legal / Compliance", tilt: "-0.8deg" },
  { name: "Gen-Z Hype", tilt: "2deg" },
];

const STEPS = [
  ["Draft it", "Type, dictate, or drop a screenshot of the message."],
  ["Brief it", "Pick the output language, writing style and tone."],
  ["Read the redline", "Every change marked, every fact checked."],
];

// Ghost manuscript lines; widths vary so each sheet reads like real copy.
const LINES = [[92, 78, 85, 40], [88, 94, 60], [96, 82, 90, 70, 35], [80, 91, 55]];

function GhostSheet({ vibe, lines, index }) {
  return (
    <div className="reveal" style={{ "--i": index + 1 }}>
      <div
        className="sheet h-full px-4 pb-5 pt-4 transition-transform duration-300 hover:rotate-0"
        style={{ transform: `rotate(${vibe.tilt})` }}
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">
          Vibe {String(index + 1).padStart(2, "0")}
        </p>
        <p className="mt-1 font-display text-[15px] font-medium leading-tight">{vibe.name}</p>
        <div className="mt-4 space-y-2.5" aria-hidden="true">
          {lines.map((w, i) => (
            <div key={i} className="relative h-[7px]" style={{ width: `${w}%` }}>
              <div className="absolute inset-0 rounded-full bg-ink/[0.07]" />
              {index === 0 && i === 1 && <div className="absolute inset-y-[-2px] left-[30%] w-[40%] rounded-[2px] bg-marker" />}
              {index === 2 && i === 2 && <div className="absolute left-[10%] top-[3px] h-[1.5px] w-[45%] -rotate-3 bg-redpen" />}
            </div>
          ))}
        </div>
        {index === 1 && (
          <span className="mt-4 inline-block -rotate-6 rounded-[3px] border-2 border-stamp/50 px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-stamp/60">
            Verified
          </span>
        )}
      </div>
    </div>
  );
}

export default function EmptyState() {
  return (
    <div className="rounded-[8px] border border-dashed border-rule-strong px-4 py-10 sm:px-8 sm:py-12">
      <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
        {VIBES.map((vibe, i) => (
          <GhostSheet key={vibe.name} vibe={vibe} lines={LINES[i]} index={i} />
        ))}
      </div>
      <div className="reveal mx-auto mt-10 max-w-2xl text-center" style={{ "--i": 5 }}>
        <h3 className="font-display text-2xl font-medium tracking-tight sm:text-[28px]">
          Nothing on the desk yet.
        </h3>
        <p className="mt-2 text-[15px] text-ink-soft">
          Your four rewrites land here, each with its edits marked like a proof and its facts checked
          against your original.
        </p>
      </div>
      <ol className="reveal mx-auto mt-8 grid max-w-3xl gap-4 sm:grid-cols-3" style={{ "--i": 6 }}>
        {STEPS.map(([title, body], i) => (
          <li key={title} className="flex gap-3">
            <span className="hand text-3xl leading-none">{i + 1}</span>
            <span>
              <span className="block text-sm font-medium">{title}</span>
              <span className="block text-[13px] text-ink-soft">{body}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
