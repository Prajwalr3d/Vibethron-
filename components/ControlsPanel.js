import OptionGroup from "./OptionGroup";
import { OUTPUT_LANGUAGES, TARGET_TONES, WRITING_STYLES } from "@/lib/options";
import { ArrowIcon } from "./icons";
import MeaningStatus from "./MeaningStatus";
import OfflineBadge from "./OfflineBadge";

const DEFAULT_TUNE = { formality: 70, directness: 70 };

function Slider({ label, value, onChange, accent }) {
  return (
    <label className="flex items-center justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-soft">
      <span>
        {label}: <span className="tabular-nums text-ink">{value}%</span>
      </span>
      <input
        type="range"
        min={0}
        max={100}
        step={5}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-28"
        style={{ accentColor: accent }}
      />
    </label>
  );
}

export default function ControlsPanel({ settings, onChange, onTransform, busy, meaningModels, offline }) {
  const set = (key) => (value) => onChange({ ...settings, [key]: value });
  const tune = settings.tune;

  return (
    <section className="sheet flex flex-col gap-6 p-5 sm:p-6" aria-label="Rewrite settings">
      <h2 className="panel-title">Transformation brief</h2>
      <OptionGroup
        name="language"
        legend="Output language"
        options={OUTPUT_LANGUAGES}
        value={settings.language}
        onChange={set("language")}
      />
      <OptionGroup
        name="style"
        legend="Writing style"
        options={WRITING_STYLES}
        value={settings.style}
        onChange={set("style")}
      />
      <OptionGroup
        name="tone"
        legend="Target tone"
        options={TARGET_TONES}
        value={settings.tone}
        onChange={set("tone")}
      />

      <fieldset className="rounded-[2px] border border-rule bg-desk px-3.5 py-3">
        <legend className="sr-only">Fine-tune</legend>
        <label className="flex cursor-pointer items-center justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">
          <span>Fine-tune calibration</span>
          <input
            type="checkbox"
            checked={!!tune}
            onChange={(e) => onChange({ ...settings, tune: e.target.checked ? DEFAULT_TUNE : null })}
            style={{ accentColor: "var(--accent)" }}
          />
        </label>
        {tune ? (
          <div className="mt-3 flex flex-col gap-2.5">
            <Slider label="Formality" value={tune.formality} accent="var(--accent)" onChange={(v) => set("tune")({ ...tune, formality: v })} />
            <Slider label="Directness" value={tune.directness} accent="var(--stamp)" onChange={(v) => set("tune")({ ...tune, directness: v })} />
          </div>
        ) : (
          <p className="mt-1.5 text-[12px] text-ink-faint">Off: each persona sets its own formality and directness.</p>
        )}
      </fieldset>

      <div className="mt-auto border-t border-dashed border-rule-strong pt-5">
        <button
          type="button"
          onClick={onTransform}
          disabled={busy}
          className="btn-ink flex w-full items-center justify-between px-4 py-3 text-[14px]"
        >
          <span>{busy ? "Transforming..." : "Execute transformation"}</span>
          <span className="flex items-center gap-2">
            <kbd>Ctrl</kbd>
            <kbd>Enter</kbd>
            <ArrowIcon />
          </span>
        </button>
        <div className="mt-3 flex flex-col items-start gap-2">
          <MeaningStatus models={meaningModels} />
          {offline && <OfflineBadge />}
        </div>
      </div>
    </section>
  );
}
