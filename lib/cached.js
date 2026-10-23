// Offline demo mode: hand-written results for the three sample drafts, used
// automatically when an AI call fails. Meaning Match and Fact Guard still run
// live on these texts. The Gen-Z rewrite of the feedback sample drops "9 AM"
// on purpose, so the demo shows Fact Guard catching a missing fact.
import { SAMPLES } from "./samples";
import { VIBES } from "./vibes";

const t = (formality, warmth, urgency, directness) => ({ formality, warmth, urgency, directness });

const vibe = (id, text, tone, meaning_score, intent, intent_note, risks, reaction, intent_preserved = true) => ({
  id,
  name: VIBES.find((v) => v.id === id).name,
  text,
  tone,
  meaning_score,
  intent,
  intent_preserved,
  intent_note,
  risks,
  reaction,
});

const DATA = {
  vendor: {
    original_intent: "Get the missing 35 chairs delivered by 28 March, or a ₹14,200 refund, before the 30 March event.",
    original_tone: { label: "Angry", confidence: 91, ...t(30, 8, 92, 95) },
    vibes: [
      vibe(
        "executive",
        "Rajesh,\n\nBottom line: we paid ₹48,500 on 3 March for 120 chairs from Sharma Furniture, and only 85 arrived on 18 March against a promised 15 March delivery. Please deliver the remaining 35 chairs by Friday 28 March or refund ₹14,200. Our event at Hotel Leela is on 30 March at 6:30 PM, so this date is firm.\n\nPriya Mehta",
        t(78, 30, 85, 92), 93,
        "Secure the remaining chairs or a refund before the event.",
        "Same demand and deadline, stated without the anger.",
        ["Drops the 'third time this month' history"],
        "Rajesh will likely treat this as a priority and confirm a delivery date."
      ),
      vibe(
        "peer",
        "Hi Rajesh,\n\nI know things get hectic, but I need your help here. We paid ₹48,500 on 3 March for 120 chairs from Sharma Furniture, and only 85 came on 18 March, after the 15 March date we agreed. Could you get the other 35 chairs to us by Friday 28 March? If that's not possible, a refund of ₹14,200 works. Our event at Hotel Leela is on 30 March at 6:30 PM, so I'm counting on you.\n\nThanks,\nPriya Mehta",
        t(45, 82, 70, 58), 90,
        "Get the chairs or a refund while keeping the relationship warm.",
        "Still asks for the 35 chairs by 28 March or a refund.",
        ["The deadline could read as optional"],
        "Rajesh will feel less attacked and is likely to reply quickly."
      ),
      vibe(
        "legal",
        "Dear Rajesh,\n\nThis note records the following. On 3 March we paid ₹48,500 to Sharma Furniture for 120 chairs, with delivery committed for 15 March. On 18 March, 85 chairs were delivered. We request delivery of the remaining 35 chairs by Friday 28 March or, alternatively, a refund of ₹14,200. The chairs are required for our event at Hotel Leela on 30 March at 6:30 PM.\n\nRegards,\nPriya Mehta",
        t(95, 18, 72, 85), 92,
        "Put the shortfall and the remedy on record.",
        "Same remedy and deadline, phrased as a formal record.",
        ["May feel cold for a vendor you work with often"],
        "Rajesh will read this as escalation and respond formally."
      ),
      vibe(
        "genz",
        "Rajesh!! ok real talk, we paid ₹48,500 on 3 March for 120 chairs from Sharma Furniture and only 85 showed up on 18 March (promised 15 March btw). Need the other 35 by Friday 28 March or just refund ₹14,200. Hotel Leela event is 30 March at 6:30 PM so let's lock this in.\n\nPriya Mehta",
        t(10, 62, 78, 80), 84,
        "Get the chairs or refund, casually but clearly.",
        "The ask and deadline survive the casual tone.",
        ["Too casual for a vendor dispute", "Could be taken less seriously"],
        "Rajesh may reply fast but might not treat it as urgent."
      ),
    ],
    grammar: [
      { original_phrase: "showed up", suggestion: "were delivered", type: "clarity", reason: "More precise for a delivery record." },
      { original_phrase: "I am done chasing you", suggestion: "I need this resolved now", type: "clarity", reason: "Reads as a threat; a firm request lands better." },
    ],
  },

  update: {
    original_intent: "Report week 12 progress on Project Atlas and flag the Razorpay blocker that could delay launch.",
    original_tone: { label: "Matter-of-fact", confidence: 84, ...t(55, 35, 60, 85) },
    vibes: [
      vibe(
        "executive",
        "Project Atlas, week 12. Login revamp shipped on 14 Oct, two days late. Open bugs fell from 47 to 19. The Payments API is blocked on Razorpay sandbox access, pending since 9 Oct; if access doesn't land by 25 Oct, launch slips to 15 Nov. Budget: $18,400 of $25,000 spent (73.6%). Ananya is out 21-24 Oct with Karan covering QA. The demo to Mr. Verma is now 31 Oct, 11:00 AM.",
        t(72, 25, 70, 92), 92,
        "Give leadership the status and the launch risk in one read.",
        "Leads with the blocker that threatens the launch date.",
        ["Dense; little context for anyone new to the project"],
        "Mr. Verma will focus on the Razorpay blocker and may offer to escalate."
      ),
      vibe(
        "peer",
        "Hey team, quick week 12 update on Project Atlas! The login revamp went live on 14 Oct, just 2 days late, and open bugs are down from 47 to 19. Great work. We're still waiting on Razorpay sandbox access for the Payments API, requested on 9 Oct. We've spent $18,400 of $25,000 (73.6%). Ananya is out 21-24 Oct and Karan is covering QA, thanks Karan! The demo with Mr. Verma moved to 31 Oct at 11:00 AM. If API access isn't in by 25 Oct, launch moves to 15 Nov.",
        t(35, 85, 55, 60), 89,
        "Share progress, credit the team and flag the blocker.",
        "Keeps every status item and the launch risk.",
        ["The launch risk is buried at the end"],
        "The team will feel recognised; the blocker may get less attention."
      ),
      vibe(
        "legal",
        "Status report, Project Atlas, week 12. The login revamp was released on 14 Oct, 2 days after schedule. Open defects decreased from 47 to 19. The Payments API remains blocked pending Razorpay sandbox access, requested on 9 Oct. Expenditure stands at $18,400 of a $25,000 budget (73.6%). Ananya is unavailable 21-24 Oct; Karan will cover QA. The demo to Mr. Verma is rescheduled to 31 Oct, 11:00 AM. Should API access not be granted by 25 Oct, launch will move to 15 Nov.",
        t(94, 15, 60, 88), 93,
        "Record project status and the dependency on Razorpay.",
        "Same facts, documented as a dependency and its consequence.",
        [],
        "Readers will treat the Razorpay dependency as a documented risk."
      ),
      vibe(
        "genz",
        "Project Atlas week 12 drop: login revamp shipped 14 Oct (2 days late, whatever). Bugs went from 47 to 19, huge. Payments API still stuck waiting on Razorpay sandbox since 9 Oct. Budget at $18,400 of $25,000, 73.6%. Ananya off 21-24 Oct, Karan on QA. Mr. Verma demo now 31 Oct 11:00 AM. No API by 25 Oct means launch slides to 15 Nov.",
        t(8, 60, 55, 82), 83,
        "Share the update in a fast, casual format.",
        "Every update item survives, including the launch risk.",
        ["'whatever' undercuts the delay"],
        "Readers will skim it fast; leadership may find it too flippant."
      ),
    ],
    grammar: [
      { original_phrase: "Open bugs down from 47 to 19", suggestion: "Open bugs are down from 47 to 19", type: "grammar", reason: "The bullet is missing its verb." },
      { original_phrase: "does not land", suggestion: "is not granted", type: "clarity", reason: "'Land' is informal for access being granted." },
    ],
  },

  feedback: {
    original_intent: "Get Vikram to fix the report by Thursday and stop submitting late, before the Deloitte call.",
    original_tone: { label: "Frustrated", confidence: 88, ...t(40, 12, 85, 96) },
    vibes: [
      vibe(
        "executive",
        "Vikram, the sprint report was late again: due Monday 9 AM, delivered Wednesday 4 PM. Two of the five charts had wrong figures; Q2 revenue is ₹3.2 crore, not ₹2.3 crore. I can't present this at the Deloitte call on 12 November. Please fix it by Thursday and have Neha review it before sending. This is the third time since August.",
        t(75, 20, 85, 95), 94,
        "Get a corrected report by Thursday and flag the pattern.",
        "Same correction, deadline and review step.",
        ["Very blunt for one-to-one feedback"],
        "Vikram will fix it but may feel called out."
      ),
      vibe(
        "peer",
        "Hey Vikram, I want to flag something so we can sort it out together. The sprint report was due Monday 9 AM but came in Wednesday at 4 PM, and two of the five charts had wrong numbers: Q2 revenue should be ₹3.2 crore, not ₹2.3 crore. We have the Deloitte call on 12 November, so I can't use it as is. Could you fix it by Thursday and run it past Neha first? This has happened three times since August, so let's talk about what would help.",
        t(40, 85, 65, 62), 86,
        "Get the fix while opening a conversation about the pattern.",
        "Still asks for a Thursday fix and Neha's review.",
        ["Softness may hide how serious the pattern is"],
        "Vikram will likely respond well and suggest what's blocking him."
      ),
      vibe(
        "legal",
        "Vikram, this records that the sprint report due Monday 9 AM was submitted Wednesday at 4 PM. Two of the five charts contained incorrect figures; Q2 revenue is ₹3.2 crore, not ₹2.3 crore. The report cannot be presented at the Deloitte client call on 12 November in its current form. Corrections are required by Thursday, with review by Neha before submission. This is the third late submission since August.",
        t(96, 10, 75, 90), 91,
        "Document the late, inaccurate report and the required correction.",
        "Same requirements, written as a performance record.",
        ["Reads like a formal warning"],
        "Vikram may read this as the start of a performance process."
      ),
      vibe(
        "genz",
        "Vikram, the sprint report landed late again, due Monday morning, showed up Wednesday 4 PM. Two of the five charts are off: Q2 revenue is ₹3.2 crore, not ₹2.3 crore. Deloitte call is 12 November and I can't show this. Fix it by Thursday and get Neha to check it first. Third time since August, gotta stop.",
        t(12, 45, 80, 88), 85,
        "Get the fix by Thursday, casually.",
        "The fix, deadline and review step survive.",
        ["Loses the exact 9 AM deadline", "Casual tone may undercut a third warning"],
        "Vikram will get the message but may not take the pattern seriously."
      ),
    ],
    grammar: [
      { original_phrase: "came in Wednesday", suggestion: "came in on Wednesday", type: "grammar", reason: "Add 'on' before the day." },
      { original_phrase: "I can't present this", suggestion: "I can't present it as it is", type: "clarity", reason: "Says exactly what needs to change." },
    ],
  },
};

const sampleIdFor = (text) => SAMPLES.find((s) => s.text.trim() === String(text ?? "").trim())?.id;

/** Saved results for a sample draft, or null for anything else. */
export function cachedTransform(text) {
  const d = DATA[sampleIdFor(text)];
  return d ? { original_intent: d.original_intent, original_tone: d.original_tone, vibes: d.vibes } : null;
}

export function cachedTone(text) {
  const d = DATA[sampleIdFor(text)];
  return d ? { original_intent: d.original_intent, original_tone: d.original_tone } : null;
}

/** Raw grammar issues (phrases only); locate them with locateIssues. */
export function cachedGrammar(text) {
  return DATA[sampleIdFor(text)]?.grammar ?? null;
}
