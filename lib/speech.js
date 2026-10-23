// Read-aloud with the browser's speechSynthesis.

const VOICE_LANG = { en: "en-IN", hi: "hi-IN", hinglish: "hi-IN" };

function loadVoices() {
  const synth = window.speechSynthesis;
  const voices = synth.getVoices();
  if (voices.length) return Promise.resolve(voices);
  // Chrome fills the list asynchronously.
  return new Promise((resolve) => {
    const done = () => resolve(synth.getVoices());
    synth.addEventListener("voiceschanged", done, { once: true });
    setTimeout(done, 1200);
  });
}

function pickVoice(voices, lang) {
  const norm = (l) => l.toLowerCase().replace("_", "-");
  const base = lang.split("-")[0];
  return (
    voices.find((v) => norm(v.lang) === norm(lang)) ||
    voices.find((v) => norm(v.lang).startsWith(`${base}-`) || norm(v.lang) === base) ||
    null
  );
}

export const canSpeak = () => typeof window !== "undefined" && "speechSynthesis" in window;

/** Speaks text; resolves to an error message string, or null once speech starts. */
export async function speak(text, language, { onEnd }) {
  if (!canSpeak()) return "Read-aloud isn't supported in this browser.";
  const lang = VOICE_LANG[language] || "en-IN";
  const voice = pickVoice(await loadVoices(), lang);
  if (!voice) {
    return lang === "hi-IN"
      ? "No Hindi voice is installed on this device, so this card can't be read aloud."
      : "No English voice is installed on this device.";
  }
  const synth = window.speechSynthesis;
  synth.cancel(); // one card at a time
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = voice;
  utterance.lang = voice.lang;
  utterance.onend = onEnd;
  utterance.onerror = onEnd;
  synth.speak(utterance);
  return null;
}

export function stopSpeaking() {
  if (canSpeak()) window.speechSynthesis.cancel();
}
