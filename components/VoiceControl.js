import { MAX_RECORD_SECONDS } from "@/lib/useVoiceInput";
import { VOICE_LANGUAGES } from "@/lib/options";
import { MicIcon, StopIcon } from "./icons";

const clock = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

const ENGINE_NOTE = {
  whisper: "Records up to 60s, transcribed by Whisper on the server",
  browser: "Uses your browser's speech recognition (Auto listens as English)",
  none: "Voice input isn't supported in this browser",
  checking: "Checking voice support",
};

export default function VoiceControl({ voice, hint, onHintChange }) {
  const { engine, status, elapsed, start, stop } = voice;

  if (status === "recording") {
    return (
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-2 rounded-[5px] border border-redpen/40 bg-redpen-soft px-2.5 py-1.5 font-mono text-[12px] tabular-nums text-redpen">
          <span className="rec-dot h-2.5 w-2.5 rounded-full bg-redpen" aria-hidden="true" />
          <span aria-live="polite">
            {clock(elapsed)} / {clock(MAX_RECORD_SECONDS)}
          </span>
        </span>
        <button type="button" onClick={stop} className="btn-paper inline-flex items-center gap-1.5 px-3 py-1.5 text-sm">
          <StopIcon size={16} /> Stop
        </button>
      </div>
    );
  }

  if (status === "transcribing") {
    return (
      <span className="flex items-center gap-2 px-1 py-1.5 font-mono text-[12px] text-ink-soft" role="status">
        <span className="rec-dot h-2 w-2 rounded-full bg-pencil" aria-hidden="true" />
        transcribing...
      </span>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={() => start(hint)}
        disabled={engine === "checking" || engine === "none"}
        title={ENGINE_NOTE[engine]}
        className="btn-paper inline-flex items-center gap-1.5 px-3 py-1.5 text-sm"
      >
        <MicIcon size={16} /> Dictate
      </button>
      <label className="sr-only" htmlFor="voice-lang">Spoken language</label>
      <select
        id="voice-lang"
        value={hint}
        onChange={(e) => onHintChange(e.target.value)}
        className="btn-paper cursor-pointer px-2 py-1.5 text-sm"
        title="Spoken language"
      >
        {VOICE_LANGUAGES.map((l) => (
          <option key={l.id} value={l.id}>
            {l.label}
          </option>
        ))}
      </select>
    </div>
  );
}
