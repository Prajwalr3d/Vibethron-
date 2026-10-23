"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { changeStats, wordDiff } from "@/lib/changeStats";
import { checkFacts } from "@/lib/factguard";
import { speak, stopSpeaking } from "@/lib/speech";
import DiffText from "./DiffText";
import FactText from "./FactText";
import CardStats from "./CardStats";
import FactStamp from "./FactStamp";
import MeaningBadge from "./MeaningBadge";
import IntentBadge from "./IntentBadge";
import ToneMeters from "./ToneMeters";
import DriftView from "./DriftView";
import { CheckIcon, CloseIcon, CopyIcon, RefreshIcon, SpeakerIcon, StopIcon } from "./icons";

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for browsers that block the async clipboard API.
    const area = document.createElement("textarea");
    area.value = text;
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    area.remove();
    return ok;
  }
}

export default function VibeCard({ vibe, index, original, originalTone, language, meaning, showChanges, regenerating, canRegenerate, onRegenerate, onRemove, onNotice }) {
  const [copied, setCopied] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const speakingRef = useRef(false);

  const parts = useMemo(() => wordDiff(original, vibe.text), [original, vibe.text]);
  const stats = useMemo(() => changeStats(original, vibe.text, parts), [original, vibe.text, parts]);
  const facts = useMemo(() => checkFacts(original, vibe.text), [original, vibe.text]);

  useEffect(() => {
    speakingRef.current = speaking;
  }, [speaking]);
  useEffect(() => () => speakingRef.current && stopSpeaking(), []);

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(id);
  }, [copied]);

  const onCopy = async () => {
    if (await copyText(vibe.text)) setCopied(true);
    else onNotice("Couldn't copy automatically. Select the text and copy it instead.");
  };

  const onSpeak = async () => {
    if (speaking) {
      stopSpeaking();
      setSpeaking(false);
      return;
    }
    const error = await speak(vibe.text, language, { onEnd: () => setSpeaking(false) });
    if (error) onNotice(error);
    else setSpeaking(true);
  };

  return (
    <article className="sheet reveal flex min-w-0 flex-col" style={{ "--i": index }}>
      <header className="flex items-start justify-between gap-3 px-5 pt-5 sm:px-6">
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">
            Vibe {String(index + 1).padStart(2, "0")}
          </p>
          <h3 className="mt-1 font-display text-lg font-medium leading-tight">{vibe.name}</h3>
        </div>
        <div className="flex shrink-0 gap-1.5">
          <button
            type="button"
            onClick={() => onRegenerate(vibe.id)}
            disabled={!canRegenerate || regenerating}
            className="btn-paper inline-flex h-8 items-center gap-1.5 px-2.5 text-[13px]"
            aria-label={`Regenerate ${vibe.name}`}
            title="Write a fresh version of this vibe"
          >
            <RefreshIcon size={15} className={regenerating ? "animate-spin" : undefined} />
            <span className="hidden sm:inline">{regenerating ? "Rewriting" : "Regenerate"}</span>
          </button>
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="btn-paper inline-flex h-8 w-8 items-center justify-center"
              aria-label={`Remove ${vibe.name}`}
              title="Remove this audience"
            >
              <CloseIcon size={15} />
            </button>
          )}
        </div>
      </header>

      <div className={`flex flex-1 flex-col gap-4 px-5 py-4 sm:px-6 ${regenerating ? "opacity-40" : ""}`} aria-busy={regenerating}>
        <div className="flex flex-wrap items-start gap-x-3 gap-y-2.5">
          <FactStamp check={facts} index={index} />
          <div className="flex flex-wrap items-center gap-2">
            <MeaningBadge meaning={meaning} aiScore={vibe.meaning_score} />
            <IntentBadge preserved={vibe.intent_preserved} note={vibe.intent_note} />
          </div>
        </div>

        <p className="whitespace-pre-wrap break-words text-[15px] leading-7" lang={language === "hi" ? "hi" : undefined}>
          {showChanges ? <DiffText parts={parts} /> : <FactText text={vibe.text} marks={facts.marks} />}
        </p>

        {vibe.reaction && (
          <p className="font-display text-[15px] italic text-ink-soft">
            <span className="not-italic font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-faint">Likely reaction </span>
            {vibe.reaction}
          </p>
        )}

        {vibe.risks.length > 0 && (
          <ul className="flex flex-wrap gap-1.5" aria-label="Risks">
            {vibe.risks.map((r) => (
              <li key={r} className="rounded-[4px] border border-amber/40 bg-amber-soft px-2 py-0.5 text-[12.5px] text-amber">
                {r}
              </li>
            ))}
          </ul>
        )}

        <ToneMeters tone={vibe.tone} original={originalTone} index={index} />

        {meaning.state === "local" && meaning.sentences.length > 0 && <DriftView sentences={meaning.sentences} />}
      </div>

      <div className="border-t border-dashed border-rule-strong px-5 py-3 sm:px-6">
        <CardStats stats={stats} />
      </div>

      <footer className="flex flex-wrap gap-2 border-t border-rule px-5 py-3 sm:px-6">
        <button type="button" onClick={onCopy} className="btn-paper inline-flex items-center gap-1.5 px-3 py-1.5 text-[13px]">
          {copied ? <CheckIcon size={15} className="text-stamp" /> : <CopyIcon size={15} />}
          <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
        </button>
        <button
          type="button"
          onClick={onSpeak}
          className="btn-paper inline-flex items-center gap-1.5 px-3 py-1.5 text-[13px]"
          aria-pressed={speaking}
        >
          {speaking ? <StopIcon size={15} /> : <SpeakerIcon size={15} />}
          {speaking ? "Stop" : "Read aloud"}
        </button>
      </footer>
    </article>
  );
}
