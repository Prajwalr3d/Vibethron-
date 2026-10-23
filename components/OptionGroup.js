// Radio group rendered as chips; native radios give arrow-key navigation for free.
export default function OptionGroup({ name, legend, options, value, onChange }) {
  return (
    <fieldset>
      <legend className="mb-2 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">
        {legend}
      </legend>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <label key={opt.id} className="cursor-pointer">
            <input
              type="radio"
              name={name}
              value={opt.id}
              checked={value === opt.id}
              onChange={() => onChange(opt.id)}
              className="sr-only"
            />
            <span className="chip inline-flex items-baseline gap-1 px-3 py-1 text-[13px]">
              {opt.label}
              {opt.hint && <span className="text-[11px] opacity-70">{opt.hint}</span>}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
