import OptionGroup from "./OptionGroup";
import { OUTPUT_LANGUAGES, TARGET_TONES, WRITING_STYLES } from "@/lib/options";
import { ArrowIcon } from "./icons";

export default function ControlsPanel({ settings, onChange, onTransform }) {
  const set = (key) => (value) => onChange({ ...settings, [key]: value });

  return (
    <section className="sheet flex flex-col gap-6 p-5 sm:p-6" aria-label="Rewrite settings">
      <h2 className="font-display text-lg font-medium italic leading-none">Editor&apos;s brief</h2>
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
      <div className="mt-auto border-t border-dashed border-rule-strong pt-5">
        <button
          type="button"
          onClick={onTransform}
          className="btn-ink flex w-full items-center justify-between px-4 py-3 text-[15px] font-medium"
        >
          <span>Transform</span>
          <span className="flex items-center gap-2">
            <kbd>Ctrl</kbd>
            <kbd>Enter</kbd>
            <ArrowIcon />
          </span>
        </button>
      </div>
    </section>
  );
}
