// Fact Guard: plain code, no AI. Pulls the hard facts out of the original
// (amounts, percentages, times, dates, numbers, names) and checks that each
// one survives in a rewrite, tolerating format changes such as
// 5,000 / 5000, Rs / ₹, "15 March" / "March 15" and Devanagari digits.

const DEVANAGARI_DIGITS = "०१२३४५६७८९";
const DEVANAGARI = /[ऀ-ॿ]/g;

const MONTHS = {
  jan: 1, january: 1, जनवरी: 1,
  feb: 2, february: 2, फरवरी: 2, फ़रवरी: 2,
  mar: 3, march: 3, मार्च: 3,
  apr: 4, april: 4, अप्रैल: 4,
  may: 5, मई: 5,
  jun: 6, june: 6, जून: 6,
  jul: 7, july: 7, जुलाई: 7,
  aug: 8, august: 8, अगस्त: 8,
  sep: 9, sept: 9, september: 9, सितंबर: 9, सितम्बर: 9,
  oct: 10, october: 10, अक्टूबर: 10,
  nov: 11, november: 11, नवंबर: 11, नवम्बर: 11,
  dec: 12, december: 12, दिसंबर: 12, दिसम्बर: 12,
};
const MONTH_NAMES = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const WEEKDAYS = {
  monday: "mon", mon: "mon", सोमवार: "mon",
  tuesday: "tue", tue: "tue", tues: "tue", मंगलवार: "tue",
  wednesday: "wed", wed: "wed", बुधवार: "wed",
  thursday: "thu", thu: "thu", thurs: "thu", गुरुवार: "thu", बृहस्पतिवार: "thu",
  friday: "fri", fri: "fri", शुक्रवार: "fri",
  saturday: "sat", sat: "sat", शनिवार: "sat",
  sunday: "sun", sun: "sun", रविवार: "sun",
};

const CURRENCY = { "₹": "INR", rs: "INR", "rs.": "INR", inr: "INR", rupees: "INR", rupee: "INR", रुपये: "INR", रुपए: "INR", rupaye: "INR", $: "USD", usd: "USD", dollars: "USD", dollar: "USD" };
const SCALE = { k: "thousand", thousand: "thousand", हज़ार: "thousand", हजार: "thousand", lakh: "lakh", lakhs: "lakh", लाख: "lakh", crore: "crore", crores: "crore", करोड़: "crore", m: "million", mn: "million", million: "million" };
const WORD_NUMBERS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"];

// Capitalised words that start sentences or are otherwise not names.
const NOT_NAMES = new Set(
  `a an the this that these those it its i we you he she they our your my his her their us me them
  if and or but so because when while after before then also just only still please thanks thank
  hi hello hey dear regards best cheers sincerely ok okay yes no not all any some every each
  is are was were be been am do does did have has had can could will would should may might must
  let lets fix need needs want wants waiting blocked budget risk update note open two three week
  there here what why how who where which today tomorrow yesterday sorry good great real fyi
  am pm`.split(/\s+/)
);
const TITLES = /^(mr|mrs|ms|dr|prof|sir|shri|smt)\.?$/i;

const normDigits = (s) => s.replace(/[०-९]/g, (d) => String(DEVANAGARI_DIGITS.indexOf(d)));
const numValue = (s) => String(Number(normDigits(s).replace(/,/g, "")));

const NUM = String.raw`[0-9०-९]+(?:[.,][0-9०-९]+)*`;
const CUR_BEFORE = String.raw`(₹|\$|Rs\.?|INR|USD)`;
const CUR_AFTER = String.raw`(rupees?|rupaye|रुपये|रुपए|dollars?)`;
const SCALE_WORD = String.raw`(k|thousand|lakhs?|crores?|m|mn|million|हज़ार|हजार|लाख|करोड़)`;
const MONTH_WORD = Object.keys(MONTHS).sort((a, b) => b.length - a.length).join("|");
const WEEKDAY_WORD = Object.keys(WEEKDAYS).sort((a, b) => b.length - a.length).join("|");
// Word boundaries that work for Devanagari too (\b does not).
const L = String.raw`(?<![\p{L}\p{M}\p{N}])`;
const R = String.raw`(?![\p{L}\p{M}\p{N}])`;

