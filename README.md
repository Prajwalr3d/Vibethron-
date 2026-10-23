# VibeShift

**We show you exactly what changed, and prove your facts survived.**

VibeShift rewrites a draft message for four audiences (Executive C-Level, Supportive Peer, Legal/Compliance, Gen-Z Hype, plus any reader you describe) and then checks every rewrite. We don't ask the AI to grade itself: Fact Guard is plain code, Meaning Match is a local embedding model, and both run in your browser.

Built for the 6-hour hackathon problem "Instant Persona and Communication Transformer". Next.js (App Router) + Tailwind.

## Setup

Requires Node.js 20 or newer.

```bash
npm install
cp .env.example .env.local   # then fill in the keys below
npm run dev                  # http://localhost:3000
```

| Variable | Needed for | Without it |
|---|---|---|
| `GEMINI_API_KEY` | Rewriting, tone detection, Hindi/Hinglish grammar | The three sample drafts still work in **offline demo mode** (saved results). Other drafts show a clear error. |
| `GEMINI_MODEL` | Optional override, tried first | Defaults to `gemini-3.6-flash`, falling back to `gemini-3.5-flash` then `gemini-3.1-flash-lite` on overload (503), rate limits (429), timeouts or unknown models. |
| `GROQ_API_KEY` | Voice input through Whisper (`whisper-large-v3`). Groq keys start with `gsk_`. | Falls back to the browser's own speech recognition (Chrome/Edge). |

Paste keys without quotes. On the Gemini free tier the per-minute quota is small: a full transform plus tone and grammar calls can hit it, and the app then moves to the next model (quotas are per model).

Keys are read only in server routes (`process.env`), never sent to the browser. `.env.local` is gitignored (`.env*` in `.gitignore`, with `.env.example` explicitly allowed).

Other commands:

```bash
npm test        # 49 unit tests (vitest): Fact Guard, Meaning Match helpers, grammar, insights, demo data
npm run lint
npm run build
```

