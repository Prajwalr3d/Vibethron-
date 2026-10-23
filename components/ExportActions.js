"use client";

import { reportText } from "@/lib/report";
import { copyText } from "@/lib/clipboard";
import { CopyIcon } from "./icons";

export default function ExportActions({ data, onToast }) {
  const copyAll = async () => {
    if (await copyText(reportText(data))) onToast("info", `Copied all ${data.vibes.length} rewrites with their proof.`);
    else onToast("error", "Couldn't copy automatically. Your browser blocked clipboard access.");
  };

  const download = () => {
    // The print dialog's file name comes from the page title.
    const title = document.title;
    document.title = `VibeShift report ${new Date().toISOString().slice(0, 10)}`;
    window.addEventListener("afterprint", () => (document.title = title), { once: true });
    window.print();
  };

  return (
    <div className="flex items-center gap-2">
      <button type="button" onClick={copyAll} className="btn-paper inline-flex items-center gap-1.5 px-3 py-1.5 text-[13px]">
        <CopyIcon size={15} /> Copy all
      </button>
      <button
        type="button"
        onClick={download}
        className="btn-paper px-3 py-1.5 text-[13px]"
        title="Opens the print dialog. Choose 'Save as PDF' to download a one-page report."
      >
        Download report
      </button>
    </div>
  );
}
