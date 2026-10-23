"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { appendText, draftProblem } from "@/lib/textStats";
import { cachedTone, cachedTransform } from "@/lib/cached";
import { useToasts } from "@/lib/useToasts";
import Toaster from "./Toaster";
import { useVoiceInput } from "@/lib/useVoiceInput";
import { useOcr } from "@/lib/useOcr";
import { detectTone, regenerateVibe, transformDraft } from "@/lib/transformClient";
import { useMeaning } from "@/lib/useMeaning";
import { useGrammar } from "@/lib/useGrammar";
import { modelFor } from "@/lib/meaning";
import PreflightPanel from "./PreflightPanel";
import DraftPanel from "./DraftPanel";
import ControlsPanel from "./ControlsPanel";
import Notice from "./Notice";
import ResultsSection from "./ResultsSection";

const INFO_TIMEOUT_MS = 7000;

function useAutoDismiss(notice, clear) {
  // Info messages fade on their own; errors stay until dismissed.
  useEffect(() => {
    if (notice?.kind !== "info") return;
    const id = setTimeout(clear, INFO_TIMEOUT_MS);
    return () => clearTimeout(id);
  }, [notice, clear]);
}

const scrollBehavior = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";

export default function Workbench() {
  const [text, setText] = useState("");
  const [settings, setSettings] = useState({ language: "en", style: "professional", tone: "auto" });
  const [voiceHint, setVoiceHint] = useState("auto");
  const [notice, setNotice] = useState(null);
  const [run, setRun] = useState({ id: 0, status: "idle", result: null, source: null });
  const [regenerating, setRegenerating] = useState({});
  const [showChanges, setShowChanges] = useState(false);
  const [resultsNotice, setResultsNotice] = useState(null);
  const [addingAudience, setAddingAudience] = useState(null);
  const [meaningScores, setMeaningScores] = useState({});
  const [tone, setTone] = useState({ status: "idle", data: null, forText: "" });
  const [offline, setOffline] = useState(false);
  const { toasts, push: toast, dismiss: dismissToast } = useToasts();
  const requestedScores = useRef(new Set());
  const textareaRef = useRef(null);
  const resultsRef = useRef(null);
  const { models: meaningModels, measure } = useMeaning();

  const showError = useCallback((message) => setNotice({ kind: "error", message }), []);
  const showInfo = useCallback((message) => setNotice({ kind: "info", message }), []);

  const addText = (addition) => {
    const result = appendText(text, addition);
    setText(result.text);
    if (result.clipped) showInfo("Added text was trimmed to fit the 3,000 character limit.");
  };

  const voice = useVoiceInput({ onText: addText, onError: showError, onInfo: showInfo });
  const { ocr, readImage } = useOcr({ onText: addText, onError: showError, onInfo: showInfo });
  // Offline demo mode: an AI call failed on a sample draft, so saved results stand in.
  const offlineRef = useRef(false);
  const goOffline = useCallback(() => {
    if (!offlineRef.current) {
      toast("info", "Offline demo mode: the AI is unavailable, so you're seeing saved results for this sample.");
    }
    offlineRef.current = true;
    setOffline(true);
  }, [toast]);
  // The server retries once when a rewrite comes back in the wrong language; say so if it still did.
  const warnLanguage = (warnings) => {
    if (warnings?.length) {
      toast("info", `Not quite the language you asked for: ${warnings.join("; ")}. Regenerate that card to try again.`);
    }
  };

  const goOnline = () => {
    offlineRef.current = false;
    setOffline(false);
  };

  const grammar = useGrammar({ text, setText, onError: showError, onInfo: showInfo, onOffline: goOffline });

  /** Shows the draft problem next to the textarea; true if the draft is usable. */
  const draftOk = () => {
    const problem = draftProblem(text);
    if (!problem) return true;
    showError(problem);
    textareaRef.current?.focus();
    return false;
  };

  const runToneDetection = async () => {
    if (!draftOk()) return;
    const forText = text.trim();
    setTone((t) => ({ ...t, status: "loading" }));
    try {
      const data = await detectTone(forText);
      setTone({ status: "done", data, forText });
      goOnline();
    } catch (err) {
      const saved = cachedTone(forText);
      if (saved) {
        setTone({ status: "done", data: saved, forText });
        goOffline();
        return;
      }
      setTone((t) => ({ ...t, status: t.data ? "done" : "idle" }));
      showError(err.message);
    }
  };

  const resultsError = useCallback((message) => setResultsNotice({ kind: "error", message }), []);
  const clearNotice = useCallback(() => setNotice(null), []);
  const clearResultsNotice = useCallback(() => setResultsNotice(null), []);
  useAutoDismiss(notice, clearNotice);
  useAutoDismiss(resultsNotice, clearResultsNotice);

  const loading = run.status === "loading";

  const transform = async () => {
    if (loading || !draftOk()) return;
    const source = { text: text.trim(), settings };
    setNotice(null);
    setResultsNotice(null);
    setRun((r) => ({ ...r, status: "loading" }));
    resultsRef.current?.scrollIntoView({ behavior: scrollBehavior(), block: "start" });

    const show = (result) => {
      setRegenerating({});
      setRun((r) => ({ id: r.id + 1, status: "done", result, source }));
      // The transform also reads the draft's tone, so the tone card stays in sync for free.
      setTone({
        status: "done",
        data: { original_intent: result.original_intent, original_tone: result.original_tone },
        forText: source.text,
      });
    };

    try {
      const result = await transformDraft(source.text, settings);
      show(result);
      warnLanguage(result.warnings);
      goOnline();
    } catch (err) {
      const saved = cachedTransform(source.text);
      if (saved) {
        // Saved results are English; say so if another language was asked for.
        source.settings = { ...settings, language: "en" };
        show(saved);
        goOffline();
        if (settings.language !== "en") toast("info", "Saved demo results are in English only.");
        return;
      }
      // Keep any earlier result on screen if this attempt failed.
      setRun((r) => ({ ...r, status: r.result ? "done" : "idle" }));
      resultsError(`${err.message} The three sample drafts still work in offline demo mode.`);
    }
  };

  const regenerate = async (vibeId) => {
    const { id: runId, source, result } = run;
    const previous = result?.vibes.find((v) => v.id === vibeId);
    if (!previous) return;
    setRegenerating((r) => ({ ...r, [vibeId]: true }));
    try {
      const { vibe, warnings } = await regenerateVibe(source.text, source.settings, vibeId, previous.text, previous.audience);
      warnLanguage(warnings);
      // Ignore the answer if a newer full transform replaced these cards meanwhile.
      setRun((r) =>
        r.id === runId && r.result
          ? { ...r, result: { ...r.result, vibes: r.result.vibes.map((v) => (v.id === vibeId ? vibe : v)) } }
          : r
      );
    } catch (err) {
      toast(
        "error",
        offline
          ? `Regenerating needs the AI, which is unavailable. ${previous.name} keeps its saved version.`
          : `Couldn't regenerate ${previous.name}. ${err.message}`
      );
    } finally {
      setRegenerating((r) => {
        const next = { ...r };
        delete next[vibeId];
        return next;
      });
    }
  };

  const addAudience = async (audience) => {
    const { id: runId, source } = run;
    setAddingAudience(audience);
    try {
      const { vibe, warnings } = await regenerateVibe(source.text, source.settings, "custom", undefined, audience);
      warnLanguage(warnings);
      setRun((r) =>
        r.id === runId && r.result
          ? { ...r, result: { ...r.result, vibes: [...r.result.vibes.filter((v) => v.id !== "custom"), vibe] } }
          : r
      );
      return true;
    } catch (err) {
      toast(
        "error",
        offline
          ? "Custom audiences need the AI, which is unavailable in offline demo mode."
          : `Couldn't write for "${audience}". ${err.message}`
      );
      return false;
    } finally {
      setAddingAudience(null);
    }
  };

  const removeAudience = () =>
    setRun((r) => ({ ...r, result: { ...r.result, vibes: r.result.vibes.filter((v) => v.id !== "custom") } }));

  // Meaning Match: score every rewrite the local models can judge.
  const scoreKey = (model, original, text) => `${model}|${original}|${text}`;
  useEffect(() => {
    const { result, source } = run;
    if (!result) return;
    const groups = {};
    for (const v of result.vibes) {
      const model = modelFor(source.settings.language, source.text, v.text);
      if (!model) continue;
      const key = scoreKey(model, source.text, v.text);
      if (requestedScores.current.has(key)) continue;
      requestedScores.current.add(key);
      (groups[model] ??= []).push({ key, text: v.text });
    }
    for (const [model, rewrites] of Object.entries(groups)) {
      measure(model, source.text, rewrites)
        .then((results) => setMeaningScores((s) => ({ ...s, ...results })))
        .catch(() =>
          setMeaningScores((s) => ({ ...s, ...Object.fromEntries(rewrites.map((r) => [r.key, { error: true }])) }))
        );
    }
  }, [run, measure]);

  const meaningFor = (vibe) => {
    const { source } = run;
    const model = modelFor(source.settings.language, source.text, vibe.text);
    if (!model) {
      return { state: "ai", reason: "Romanised Hindi is outside what the local models can judge, so this is the rewriting AI's own estimate." };
    }
    const score = meaningScores[scoreKey(model, source.text, vibe.text)];
    if (score?.error || meaningModels[model]?.status === "error") {
      return { state: "ai", reason: "The local meaning model couldn't load, so this is the rewriting AI's own estimate." };
    }
    return score ? { state: "local", ...score } : { state: "pending" };
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

  return (
    <>
      <div className="reveal grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]" style={{ "--i": 2 }}>
        <div className="flex min-w-0 flex-col gap-3">
          <DraftPanel
            text={text}
            onInfo={showInfo}
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
          <PreflightPanel
            text={text}
            tone={tone}
            targetTone={settings.tone}
            onDetectTone={runToneDetection}
            grammar={grammar}
          />
        </div>
        <ControlsPanel
          settings={settings}
          onChange={setSettings}
          onTransform={transform}
          busy={loading}
          meaningModels={meaningModels}
          offline={offline}
        />
      </div>

      <ResultsSection
        sectionRef={resultsRef}
        run={run}
        notice={resultsNotice}
        onDismissNotice={clearResultsNotice}
        showChanges={showChanges}
        onToggleChanges={() => setShowChanges((s) => !s)}
        regenerating={regenerating}
        onRegenerate={regenerate}
        onNotice={(message) => toast("error", message)}
        onToast={toast}
        offline={offline}
        meaningFor={meaningFor}
        addingAudience={addingAudience}
        onAddAudience={addAudience}
        onRemoveAudience={removeAudience}
      />
      <Toaster toasts={toasts} onDismiss={dismissToast} />
    </>
  );
}
