"use client";

import { useCallback, useState } from "react";

let nextId = 1;

/** Short-lived messages for things that happen away from the draft (cards, export, offline mode). */
export function useToasts() {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  const push = useCallback(
    (kind, message) => {
      const id = nextId++;
      setToasts((t) => [...t.filter((x) => x.message !== message).slice(-2), { id, kind, message }]);
      setTimeout(() => dismiss(id), kind === "error" ? 8000 : 5000);
    },
    [dismiss]
  );

  return { toasts, push, dismiss };
}
