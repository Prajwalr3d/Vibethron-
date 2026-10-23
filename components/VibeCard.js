"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { changeStats, wordDiff } from "@/lib/changeStats";
import { speak, stopSpeaking } from "@/lib/speech";
import DiffText from "./DiffText";
import CardStats from "./CardStats";
import { CheckIcon, CopyIcon, RefreshIcon, SpeakerIcon, StopIcon } from "./icons";

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

export default function VibeCard({ vibe, index, original, language, showChanges, regenerating, canRegenerate, onRegenerate, onNotice }) {
  const [copied, setCopied] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const speakingRef = useRef(false);

  const parts = useMemo(() => wordDiff(original, vibe.text), [original, vibe.text]);
  const stats = useMemo(() => changeStats(original, vibe.text, parts), [original, vibe.text, parts]);

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
        <button
          type="button"
          onClick={() => onRegenerate(vibe.id)}
          disabled={!canRegenerate || regenerating}
          className="btn-paper inline-flex h-8 shrink-0 items-center gap-1.5 px-2.5 text-[13px]"
          aria-label={`Regenerate ${vibe.name}`}
          title="Write a fresh version of this vibe"
        >
          <RefreshIcon size={15} className={regenerating ? "animate-spin" : undefined} />
          <span className="hidden sm:inline">{regenerating ? "Rewriting" : "Regenerate"}</span>
        </button>
      </header>

      <div className={`relative flex-1 px-5 py-4 sm:px-6 ${regenerating ? "opacity-40" : ""}`} aria-busy={regenerating}>
        <p className="whitespace-pre-wrap break-words text-[15px] leading-7" lang={language === "hi" ? "hi" : undefined}>
          {showChanges ? <DiffText parts={parts} /> : vibe.text}
        </p>
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