const PATTERNS = [
  {
    type: "amount",
    re: new RegExp(String.raw`${L}${CUR_BEFORE}\s?(${NUM})(?:\s?${SCALE_WORD}${R})?`, "giu"),
    key: (m) => `amount:${CURRENCY[m[1].toLowerCase()]}:${numValue(m[2])}${m[3] ? SCALE[m[3].toLowerCase()] : ""}`,
  },
  {
    type: "amount",
    re: new RegExp(String.raw`${L}(${NUM})(?:\s?${SCALE_WORD})?\s?${CUR_AFTER}${R}`, "giu"),
    key: (m) => `amount:${CURRENCY[m[3].toLowerCase()]}:${numValue(m[1])}${m[2] ? SCALE[m[2].toLowerCase()] : ""}`,
  },
  {
    type: "percent",
    re: new RegExp(String.raw`${L}(${NUM})\s?(?:%|percent${R}|per cent${R}|प्रतिशत)`, "giu"),
    key: (m) => `percent:${numValue(m[1])}`,
  },
  {
    type: "time",
    re: new RegExp(String.raw`${L}([0-9०-९]{1,2})(?:[:.]([0-9०-९]{2}))?\s?(a\.?m\.?|p\.?m\.?)(?![\p{L}])`, "giu"),
    key: (m) => {
      let h = Number(normDigits(m[1])) % 12;
      if (/p/i.test(m[3])) h += 12;
      return `time:${h}:${m[2] ? normDigits(m[2]) : "00"}`;
    },
  },
  {
    type: "time",
    re: new RegExp(String.raw`${L}([0-9०-९]{1,2}):([0-9०-९]{2})${R}`, "gu"),
    key: (m) => `time?:${Number(normDigits(m[1]))}:${normDigits(m[2])}`,
  },
  {
    // "21-24 Oct" -> two dates
    type: "date",
    re: new RegExp(String.raw`${L}([0-9०-९]{1,2})\s?[-–]\s?([0-9०-९]{1,2})\s(${MONTH_WORD})${R}`, "giu"),
    keys: (m) => {
      const mo = MONTHS[m[3].toLowerCase()];
      return [`date:${Number(normDigits(m[1]))}-${mo}`, `date:${Number(normDigits(m[2]))}-${mo}`];
    },
  },
  {
    type: "date",
    re: new RegExp(String.raw`${L}([0-9०-९]{1,2})(?:st|nd|rd|th)?\s(?:of\s)?(${MONTH_WORD})${R}`, "giu"),
    key: (m) => `date:${Number(normDigits(m[1]))}-${MONTHS[m[2].toLowerCase()]}`,
  },
  {
    type: "date",
    re: new RegExp(String.raw`${L}(${MONTH_WORD})\s([0-9०-९]{1,2})(?:st|nd|rd|th)?${R}`, "giu"),
    key: (m) => `date:${Number(normDigits(m[2]))}-${MONTHS[m[1].toLowerCase()]}`,
  },
  {
    // 15/03, 15/03/2026, 15-03-2026 (day first, as written in India)
    type: "date",
    re: new RegExp(String.raw`${L}([0-9०-९]{1,2})(?:/([0-9०-९]{1,2})(?:/[0-9०-९]{2,4})?|-([0-9०-९]{1,2})-[0-9०-९]{2,4})${R}`, "gu"),
    key: (m) => `date:${Number(normDigits(m[1]))}-${Number(normDigits(m[2] || m[3]))}`,
  },
  {
    type: "date",
    re: new RegExp(String.raw`${L}(${WEEKDAY_WORD})${R}`, "giu"),
    key: (m) => `weekday:${WEEKDAYS[m[1].toLowerCase()]}`,
  },
  {
    // A month on its own ("since August"); short forms are too ambiguous.
    type: "date",
    re: /(?<![\p{L}\p{M}\p{N}])(january|february|march|april|june|july|august|september|october|november|december|जनवरी|फरवरी|मार्च|अप्रैल|जून|जुलाई|अगस्त|सितंबर|अक्टूबर|नवंबर|दिसंबर)(?![\p{L}\p{M}\p{N}])/giu,
    key: (m) => `month:${MONTHS[m[1].toLowerCase()]}`,
  },
  {
    type: "number",
    re: new RegExp(String.raw`${L}(${NUM})${R}`, "gu"),
    key: (m) => `number:${numValue(m[1])}`,
  },
];

