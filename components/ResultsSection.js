import { VIBES } from "@/lib/vibes";
import AudienceForm from "./AudienceForm";
import EmptyState from "./EmptyState";
import Notice from "./Notice";
import VibeCard from "./VibeCard";
import VibeSkeleton from "./VibeSkeleton";

function ChangesToggle({ on, disabled, onToggle }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      disabled={disabled}
      onClick={onToggle}
      className="group inline-flex items-center gap-2 text-sm text-ink-soft enabled:hover:text-ink disabled:opacity-40"
    >
      <span
        className={`relative h-5 w-9 rounded-full border transition-colors ${on ? "border-redpen bg-redpen-soft" : "border-rule-strong bg-paper-2"}`}
        aria-hidden="true"
      >
        <span
          className={`absolute left-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full transition-transform ${on ? "translate-x-[18px] bg-redpen" : "translate-x-[2px] bg-ink-faint"}`}
        />
      </span>
      Show changes
    </button>
  );
}

export default function ResultsSection({
  sectionRef, run, notice, onDismissNotice, showChanges, onToggleChanges, regenerating, onRegenerate, onNotice,
  meaningFor, addingAudience, onAddAudience, onRemoveAudience,
}) {
  const { status, result, source } = run;
  const loading = status === "loading";
  const hasCustom = result?.vibes.some((v) => v.id === "custom");

  return (
    <section ref={sectionRef} className="reveal mt-14 scroll-mt-6 pb-20" style={{ "--i": 3 }} aria-labelledby="results-heading">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-rule-strong pb-3">
        <h2 id="results-heading" className="font-display text-2xl font-medium tracking-tight">
          The redline
        </h2>
        <div className="flex items-center gap-4">
          {showChanges && result && !loading && (
            <p className="hidden text-[13px] text-ink-soft sm:block" aria-hidden="true">
              <ins className="ins-mark">added</ins> <del className="del-pen">removed</del>
            </p>
          )}
          <ChangesToggle on={showChanges} disabled={!result || loading} onToggle={onToggleChanges} />
        </div>
      </div>

      {notice && (
        <div className="mb-4">
          <Notice notice={notice} onDismiss={onDismissNotice} />
        </div>
      )}

      {loading ? (
        <div className="grid gap-5 md:grid-cols-2" aria-live="polite" aria-label="Rewriting your draft">
          {VIBES.map((v, i) => (
            <VibeSkeleton key={v.id} vibe={v} index={i} />
          ))}
        </div>
      ) : result ? (
        <>
          <div key={run.id} className="grid gap-5 md:grid-cols-2">
            {result.vibes.map((vibe, i) => (
              <VibeCard
                key={vibe.id}
                vibe={vibe}
                index={i}
                original={source.text}
                originalTone={result.original_tone}
                language={source.settings.language}
                meaning={meaningFor(vibe)}
                showChanges={showChanges}
                regenerating={!!regenerating[vibe.id]}
                canRegenerate={!loading}
                onRegenerate={onRegenerate}
                onRemove={vibe.id === "custom" ? onRemoveAudience : undefined}
                onNotice={onNotice}
              />
            ))}
            {addingAudience && (
              <VibeSkeleton vibe={{ name: addingAudience }} index={result.vibes.length} />
            )}
          </div>
          {!hasCustom && (
            <div className="mt-5">
              <AudienceForm busy={!!addingAudience} onAdd={onAddAudience} />
            </div>
          )}
        </>
      ) : (
        <EmptyState />
      )}
    </section>
  );
}
