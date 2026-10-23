// The INTENT / SHIFT frontend calls its personas executive, supportive, legal and genz;
// the engine's vibe ids are executive, peer, legal and genz (plus "custom").
const TO_VIBE = { executive: "executive", supportive: "peer", legal: "legal", genz: "genz" };
const TO_PERSONA = Object.fromEntries(Object.entries(TO_VIBE).map(([p, v]) => [v, p]));

export const vibeForPersona = (personaId) => TO_VIBE[personaId] ?? "executive";
export const personaForVibe = (vibeId) => TO_PERSONA[vibeId] ?? vibeId;
