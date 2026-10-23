const CREDITS = [
  ["Grammar", "LanguageTool", "https://languagetool.org"],
  ["Speech", "Whisper on Groq", "https://console.groq.com/docs/speech-to-text"],
  ["Image text", "Tesseract.js", "https://github.com/naptha/tesseract.js"],
  ["Meaning", "all-MiniLM-L6-v2", "https://huggingface.co/Xenova/all-MiniLM-L6-v2"],
];

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-rule">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-[12.5px] text-ink-soft sm:px-6 md:flex-row md:items-center md:justify-between">
        <p>
          Fact Guard is plain code. Meaning Match runs in your browser. Intent and tone are AI-assessed.
        </p>
        <ul className="flex flex-wrap gap-x-4 gap-y-1">
          {CREDITS.map(([what, name, href]) => (
            <li key={name}>
              {what}:{" "}
              <a href={href} target="_blank" rel="noopener" className="underline decoration-rule-strong underline-offset-2 hover:text-ink">
                {name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
