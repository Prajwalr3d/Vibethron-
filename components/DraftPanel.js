"use client";

import { useRef, useState } from "react";
import { MAX_CHARS } from "@/lib/textStats";
import DraftStats from "./DraftStats";
import VoiceControl from "./VoiceControl";
import SampleDrafts from "./SampleDrafts";
import { ImageIcon } from "./icons";

const OCR_PRIVACY = "Image text is read on your device and never leaves the browser.";

function imageFrom(items) {
  for (const item of items || []) {
    if (item.kind === "file" && item.type.startsWith("image/")) return item.getAsFile();
  }
  return null;
}

export default function DraftPanel({ text, onTextChange, textareaRef, voice, voiceHint, onVoiceHintChange, ocr, onImage, onSample, onInfo }) {
  const fileRef = useRef(null);
  const dragDepth = useRef(0);
  const [dragging, setDragging] = useState(false);

  const onDragEnter = (e) => {
    if (![...e.dataTransfer.types].includes("Files")) return;
    e.preventDefault();
    dragDepth.current += 1;
    setDragging(true);
  };
  const onDragLeave = () => {
    dragDepth.current = Math.max(0, dragDepth.current - 1);
    if (dragDepth.current === 0) setDragging(false);
  };
  const onDrop = (e) => {
    e.preventDefault();
    dragDepth.current = 0;
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onImage(file);
  };
  const onPaste = (e) => {
    const file = imageFrom(e.clipboardData?.items);
    if (file) {
      e.preventDefault();
      onImage(file);
      return;
    }
    // maxLength trims pastes silently; say so.
    const { selectionStart, selectionEnd, value } = e.currentTarget;
    const room = MAX_CHARS - (value.length - (selectionEnd - selectionStart));
    if ((e.clipboardData?.getData("text") ?? "").length > room) {
      onInfo("The pasted text was trimmed to fit the 3,000 character limit.");
    }
  };

  return (
    <section
      className="sheet flex min-w-0 flex-col"
      aria-label="Your draft"
      onDragEnter={onDragEnter}
      onDragOver={(e) => dragging && e.preventDefault()}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rule px-4 py-3 sm:px-5">
        <h2 className="panel-title">Input rough draft</h2>
        <div className="flex flex-wrap items-center gap-2">
          <VoiceControl voice={voice} hint={voiceHint} onHintChange={onVoiceHintChange} />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={ocr.busy}
            title={OCR_PRIVACY}
            className="btn-paper inline-flex items-center gap-1.5 px-3 py-1.5 text-sm"
          >
            <ImageIcon size={16} /> Upload image
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              onImage(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
        </div>
      </div>

      <div className="relative">
        <label htmlFor="draft" className="sr-only">Draft message</label>
        <textarea
          id="draft"
          ref={textareaRef}
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          onPaste={onPaste}
          maxLength={MAX_CHARS}
          rows={11}
          placeholder="Paste the message you're nervous about sending. Or dictate it, or drop a screenshot here."
          className="ruled block min-h-[308px] w-full resize-y bg-transparent text-[15.5px] text-ink outline-none placeholder:text-ink-faint"
        />
        {dragging && (
          <div className="pointer-events-none absolute inset-2 flex flex-col items-center justify-center gap-1 rounded-[5px] border-2 border-dashed border-pencil bg-paper/90 text-center">
            <p className="font-display text-xl font-bold uppercase">Drop an image to read its text</p>
            <p className="text-xs text-ink-soft">{OCR_PRIVACY}</p>
          </div>
        )}
      </div>

      {ocr.busy && (
        <div className="border-t border-rule px-4 py-3 sm:px-5" role="status">
          <div className="flex items-baseline justify-between gap-3 font-mono text-[12px] text-ink-soft">
            <span>{ocr.label}...</span>
            <span className="tabular-nums">{Math.round(ocr.progress * 100)}%</span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-paper-2" aria-hidden="true">
            <div
              className="h-full origin-left rounded-full bg-pencil transition-transform duration-200"
              style={{ transform: `scaleX(${ocr.progress})` }}
            />
          </div>
          <p className="mt-1.5 text-[12px] text-ink-faint">{OCR_PRIVACY}</p>
        </div>
      )}

      <div className="flex flex-col gap-3 border-t border-rule px-4 py-3 sm:px-5 md:flex-row md:items-center md:justify-between">
        <DraftStats text={text} />
        <SampleDrafts onPick={onSample} />
      </div>
    </section>
  );
}