Get keys at [Google AI Studio](https://aistudio.google.com/apikey) (Gemini) and the [Groq console](https://console.groq.com/keys).

## How we verify

| Check | How it works | Who decides |
|---|---|---|
| **Fact Guard** | `lib/factguard.js` extracts amounts, percentages, times, dates, weekdays, months, numbers and capitalised names from your draft, then looks for each in the rewrite. It normalises formats: `5,000`/`5000`/`5,00,000`, `Rs`/`₹`/`rupees`, `15 March`/`March 15`, `6:30 PM`/`18:30`, Devanagari digits, Hindi month and weekday names. | **Plain code.** No AI. Deterministic and unit-tested. |
| **Meaning Match** | Sentence embeddings from `all-MiniLM-L6-v2` (English) or `paraphrase-multilingual-MiniLM-L12-v2` (Hindi output), run in a Web Worker with Transformers.js. Cosine similarity between your draft and each rewrite; each original sentence is matched against the rewrite to flag sentences that were "possibly dropped or changed". | **Local model in your browser.** Only the one-time model download leaves your machine. |
| **Intent** | Gemini states your draft's intent and judges whether each rewrite keeps it. | **AI-assessed**, and labelled as such. |
| **Tone** | Gemini scores formality, warmth, urgency and directness (0-100). | **AI-assessed.** |

Meaning Match thresholds (Strong >= 78, Fair >= 60, weak sentence < 0.50) were calibrated on hand-written faithful and deliberately drifted rewrites of the three samples. Faithful rewrites scored 79-95 (Hindi: 73-89); drifted ones scored 24-56 (Hindi: 22-40). For Hinglish output, or if the local model can't load, the card shows Gemini's own estimate labelled **AI-estimated**.

Fact Guard and Meaning Match measure different things. In testing, a rewrite that silently dropped a ₹14,200 refund still scored 88% "Strong" on meaning, and Fact Guard caught it. That's why both exist.

## Features

- **Input:** textarea (3,000 characters) with live word, character and reading-time counts; voice (Whisper, or browser speech recognition, up to 60 seconds, English/Hindi/auto); image to text with Tesseract.js (English + Hindi; image text never leaves the browser); three sample drafts.
- **Brief:** output language (English, Hindi in Devanagari, Hinglish in Roman script), writing style and target tone.
- **Rewrites:** four cards (plus an optional custom audience), word-level "Show changes" diff, copy, read aloud, regenerate, and per-card stats (% words changed, length change, Flesch-Kincaid grade).
- **Proof on every card:** Fact Guard stamp with preserved facts circled, Meaning Match with a drift view, intent badge, tone meters against your draft, risks and likely reaction.
- **Before you send:** your draft's tone ("Your draft: Angry -> Target: Polite") and a grammar check with Accept / Ignore / Accept all.
- **Insights:** tone radars, word counts, Meaning Match bars, % changed gauges, summary tiles, and a table view.
- **Export:** Copy all, and Download report (a one-page print layout; choose "Save as PDF").
- **Offline demo mode:** if any AI call fails on a sample draft, saved results stand in and an "Offline demo mode" badge appears. Fact Guard and Meaning Match still run live on those results. One saved rewrite (Gen-Z, feedback sample) drops "9 AM" on purpose so the demo shows Fact Guard catching it.

## Privacy

- Drafts go to Gemini (Google) when you transform, detect tone, or grammar-check Hindi/Hinglish.
- Grammar checks on English drafts go to the public [LanguageTool](https://languagetool.org) API. The panel says so.
- Voice recordings go to Groq when `GROQ_API_KEY` is set; otherwise browser speech recognition is used (in Chrome this is also processed by Google).
- Image text recognition, Fact Guard, Meaning Match, diffs and stats run entirely in the browser.

## Project layout

```
app/api/transform   Gemini rewrite (all vibes, one vibe, or a custom audience)
app/api/tone        Gemini tone and intent of the draft
app/api/grammar     LanguageTool, with a Gemini fallback
app/api/transcribe  Groq Whisper
lib/                Logic: factguard, meaning (+ worker), grammar, readability, insights, cached demo data
components/         UI; components/insights holds the charts
tests/              Vitest unit tests
```

## Credits

- [Whisper](https://github.com/openai/whisper) (`whisper-large-v3`) served by [Groq](https://groq.com)
- [Tesseract.js](https://github.com/naptha/tesseract.js) with Tesseract's English and Hindi language data
- [LanguageTool](https://languagetool.org) public HTTP API
- [all-MiniLM-L6-v2](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2) and [paraphrase-multilingual-MiniLM-L12-v2](https://huggingface.co/sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2) (Sentence Transformers), ONNX conversions by [Xenova](https://huggingface.co/Xenova)
- [Transformers.js](https://github.com/huggingface/transformers.js) and ONNX Runtime Web
- [Gemini API](https://ai.google.dev) by Google
- [Next.js](https://nextjs.org), [React](https://react.dev), [Tailwind CSS](https://tailwindcss.com), [Recharts](https://recharts.org), [jsdiff](https://github.com/kpdecker/jsdiff), [Vitest](https://vitest.dev)
- Fonts: Fraunces, Geist, JetBrains Mono and Caveat via Google Fonts
- Chart colours: a categorical palette checked for colour-blind separation and contrast in light and dark modes

## Known limitations and what isn't verified

Being explicit, because a demo should not overclaim:

- **Live Gemini results (2026-10-23):** rewriting, tone detection and Hindi/Hinglish grammar were tested live. `gemini-3.8-flash` and `3.7-flash` were overloaded (503s and 60s hangs), which is why the default is `3.6-flash` with fallbacks. A full transform takes about 7-25 s depending on load. When every model is overloaded or out of quota, the user gets a clear "overloaded" or "request limit" message.
- **Gemini sometimes ignores the output language** (a Hindi request answered in English or Hinglish; formal Legal/Executive rewrites in plain English when Hinglish was asked). The server checks the script, retries once, and shows a warning if a rewrite still misses.
- **Gemini drops facts in practice**: in live runs Fact Guard caught real omissions (a promised "15 March" date, "since August", "QA", sign-off names). Gemini's own `meaning_score` was 100 for every rewrite, so the AI-estimated score carries little information; prefer the local Meaning Match.
- **Whisper not tested live**: the key provided was not a Groq key (Groq returned 401), and live microphone recording was not tested in an automated browser. The route's key-rejected error and the browser speech-recognition fallback were tested.
- **Fact Guard name detection is heuristic.** A name that starts a bullet line and appears nowhere else (for example "Ananya out 21-24 Oct") is not detected, to avoid treating every capitalised first word as a name. Spelled-out numbers are matched only from zero to twelve.
- **Meaning drift is strict.** A sentence merged into a longer one can be flagged as "possibly changed" (scores around 0.44-0.6).
- **Thresholds were calibrated on hand-written rewrites and confirmed on 16 real Gemini rewrites**, which all scored 80-93 (Strong). The sentence-level drift view is noisier on real output, especially Hindi, where 8-10 of 24 original sentences were flagged, partly because real rewrites legitimately drop lines like "I am done chasing you".
- **LanguageTool's free rules miss some errors** (for example "It were" and "five chart" were not flagged in testing). Its free API allows about 20 requests per minute per IP; VibeShift caps itself at 15 per minute with a 4-second cooldown.
- **The rate limiter is in memory**, so it resets on restart and is not shared across serverless instances.
- **Offline demo mode covers only the three samples, in English.** Regenerate and custom audiences need the AI.
- **"Download report" uses the browser's print dialog** rather than jsPDF, because jsPDF's built-in fonts can't render "₹" or Devanagari. Save as PDF to download. Very long rewrites may run past one page.
- **First load downloads models on demand:** about 23 MB for the English meaning model (on page open), about 120 MB for the Hindi one (only when Hindi output is used), and the Tesseract language data on the first image.
