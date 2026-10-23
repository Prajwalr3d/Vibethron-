import OptionGroup from "./OptionGroup";
import { CheckIcon } from "./icons";

const STRICTNESS_OPTIONS = [
  { id: "light", label: "Light" },
  { id: "standard", label: "Standard" },
  { id: "strict", label: "Strict" },
];
const CONTEXT = 28;

function Context({ text, issue }) {
  const at = text.slice(issue.offset, issue.offset + issue.length) === issue.original_phrase ? issue.offset : -1;
  if (at === -1) return <del className="del-pen">{issue.original_phrase}</del>;
  const before = text.slice(Math.max(0, at - CONTEXT), at);
  const after = text.slice(at + issue.length, at + issue.length + CONTEXT);
  return (
    <>
      <span className="text-ink-faint">
        {at > CONTEXT && "..."}
        {before}
      </span>
      <del className="del-pen">{issue.original_phrase}</del>
      {issue.suggestion && <ins className="ins-mark">{issue.suggestion}</ins>}
      <span className="text-ink-faint">
        {after}
        {at + issue.length + CONTEXT < text.length && "..."}
      </span>
    </>
  );
}

export default function GrammarPanel({ grammar, text }) {
  const { issues, status, engine, checking, canCheck } = grammar;
  const fixable = issues.filter((i) => i.suggestion).length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <OptionGroup
          name="strictness"
          legend="Strictness"
          options={STRICTNESS_OPTIONS}
          value={grammar.strictness}
          onChange={grammar.setStrictness}
        />
        <button type="button" onClick={grammar.check} disabled={!canCheck} className="btn-paper px-3 py-1.5 text-sm">
          {checking ? "Checking..." : "Check grammar"}
        </button>
      </div>
      <p className="text-[12px] text-ink-faint">
        Checking sends this draft to{" "}
        <a
          href="https://languagetool.org"
          target="_blank"
          rel="noopener"
          className="underline decoration-rule-strong underline-offset-2 hover:text-ink"
        >
          LanguageTool
        </a>
        . Hindi and Hinglish drafts are checked by Gemini instead.
      </p>

      {status === "done" && issues.length === 0 && (
        <p className="flex items-center gap-2 text-sm text-stamp">
          <CheckIcon size={16} />
          {grammar.found
            ? `All ${grammar.found} ${grammar.found === 1 ? "suggestion" : "suggestions"} handled.`
            : `No issues found${engine === "gemini" ? " (checked by AI)" : ""}.`}
        </p>
      )}

      {issues.length > 0 && (
        <div>
          <div className="flex items-center justify-between gap-3 border-b border-rule pb-2">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">
              {issues.length} {issues.length === 1 ? "suggestion" : "suggestions"} &middot;{" "}
              {engine === "gemini" ? "AI-checked" : "LanguageTool"}
            </p>
            {fixable > 1 && (
              <button type="button" onClick={grammar.acceptAll} className="text-[13px] text-pencil hover:underline">
                Accept all ({fixable})
              </button>
            )}
          </div>
          <ul className="divide-y divide-rule">
            {issues.map((issue) => (
              <li key={issue.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-faint">{issue.type}</p>
                  <p className="mt-0.5 break-words text-[14px] leading-6">
                    <Context text={text} issue={issue} />
                  </p>
                  <p className="text-[12.5px] text-ink-soft">{issue.reason}</p>
                </div>
                <div className="flex shrink-0 gap-1.5">
                  <button
                    type="button"
                    onClick={() => grammar.accept(issue.id)}
                    disabled={!issue.suggestion}
                    title={issue.suggestion ? `Replace with "${issue.suggestion}"` : "No automatic fix"}
                    className="btn-paper px-2.5 py-1 text-[13px]"
                  >
                    Accept
                  </button>
                  <button type="button" onClick={() => grammar.ignore(issue.id)} className="btn-paper px-2.5 py-1 text-[13px]">
                    Ignore
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
