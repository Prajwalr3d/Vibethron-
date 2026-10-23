import { CloseIcon } from "./icons";

const TONES = {
  error: "border-redpen/40 text-redpen",
  info: "border-rule-strong text-ink",
};

export default function Toaster({ toasts, onDismiss }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4" aria-live="polite">
      {toasts.map((t) => (
        <div
          key={t.id}
          role={t.kind === "error" ? "alert" : "status"}
          className={`reveal pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-[6px] border bg-paper px-4 py-3 text-sm shadow-[var(--shadow-sheet)] ${TONES[t.kind]}`}
        >
          <p className="flex-1">{t.message}</p>
          <button type="button" onClick={() => onDismiss(t.id)} className="mt-0.5 opacity-60 hover:opacity-100" aria-label="Dismiss">
            <CloseIcon size={15} />
          </button>
        </div>
      ))}
    </div>
  );
}
