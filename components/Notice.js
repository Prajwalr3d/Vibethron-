import { CloseIcon } from "./icons";

const TONES = {
  error: "border-redpen/40 bg-redpen-soft text-redpen",
  info: "border-amber/40 bg-amber-soft text-amber",
};

export default function Notice({ notice, onDismiss }) {
  if (!notice) return null;
  return (
    <div
      role={notice.kind === "error" ? "alert" : "status"}
      className={`reveal flex items-start justify-between gap-3 rounded-[5px] border px-3.5 py-2.5 text-sm ${TONES[notice.kind]}`}
    >
      <p>{notice.message}</p>
      <button
        type="button"
        onClick={onDismiss}
        className="mt-0.5 shrink-0 opacity-70 hover:opacity-100"
        aria-label="Dismiss message"
      >
        <CloseIcon size={16} />
      </button>
    </div>
  );
}
