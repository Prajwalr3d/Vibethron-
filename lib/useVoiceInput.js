"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export const MAX_RECORD_SECONDS = 60;

const RECORDER_TYPES = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg"];
const BROWSER_LANG = { en: "en-IN", hi: "hi-IN", auto: "en-IN" };

function getSpeechRecognition() {
  if (typeof window === "undefined") return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

function pickMimeType() {
  return RECORDER_TYPES.find((t) => MediaRecorder.isTypeSupported(t)) || "";
}

function micErrorMessage(err) {
  if (err?.name === "NotAllowedError") {
    return "Microphone access is blocked. Allow it from the address bar, then try again.";
  }
  if (err?.name === "NotFoundError") return "No microphone was found on this device.";
  return "Couldn't start the microphone.";
}

const SPEECH_ERRORS = {
  "not-allowed": "Microphone access is blocked. Allow it from the address bar, then try again.",
  "no-speech": "Didn't hear anything. Try again a little closer to the mic.",
  network: "Browser speech recognition needs an internet connection.",
  "audio-capture": "No microphone was found on this device.",
};

/**
 * Voice-to-text. Engine is "whisper" (record, then POST to /api/transcribe),
 * "browser" (live webkitSpeechRecognition), or "none".
 */
export function useVoiceInput({ onText, onError, onInfo }) {
  const [engine, setEngine] = useState("checking");
  const [status, setStatus] = useState("idle"); // idle | recording | transcribing
  const [elapsed, setElapsed] = useState(0);

  const callbacks = useRef({ onText, onError, onInfo });
  const recorderRef = useRef(null);
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    callbacks.current = { onText, onError, onInfo };
  });

  // Decide which engine to use once, on mount.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/transcribe")
      .then((r) => (r.ok ? r.json() : { available: false }))
      .catch(() => ({ available: false }))
      .then(({ available }) => {
        if (cancelled) return;
        const canRecord =
          typeof MediaRecorder !== "undefined" && !!navigator.mediaDevices?.getUserMedia;
        if (available && canRecord) setEngine("whisper");
        else setEngine(getSpeechRecognition() ? "browser" : "none");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const clearTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = null;
  };

  const startTimer = (onLimit) => {
    const startedAt = Date.now();
    setElapsed(0);
    timerRef.current = setInterval(() => {
      const secs = Math.floor((Date.now() - startedAt) / 1000);
      setElapsed(secs);
      if (secs >= MAX_RECORD_SECONDS) onLimit();
    }, 250);
  };

  const stop = useCallback(() => {
    clearTimer();
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
    recognitionRef.current?.stop();
  }, []);

  const transcribe = async (blob, hint) => {
    setStatus("transcribing");
    try {
      const ext = blob.type.includes("mp4") ? "m4a" : blob.type.includes("ogg") ? "ogg" : "webm";
      const form = new FormData();
      form.append("file", blob, `voice.${ext}`);
      form.append("language", hint);
      const res = await fetch("/api/transcribe", { method: "POST", body: form });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Transcription failed.");
      if (!data.text) {
        callbacks.current.onError("Didn't catch any words in that recording. Try again.");
      } else {
        callbacks.current.onText(data.text);
      }
    } catch (err) {
      const canFallback = !!getSpeechRecognition();
      if (canFallback) setEngine("browser");
      callbacks.current.onError(
        `${err.message} ${
          canFallback
            ? "Switched to browser voice: tap the mic and say it again."
            : "Voice input isn't available in this browser."
        }`
      );
    } finally {
      setStatus("idle");
    }
  };

  const startWhisper = async (hint) => {
    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err) {
      callbacks.current.onError(micErrorMessage(err));
      return;
    }
    const mimeType = pickMimeType();
    const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
    const chunks = [];
    recorder.ondataavailable = (e) => e.data.size && chunks.push(e.data);
    recorder.onstop = () => {
      clearTimer();
      stream.getTracks().forEach((t) => t.stop());
      recorderRef.current = null;
      const blob = new Blob(chunks, { type: recorder.mimeType || "audio/webm" });
      if (blob.size < 1000) {
        setStatus("idle");
        callbacks.current.onError("That recording was too short. Hold on a moment longer.");
        return;
      }
      transcribe(blob, hint);
    };
    recorderRef.current = recorder;
    recorder.start();
    setStatus("recording");
    startTimer(() => {
      callbacks.current.onInfo?.("Reached the 60 second limit, transcribing what you said.");
      stop();
    });
  };

  const startBrowser = (hint) => {
    const SpeechRecognition = getSpeechRecognition();
    const rec = new SpeechRecognition();
    rec.lang = BROWSER_LANG[hint] || "en-IN";
    rec.continuous = true;
    rec.interimResults = false;
    let transcript = "";
    let errored = false;
    rec.onresult = (e) => {
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) transcript += `${e.results[i][0].transcript} `;
      }
    };
    rec.onerror = (e) => {
      if (e.error === "aborted") return;
      errored = true;
      callbacks.current.onError(SPEECH_ERRORS[e.error] || "Browser speech recognition stopped.");
    };
    rec.onend = () => {
      clearTimer();
      recognitionRef.current = null;
      setStatus("idle");
      if (transcript.trim()) callbacks.current.onText(transcript.trim());
      else if (!errored) callbacks.current.onError("Didn't hear anything. Try again.");
    };
    recognitionRef.current = rec;
    try {
      rec.start();
    } catch {
      callbacks.current.onError("Couldn't start browser speech recognition.");
      return;
    }
    setStatus("recording");
    startTimer(() => stop());
  };

  const start = useCallback(
    (hint = "auto") => {
      if (status !== "idle") return;
      if (engine === "whisper") startWhisper(hint);
      else if (engine === "browser") startBrowser(hint);
      else callbacks.current.onError("Voice input isn't supported in this browser. Try Chrome or Edge.");
    },
    // startWhisper/startBrowser only touch refs and stable setters
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [engine, status]
  );

  // Release the mic if the component unmounts mid-recording.
  useEffect(
    () => () => {
      clearInterval(timerRef.current);
      const recorder = recorderRef.current;
      if (recorder) {
        recorder.onstop = null;
        if (recorder.state === "recording") recorder.stop();
        recorder.stream.getTracks().forEach((t) => t.stop());
      }
      recognitionRef.current?.abort();
    },
    []
  );

  return { engine, status, elapsed, start, stop };
}
