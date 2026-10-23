// The four audience vibes. `brief` tells the model who the reader is.
export const VIBES = [
  {
    id: "executive",
    name: "Executive C-Level",
    brief:
      "A busy senior executive. Lead with the bottom line and the ask, keep it short, outcome-focused and calm.",
  },
  {
    id: "peer",
    name: "Supportive Peer",
    brief:
      "A colleague at the same level. Warm, collaborative and encouraging, acknowledges the other person, still clear about what is needed.",
  },
  {
    id: "legal",
    name: "Legal/Compliance",
    brief:
      "A record that legal or compliance could read later. Precise, neutral and factual, no blame, no emotional language, states obligations and dates clearly.",
  },
  {
    id: "genz",
    name: "Gen-Z Hype",
    brief:
      "A Gen-Z reader. Casual, upbeat, current slang, short punchy lines; at most two emoji.",
  },
];

export const VIBE_IDS = VIBES.map((v) => v.id);

export const vibeById = (id) => VIBES.find((v) => v.id === id);

export const MAX_AUDIENCE = 80;

/** A user-described audience ("my strict professor") as a fifth vibe. */
export function customVibe(audience) {
  const clean = String(audience ?? "")
    .replace(/["`\r\n]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_AUDIENCE);
  if (!clean) return null;
  return {
    id: "custom",
    name: clean[0].toUpperCase() + clean.slice(1),
    brief: `A reader the sender described as "${clean}". Match the vocabulary, formality and framing this reader expects.`,
  };
}