/** Finds amounts, percentages, times, dates and numbers, with their spans. */
function findValues(text) {
  const taken = [];
  const found = [];
  const overlaps = (s, e) => taken.some(([a, b]) => s < b && e > a);
  for (const p of PATTERNS) {
    for (const m of text.matchAll(p.re)) {
      const start = m.index;
      // "4 PM." at a sentence end: the full stop isn't part of the time.
      const end = start + m[0].length - (/[AP]M\.$/.test(m[0]) ? 1 : 0);
      if (overlaps(start, end)) continue;
      // A lone "may"/"sun" is a word, not a date.
      if (p.type === "date" && /^(may|sun|sat|wed|mar)$/i.test(m[0])) continue;
      taken.push([start, end]);
      const keys = p.keys ? p.keys(m) : [p.key(m)];
      const raw = text.slice(start, end).trim();
      keys.forEach((key) => found.push({ type: p.type, raw, key, start, end }));
    }
  }
  return found.sort((a, b) => a.start - b.start);
}

const MONTH_OR_DAY = new RegExp(String.raw`^(${MONTH_WORD}|${WEEKDAY_WORD})$`, "i");

/** Capitalised proper nouns, acronyms and codes such as "Q2". Latin script only. */
const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const isFiller = (w) => NOT_NAMES.has(w.toLowerCase()) || MONTH_OR_DAY.test(w);

