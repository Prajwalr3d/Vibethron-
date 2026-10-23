export type PersonaId = 'executive' | 'supportive' | 'legal' | 'genz';

export interface Persona {
  id: PersonaId;
  name: string;
  tagline: string;
  accentColor: string;
  badge: string;
  description: string;
  attributes: {
    formality: number; // 0-100
    warmth: number;    // 0-100
    directness: number;// 0-100
    velocity: number;  // 0-100
  };
}

export interface PresetSample {
  id: string;
  label: string;
  original: string;
  personaOutputs: Record<PersonaId, string[]>;
  intentLockNotes?: string;
}

export interface IntentRiskItem {
  id: string;
  category: 'commitments' | 'deadlines' | 'facts' | 'conditions' | 'negations';
  categoryLabel: string;
  riskLevel: 'critical' | 'moderate' | 'safe';
  originalSnippet: string;
  rewrittenSnippet: string;
  explanation: string;
  safeguardRecommendation: string;
}

export const PERSONAS: Persona[] = [
  {
    id: 'executive',
    name: 'Executive',
    tagline: 'Decisive • Concise • Boardroom-Ready',
    accentColor: '#FF2DA8',
    badge: 'BOARDROOM',
    description: 'Eliminates emotional friction, focuses squarely on strategic timelines, revenue outcomes, and clear ownership.',
    attributes: { formality: 92, warmth: 35, directness: 90, velocity: 85 }
  },
  {
    id: 'supportive',
    name: 'Supportive',
    tagline: 'Empathetic • Collaborative • Constructive',
    accentColor: '#D4FF3F',
    badge: 'LEADERSHIP',
    description: 'Validates team workload, offers partnership, frames obstacles as shared challenges, and preserves psychological safety.',
    attributes: { formality: 60, warmth: 95, directness: 65, velocity: 60 }
  },
  {
    id: 'legal',
    name: 'Legal & Risk',
    tagline: 'Defensive • Qualified • Non-Binding',
    accentColor: '#FFFFFF',
    badge: 'COMPLIANCE',
    description: 'Eliminates implied warranties, qualifies assertions with explicit conditions, and maintains strict liability boundaries.',
    attributes: { formality: 98, warmth: 20, directness: 80, velocity: 40 }
  },
  {
    id: 'genz',
    name: 'Gen-Z Velocity',
    tagline: 'Casual • High-Energy • Frictionless',
    accentColor: '#D4FF3F',
    badge: 'INTERNAL SLACK',
    description: 'Strips corporate boilerplate for rapid async Slack exchanges, authentic energy, and zero pretension.',
    attributes: { formality: 20, warmth: 85, directness: 95, velocity: 98 }
  }
];

export const PRESET_SAMPLES: PresetSample[] = [
  {
    id: 'late-work',
    label: 'Late Deliverable',
    original: 'Your work is late. Finish it quickly.',
    personaOutputs: {
      executive: [
        'The deliverable is behind schedule. Please share an updated timeline and milestone completion ETA today.',
        'We have missed our delivery target. Please clarify any blockers and provide an updated delivery schedule.'
      ],
      supportive: [
        'I noticed the work is taking longer than expected. Is there anything I can help with to get us across the finish line?',
        'Checking in on this milestone. Let me know if you need additional bandwidth or if any blockers have surfaced.'
      ],
      legal: [
        'Please be advised that the deliverable remains outstanding past the agreed schedule. Provide a written remediation status without prejudice.',
        'Notice of delayed deliverable: Kindly submit an amended timetable for delivery, subject to contractual review.'
      ],
      genz: [
        'Hey, we\'re running behind on this! Let\'s get it wrapped up ASAP so we\'re all set.',
        'Quick nudge on this one — let\'s power through and get it over the line today!'
      ]
    },
    intentLockNotes: 'Maintains timeline urgency without altering contractual penalty triggers.'
  },
  {
    id: 'tentative-deadline',
    label: 'Tentative Deadline & Approval',
    original: 'I might finish the project by Friday, but I need approval first.',
    personaOutputs: {
      executive: [
        'Target completion is Friday, contingent upon receipt of stakeholder approval by Wednesday EOD.',
        'Projecting Friday completion provided executive approval is secured within 24 hours.'
      ],
      supportive: [
        'I am aiming to wrap this up by Friday, as long as we can get approval in time. Let me know if you need anything from me first!',
        'Hoping to deliver Friday once we secure the necessary sign-off. Happy to walk through any questions to expedite approval.'
      ],
      legal: [
        'Estimated completion is tentatively targeted for Friday, expressly subject to and conditioned upon formal prior approval.',
        'Target date of Friday is non-binding and contingent upon timely written authorization from all designated authorities.'
      ],
      genz: [
        'Aiming to have this done by Friday, assuming we get the green light! LMK when approved.',
        'Should be good for Friday once we get the thumbs up on approval!'
      ]
    },
    intentLockNotes: 'IntentLock alert: Original expressed uncertainty ("might") and explicit prerequisite ("need approval first").'
  },
  {
    id: 'budget-rejection',
    label: 'Budget Pushback',
    original: 'This proposal is bad and we can\'t afford it.',
    personaOutputs: {
      executive: [
        'The current proposal does not align with our financial targets or expected ROI. Let us revisit scope to fit existing budget parameters.',
        'This initiative exceeds our current capital allocation. Please submit a scaled-down proposal focusing on essential deliverables.'
      ],
      supportive: [
        'Thank you for putting this together. While the cost is currently beyond our allocated budget, I\'d love to look at alternative ways we could phase this in.',
        'I appreciate the thought here. Let\'s see where we can adjust the scope together so it fits comfortably within our current resources.'
      ],
      legal: [
        'The proposed terms and financial commitments exceed authorized budgetary limits and cannot be accepted in their current form without modification.',
        'Please be advised that the proposed cost schedule is rejected due to budget non-conformance. No contractual obligation is incurred.'
      ],
      genz: [
        'Looked over the numbers — this is way outside what we can spend right now. Can we trim the scope and make it fit?',
        'Cool concept, but budget-wise it\'s a bit too steep for this quarter. Let\'s look at a lite version!'
      ]
    },
    intentLockNotes: 'Guards budget reality without introducing promises to fund future iterations.'
  },
  {
    id: 'missing-update',
    label: 'Missing Status Update',
    original: 'Why wasn\'t this done yesterday? Send me the file now.',
    personaOutputs: {
      executive: [
        'Please provide an immediate status update on yesterday\'s scheduled deliverable and attach the current working draft.',
        'I need visibility on the delayed file from yesterday. Please transmit the latest revision for executive review.'
      ],
      supportive: [
        'I was hoping to review this yesterday — did anything unexpected pop up? Please send over whatever you have so far so I can take a look.',
        'Hope all is well. Just following up on the file from yesterday; whenever you have a moment, please share the current version.'
      ],
      legal: [
        'This inquiry serves as formal request for the overdue work product scheduled for delivery yesterday. Transmit the referenced file immediately.',
        'Delivery was anticipated yesterday. Please submit the documentation without further delay to avoid downstream operational impact.'
      ],
      genz: [
        'Hey! Thought this was landing yesterday — shoot over the file whenever you can so I can dive in.',
        'Quick ping on yesterday\'s file! Could you drop the link here when you get a second?'
      ]
    },
    intentLockNotes: 'Preserves the fact of missing delivery without creating retaliatory exposure.'
  }
];

