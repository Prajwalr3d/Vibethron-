"use client";

import { useEffect, useState } from "react";
import { applyAll, applyIssue, locateIssues } from "./grammar";
import { draftProblem } from "./textStats";
import { checkGrammar } from "./transformClient";
import { cachedGrammar } from "./cached";

const COOLDOWN_MS = 4000; // keeps us well inside LanguageTool's ~20 requests/minute

/** Grammar check state for the draft; accepting a fix edits the draft through setText. */
export function useGrammar({ text, setText, onError, onInfo, onOffline }) {
  const [strictness, setStrictness] = useState("standard");
  const [state, setState] = useState({ status: "idle", issues: [], engine: null, found: 0 });
  const [coolingDown, setCoolingDown] = useState(false);

  useEffect(() => {
    if (!coolingDown) return;
    const id = setTimeout(() => setCoolingDown(false), COOLDOWN_MS);
    return () => clearTimeout(id);
  }, [coolingDown]);

  const check = async () => {
    const problem = draftProblem(text);
    if (problem) {
      onError(problem);
      return;
    }
    if (state.status === "checking" || coolingDown) return;
    setState((s) => ({ ...s, status: "checking" }));
    setCoolingDown(true);
    try {
      const { issues, engine } = await checkGrammar(text, strictness);
      setState({ status: "done", issues, engine, found: issues.length });
    } catch (err) {
      const saved = cachedGrammar(text);
      if (saved) {
        const issues = locateIssues(text, saved);
        setState({ status: "done", issues, engine: "offline", found: issues.length });
        onOffline?.();
        return;
      }
      setState((s) => ({ ...s, status: s.issues.length ? "done" : "idle" }));
      onError(err.message);
    }
  };

  const accept = (id) => {
    const result = applyIssue(text, state.issues, id);
    if (!result) {
      setState((s) => ({ ...s, issues: s.issues.filter((i) => i.id !== id) }));
      onInfo("That phrase has changed since the check, so the suggestion was skipped.");
      return;
    }
    setText(result.text);
    setState((s) => ({ ...s, issues: result.issues }));
  };

  const acceptAll = () => {
    const result = applyAll(text, state.issues);
    setText(result.text);
    setState((s) => ({ ...s, issues: result.issues }));
  };

  const ignore = (id) => setState((s) => ({ ...s, issues: s.issues.filter((i) => i.id !== id) }));

  return {
    strictness,
    setStrictness,
    ...state,
    checking: state.status === "checking",
    canCheck: !coolingDown && state.status !== "checking",
    check,
    accept,
    acceptAll,
    ignore,
  };
}