function findNames(text, valueSpans) {
  const names = [];
  const re = /\b(?:(?:Mr|Mrs|Ms|Dr|Prof)\.?[ \t]+)?[A-Z][\p{L}'’-]*(?:[ \t]+[A-Z][\p{L}'’-]*)*/gu;
  for (const m of text.matchAll(re)) {
    // "Rs" in "Rs 5,000" or "PM" in "6:30 PM" belong to a value, not a name.
    if (valueSpans.some((v) => m.index < v.end && m.index + m[0].length > v.start)) continue;
    const all = m[0].split(/[ \t]+/).filter((w) => !TITLES.test(w));
    let words = [...all];
    while (words.length && isFiller(words[0])) words.shift();
    while (words.length && isFiller(words.at(-1))) words.pop();
    if (!words.length) continue;
    const phrase = words.join(" ").replace(/[’']s$/, "");
    if (phrase.length < 2) continue;

    // A lone capitalised word at the start of a sentence or bullet is usually
    // just a capitalised common word. Keep it only if it is addressed
    // ("Rajesh,"), is an acronym, or appears capitalised mid-sentence too.
    const atStart = words[0] === all[0] && /(?:^|[.!?:]\s+|\n[\s\-*•]*)$/.test(text.slice(0, m.index));
    if (words.length === 1 && atStart) {
      const addressed = text[m.index + m[0].length] === ",";
      const midSentence = new RegExp(String.raw`[\p{L}\p{N},;)][ \t]+${escape(phrase)}\b`, "u").test(text);
      if (!addressed && !midSentence && !/^[A-Z]{2,}$/.test(phrase)) continue;
    }
    names.push({ type: "name", raw: phrase, key: `name:${phrase.toLowerCase()}` });
  }
  for (const m of text.matchAll(/\b[A-Z]{1,4}[0-9]{1,4}\b/g)) {
    names.push({ type: "name", raw: m[0], key: `name:${m[0].toLowerCase()}` });
  }
  return names;
}

const dedupe = (facts) => [...new Map(facts.map((f) => [f.key, f])).values()];

/** Every checkable fact in a draft. */
export function extractFacts(text) {
  const spans = findValues(text);
  const values = spans.map(({ type, raw, key }) => ({ type, raw, key }));
  return dedupe([...values, ...findNames(text, spans)]);
}

export const isMostlyDevanagari = (text) => {
  const letters = text.match(/\p{L}/gu) || [];
  return letters.length > 0 && (text.match(DEVANAGARI) || []).length / letters.length > 0.5;
};

function rewriteIndex(rewrite) {
  const values = findValues(rewrite);
  const keys = new Set(values.map((v) => v.key));
  const numbers = new Set();
  for (const m of normDigits(rewrite).matchAll(/[0-9]+(?:[.,][0-9]+)*/g)) numbers.add(numValue(m[0]));
  const lower = rewrite.toLowerCase();
  WORD_NUMBERS.forEach((w, n) => {
    if (new RegExp(String.raw`\b${w}\b`).test(lower)) numbers.add(String(n));
  });
  return { values, keys, numbers, lower };
}

function nameFound(name, lower) {
  const phrase = name.raw.toLowerCase();
  if (new RegExp(String.raw`\b${escape(phrase)}\b`).test(lower)) return true;
  // "Hotel Leela" vs "the Leela hotel": every word present counts.
  const words = phrase.split(/\s+/);
  return words.length > 1 && words.every((w) => new RegExp(String.raw`\b${escape(w)}\b`).test(lower));
}

// Times match on hour and minutes; an hour without AM/PM matches either half of the day.
function timesMatch(a, b) {
  const [ka, ha, ma] = a.split(":");
  const [kb, hb, mb] = b.split(":");
  if (!ka.startsWith("time") || !kb.startsWith("time") || ma !== mb) return false;
  if (ka === "time" && kb === "time") return ha === hb;
  return Number(ha) % 12 === Number(hb) % 12;
}

function valueFound(fact, idx) {
  if (idx.keys.has(fact.key)) return true;
  const [kind, ...rest] = fact.key.split(":");
  if (kind.startsWith("time")) return [...idx.keys].some((k) => timesMatch(fact.key, k));
  if (kind === "number") return idx.numbers.has(rest[0]);
  if (kind === "percent") return idx.numbers.has(rest[0]) && /%|percent|per cent|प्रतिशत/i.test(idx.lower);
  return false;
}

/**
 * Checks each original fact against a rewrite.
 * Returns { facts: [{...fact, status: found|missing|unchecked}], missing, unchecked, passed, marks }.
 * "unchecked" = Latin-script names in a Devanagari rewrite, which may be transliterated.
 */
export function checkFacts(original, rewrite) {
  const facts = extractFacts(original);
  const idx = rewriteIndex(rewrite);
  const devanagariRewrite = isMostlyDevanagari(rewrite);

  const results = facts.map((fact) => {
    let status;
    if (fact.type === "name") {
      status = nameFound(fact, idx.lower) ? "found" : devanagariRewrite ? "unchecked" : "missing";
    } else {
      status = valueFound(fact, idx) ? "found" : "missing";
    }
    return { ...fact, status };
  });

  const missing = results.filter((f) => f.status === "missing");
  const unchecked = results.filter((f) => f.status === "unchecked");
  return {
    facts: results,
    found: results.length - missing.length - unchecked.length,
    missing,
    unchecked,
    passed: missing.length === 0,
    marks: factMarks(rewrite, results, idx),
  };
}

const numericValue = (key) => (/^(amount|percent|number):/.test(key) ? key.split(":").at(-1).replace(/[a-z]+$/, "") : null);

// Does a value span in the rewrite correspond to a preserved original fact?
function spanMatches(fact, span) {
  if (fact.key === span.key || timesMatch(fact.key, span.key)) return true;
  const a = numericValue(fact.key);
  return a !== null && a === numericValue(span.key);
}

/** Spans in the rewrite to highlight: preserved values and names. */
function factMarks(rewrite, results, idx) {
  const marks = [];
  const found = results.filter((f) => f.status === "found");
  for (const span of idx.values) {
    if (found.some((f) => f.type !== "name" && spanMatches(f, span))) {
      marks.push({ start: span.start, end: span.end, type: span.type });
    }
  }
  for (const f of results) {
    if (f.type !== "name" || f.status !== "found") continue;
    const re = new RegExp(String.raw`\b${escape(f.raw)}\b`, "gi");
    for (const m of rewrite.matchAll(re)) marks.push({ start: m.index, end: m.index + m[0].length, type: "name" });
  }
  marks.sort((a, b) => a.start - b.start || b.end - a.end);
  return marks.filter((m, i) => !marks.slice(0, i).some((p) => m.start < p.end && m.end > p.start));
}

export const describeFact = (f) => {
  const m = f.key.match(/^date:(\d+)-(\d+)$/);
  return m && f.raw.match(/[/.-]/) ? `${m[1]} ${MONTH_NAMES[Number(m[2])]}` : f.raw;
};
