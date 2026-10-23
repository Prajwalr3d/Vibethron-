"use client";

import { useSyncExternalStore } from "react";
import { MoonIcon, SunIcon } from "./icons";

function subscribe(onChange) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

const getTheme = () => document.documentElement.dataset.theme || "light";

export default function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getTheme, () => null);
  const next = theme === "dark" ? "light" : "dark";

  const toggle = () => {
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("vibeshift-theme", next);
    } catch {}
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="btn-paper inline-flex h-9 w-9 items-center justify-center"
      aria-label={theme ? `Switch to ${next} mode` : "Toggle color mode"}
      title={theme ? `Switch to ${next} mode` : undefined}
    >
      {theme === "dark" ? <SunIcon /> : theme === "light" ? <MoonIcon /> : null}
    </button>
  );
}