export const INTENTLOCK_DEMO_CASE = {
  original: 'I might finish the project by Friday, but I need approval first.',
  riskyRewrite: 'I will deliver the completed project by Friday.',
  safeAlternative: 'I expect to finish by Friday, subject to approval.',
  risks: [
    {
      id: 'r1',
      category: 'commitments' as const,
      categoryLabel: 'Commitments & Promises',
      riskLevel: 'critical' as const,
      originalSnippet: 'might finish',
      rewrittenSnippet: 'will deliver',
      explanation: 'Changed speculative intention ("might") to an unconditional binding delivery commitment ("will").',
      safeguardRecommendation: 'Use "expect to finish" or "targeting Friday" to prevent promissory estoppel.'
    },
    {
      id: 'r2',
      category: 'conditions' as const,
      categoryLabel: 'Conditions & Approvals',
      riskLevel: 'critical' as const,
      originalSnippet: 'need approval first',
      rewrittenSnippet: '[REMOVED]',
      explanation: 'Stripped mandatory prerequisite dependency ("need approval first"), transferring entire delay liability to author.',
      safeguardRecommendation: 'Always preserve conditional clauses ("subject to approval" / "contingent upon").'
    },
    {
      id: 'r3',
      category: 'negations' as const,
      categoryLabel: 'Negations & Uncertainty',
      riskLevel: 'moderate' as const,
      originalSnippet: 'uncertainty flag',
      rewrittenSnippet: 'absolute certainty',
      explanation: 'Eliminated author\'s communicated buffer against unforeseen operational blockers.',
      safeguardRecommendation: 'Retain probability qualifiers for unfinalized milestones.'
    }
  ]
};

export const INTENTLOCK_PILLARS = [
  {
    id: 'commitments',
    title: 'Commitments & Promises',
    shortCode: '01 / COM',
    color: '#FF2DA8',
    description: 'Detects when polite rewrites accidentally turn "we will look into it" into enforceable guarantees or contractual promises.',
    detectionRule: 'Guards modal verbs (will vs may/can), warranty phrases, and scope assurances.'
  },
  {
    id: 'deadlines',
    title: 'Deadlines & Dates',
    shortCode: '02 / DDL',
    color: '#D4FF3F',
    description: 'Prevents target dates from hardening into firm contractual deadlines, or timezone slippage across business days.',
    detectionRule: 'Validates target dates, SLA expectations, milestones, and temporal qualifiers.'
  },
  {
    id: 'facts',
    title: 'Facts & Numbers',
    shortCode: '03 / NUM',
    color: '#FFFFFF',
    description: 'Ensures metrics, dollar figures, inventory numbers, and empirical data remain 100% faithful without AI hallucination.',
    detectionRule: 'Strict numerical matching, unit checks, and currency consistency guards.'
  },
  {
    id: 'conditions',
    title: 'Conditions & Approvals',
    shortCode: '04 / CND',
    color: '#FF3B30',
    description: 'Prevents the accidental omission of prerequisite sign-offs, legal reviews, and client co-dependencies.',
    detectionRule: 'Scans for conditional subordinators ("if", "subject to", "pending", "provided that").'
  },
  {
    id: 'negations',
    title: 'Negations & Uncertainty',
    shortCode: '05 / UNC',
    color: '#A8A8A8',
    description: 'Preserves critical doubts, disclaimers, or "do not" directives that AI models frequently invert or soften.',
    detectionRule: 'Dual-polarity negation verification and uncertainty index analysis.'
  }
];
