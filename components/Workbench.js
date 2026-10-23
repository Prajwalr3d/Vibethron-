"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { appendText } from "@/lib/textStats";
import { useVoiceInput } from "@/lib/useVoiceInput";
import { useOcr } from "@/lib/useOcr";
import DraftPanel from "./DraftPanel";
import ControlsPanel from "./ControlsPanel";
import Notice from "./Notice";
import EmptyState from "./EmptyState";

const INFO_TIMEOUT_MS = 7000;

export default function Workbench() {
  const [text, setText] = useState("");
  const [settings, setSettings] = useState({ language: "en", style: "professional", tone: "auto" });
  const [voiceHint, setVoiceHint] = useState("auto");
  const [notice, setNotice] = useState(null);
  const textareaRef = useRef(null);

  const showError = useCallback((message) => setNotice({ kind: "error", message }), []);
  const showInfo = useCallback((message) => setNotice({ kind: "info", message }), []);

  const addText = (addition) => {
    const result = appendText(text, addition);
    setText(result.text);
    if (result.clipped) showInfo("Added text was trimmed to fit the 3,000 character limit.");
  };

  const voice = useVoiceInput({ onText: addText, onError: showError, onInfo: showInfo });
  const { ocr, readImage } = useOcr({ onText: addText, onError: showError, onInfo: showInfo });

  const transform = () => {
    if (!text.trim()) {
      showError("Write, paste, dictate or upload a draft first.");
      textareaRef.current?.focus();
      return;
    }
    // Phase 2 connects this to /api/transform.
    showInfo("Draft and brief are ready. Transform is connected in the next build phase.");
  };

  // Ctrl/Cmd + Enter from anywhere on the page.
  const transformRef = useRef(transform);
  useEffect(() => {
    transformRef.current = transform;
  });
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        transformRef.current();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Info messages fade on their own; errors stay until dismissed.
  useEffect(() => {
    if (notice?.kind !== "info") return;
    const id = setTimeout(() => setNotice(null), INFO_TIMEOUT_MS);
    return () => clearTimeout(id);
  }, [notice]);

  return (
    <>
      <div className="reveal grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]" style={{ "--i": 2 }}>
        <div className="flex min-w-0 flex-col gap-3">
          <DraftPanel
            text={text}
            onTextChange={setText}
            textareaRef={textareaRef}
            voice={voice}
            voiceHint={voiceHint}
            onVoiceHintChange={setVoiceHint}
            ocr={ocr}
            onImage={readImage}
            onSample={(sample) => {
              setText(sample);
              setNotice(null);
            }}
          />
          <Notice notice={notice} onDismiss={() => setNotice(null)} />
        </div>
        <ControlsPanel settings={settings} onChange={setSettings} onTransform={transform} />
      </div>

      <section className="reveal mt-14 pb-20" style={{ "--i": 3 }} aria-labelledby="results-heading">
        <div className="mb-5 flex items-baseline justify-between gap-4 border-b border-rule-strong pb-3">
          <h2 id="results-heading" className="font-display text-2xl font-medium tracking-tight">
            The redline
          </h2>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">4 vibes</p>
        </div>
        <EmptyState />
      </section>
    </>
  );
}
