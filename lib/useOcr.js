"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const LOW_CONFIDENCE = 60;

const STAGE_LABELS = {
  "loading tesseract core": "Loading the OCR engine",
  "initializing tesseract": "Starting the OCR engine",
  "loading language traineddata": "Fetching English + Hindi data",
  "initializing api": "Preparing to read",
  "recognizing text": "Reading text",
};

function cleanText(raw) {
  return raw
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Image-to-text with tesseract.js. Everything runs in the browser. */
export function useOcr({ onText, onError, onInfo }) {
  const [ocr, setOcr] = useState({ busy: false, progress: 0, label: "" });
  const workerRef = useRef(null);
  const callbacks = useRef({ onText, onError, onInfo });

  useEffect(() => {
    callbacks.current = { onText, onError, onInfo };
  });

  const readImage = useCallback(async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      callbacks.current.onError("That file isn't an image. Try a PNG, JPG or WebP.");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      callbacks.current.onError("That image is over 10 MB. Try a smaller screenshot or photo.");
      return;
    }

    setOcr({ busy: true, progress: 0, label: "Loading the OCR engine" });
    try {
      if (!workerRef.current) {
        const { createWorker } = await import("tesseract.js");
        workerRef.current = await createWorker(["eng", "hin"], 1, {
          logger: (m) =>
            setOcr({
              busy: true,
              progress: m.progress ?? 0,
              label: STAGE_LABELS[m.status] || "Working",
            }),
        });
      }
      const { data } = await workerRef.current.recognize(file);
      const text = cleanText(data.text || "");
      if (!text) {
        callbacks.current.onError(
          "Couldn't find readable text in that image. A sharper, well-lit shot works better."
        );
      } else {
        callbacks.current.onText(text);
        if (data.confidence < LOW_CONFIDENCE) {
          callbacks.current.onInfo?.(
            "The image was hard to read, so some words may be wrong. Check the text before transforming."
          );
        }
      }
    } catch {
      await workerRef.current?.terminate().catch(() => {});
      workerRef.current = null;
      callbacks.current.onError(
        "Couldn't read the image. The OCR language data downloads on first use, so check your connection and try again."
      );
    } finally {
      setOcr({ busy: false, progress: 0, label: "" });
    }
  }, []);

  useEffect(
    () => () => {
      workerRef.current?.terminate().catch(() => {});
    },
    []
  );

  return { ocr, readImage };
}
