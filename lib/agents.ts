// Agent system for intelligent conversation handling

import { Conversation, Lead } from "./db";

export type AgentMode = "qualifier" | "educator" | "scheduler" | "objection_handler";

// Progressive lead capture order: name → email → company → location → phone
// Collect in this exact sequence for natural conversation flow
const LEAD_CAPTURE_SEQUENCE: (keyof Lead)[] = [
  "name",       // Start casual - "By the way, I didn't catch your name"
  "email",      // Natural follow-up - "What's the best email for Habib to reach you?"
  "company",    // Build context - "And which company are you with?"
  "location",   // Geographic context - "Where are you based?"
  "phone",      // Optional convenience - "Want to add a number for a quick call?"
];

// Required for lead to be "complete" (enough to save)
const REQUIRED_FIELDS: (keyof Lead)[] = ["name", "email", "company"];
// Additional fields to capture if conversation continues
const OPTIONAL_FIELDS: (keyof Lead)[] = ["phone", "location", "challenge", "serviceArea"];

// Determine which agent should handle the conversation
export function determineAgentMode(
  conversation: Conversation,
  userMessage: string
): AgentMode {
  const lowerMessage = userMessage.toLowerCase();
  const collectedInfo = conversation.collectedInfo;

  // Check if we should switch to scheduler mode
  // STRICT: Only when user EXPLICITLY wants to book, not casual mentions
  const schedulingPhrases = [
    "book a call",
    "book a meeting",
    "schedule a call",
    "schedule a meeting",
    "set up a call",
    "set up a meeting",
    "talk to habib",
    "speak with habib",
    "meet with habib",
    "calendly",
    "let's schedule",
    "can we meet",
    "available for a call",
    "get on a call",
  ];
  if (schedulingPhrases.some(phrase => lowerMessage.includes(phrase))) {
    return "scheduler";
  }

  // Check for objection handling (expanded detection)
  if (
    lowerMessage.includes("not sure") ||
    lowerMessage.includes("too expensive") ||
    lowerMessage.includes("don't know") ||
    lowerMessage.includes("maybe later") ||
    lowerMessage.includes("need to think") ||
    lowerMessage.includes("not ready") ||
    lowerMessage.includes("budget") ||
    lowerMessage.includes("timing") ||
    lowerMessage.includes("convince") ||
    lowerMessage.includes("skeptical")
  ) {
    return "objection_handler";
  }

  // Check for education requests
  if (
    lowerMessage.includes("tell me about") ||
    lowerMessage.includes("what is") ||
    lowerMessage.includes("how does") ||
    lowerMessage.includes("case study") ||
    lowerMessage.includes("example") ||
    lowerMessage.includes("experience")
  ) {
    return "educator";
  }

  // Default to qualifier if we haven't collected enough info
  const hasBasicInfo = collectedInfo.name && collectedInfo.email && collectedInfo.company;
  if (!hasBasicInfo) {
    return "qualifier";
  }

  return conversation.agentMode;
}

// Get the next field to collect following the progressive sequence
export function getNextFieldToCollect(
  collectedInfo: Partial<Lead>
): keyof Lead | null {
  // Follow the progressive capture sequence: name → email → company → location → phone
  for (const field of LEAD_CAPTURE_SEQUENCE) {
    if (!collectedInfo[field]) {
      return field;
    }
  }
  return null;
}

// Get how many fields have been collected (for context)
export function getLeadProgress(collectedInfo: Partial<Lead>): {
  collected: number;
  total: number;
  percentage: number;
} {
  const collected = LEAD_CAPTURE_SEQUENCE.filter(f => !!collectedInfo[f]).length;
  return {
    collected,
    total: LEAD_CAPTURE_SEQUENCE.length,
    percentage: Math.round((collected / LEAD_CAPTURE_SEQUENCE.length) * 100),
  };
}

// Check if lead info is complete enough to save
export function isLeadComplete(collectedInfo: Partial<Lead>): boolean {
  return REQUIRED_FIELDS.every((field) => !!collectedInfo[field]);
}

// Extract information from user message
export function extractInfoFromMessage(
  message: string,
  expectedField?: keyof Lead
): Partial<Lead> {
  const extracted: Partial<Lead> = {};
  const lowerMessage = message.toLowerCase();

  // Email extraction
  const emailMatch = message.match(/[\w.-]+@[\w.-]+\.\w+/);
  if (emailMatch) {
    extracted.email = emailMatch[0];
  }

  // Phone extraction (various formats)
  const phoneMatch = message.match(/[\+]?[\d\s\-\(\)]{10,}/);
  if (phoneMatch) {
    extracted.phone = phoneMatch[0].trim();
  }

  // If we're expecting a specific field and got a short answer
  if (expectedField && message.length < 100) {
    switch (expectedField) {
      case "name":
        // If no email/phone found, assume it's a name
        if (!extracted.email && !extracted.phone) {
          extracted.name = message.trim();
        }
        break;
      case "company":
        if (!extracted.email && !extracted.phone) {
          extracted.company = message.trim();
        }
        break;
      case "location":
        if (!extracted.email && !extracted.phone) {
          extracted.location = message.trim();
        }
        break;
      case "challenge":
        extracted.challenge = message.trim();
        break;
    }
  }

  // Service area detection
  if (lowerMessage.includes("gtm") || lowerMessage.includes("go-to-market") || lowerMessage.includes("go to market")) {
    extracted.serviceArea = "Go-to-Market Strategy";
  } else if (lowerMessage.includes("ai") || lowerMessage.includes("artificial intelligence")) {
    extracted.serviceArea = "AI Platform Strategy";
  } else if (lowerMessage.includes("expand") || lowerMessage.includes("market")) {
    extracted.serviceArea = "Market Expansion";
  } else if (lowerMessage.includes("speak") || lowerMessage.includes("keynote")) {
    extracted.serviceArea = "Speaking & Thought Leadership";
  }

  return extracted;
}

// Natural prompts for each field in the progressive capture sequence
const FIELD_PROMPTS: Record<string, string[]> = {
  name: [
    "By the way, who am I chatting with?",
    "Didn't catch your name!",
    "What should I call you?",
  ],
  email: [
    "What's a good email for Habib to reach you?",
    "Drop your email - Habib can send over some relevant stuff.",
    "Best email for follow-up?",
  ],
  company: [
    "Which company are you with?",
    "And the company?",
    "Where do you work?",
  ],
  location: [
    "Where are you based?",
    "What part of the world are you in?",
    "Your timezone? (So Habib knows when to call)",
  ],
  phone: [
    "Got a number for a quick call?",
    "Phone for scheduling?",
    "Prefer a call? What's your number?",
  ],
};

// Generate agent-specific system prompt additions
export function getAgentPromptAdditions(
  mode: AgentMode,
  conversation: Conversation,
  nextField: keyof Lead | null
): string {
  const progress = getLeadProgress(conversation.collectedInfo);
  const collectedFields = LEAD_CAPTURE_SEQUENCE.filter(f => !!conversation.collectedInfo[f]);

  const baseInstructions = `
CURRENT AGENT MODE: ${mode.toUpperCase()}
LEAD PROGRESS: ${progress.collected}/${progress.total} fields (${progress.percentage}%)
`;

  const fieldPromptHint = nextField && FIELD_PROMPTS[nextField]
    ? `\nNATURAL WAYS TO ASK FOR ${nextField.toUpperCase()}:\n- "${FIELD_PROMPTS[nextField][0]}"\n- "${FIELD_PROMPTS[nextField][1]}"\n- "${FIELD_PROMPTS[nextField][2]}"\n`
    : "";

  switch (mode) {
    case "qualifier":
      return `${baseInstructions}
YOUR TASK: Understand their situation while naturally gathering info. Be genuinely curious.

COLLECTED: ${collectedFields.length > 0 ? collectedFields.join(", ") : "Nothing yet"}
${nextField ? `NEXT FIELD: ${nextField}` : "All info collected!"}
${fieldPromptHint}
FLOW:
1. First response: Acknowledge their situation + insight + ask for NAME
2. After name: Use it, dig deeper into challenge, ask for EMAIL
3. Continue understanding their needs, weave in company/location naturally
4. When conversation has momentum and you understand their need, offer to connect with Habib

NATURAL ASKS:
- Name: "Who am I chatting with?" / "Quick - who's this?"
- Email: "What's a good email to keep this going?" / "Best email for follow-up?"
- Company: "And which company?" / "Where are you based?"

EXAMPLE:
User: "We need help with our GTM strategy"
You: "GTM challenges - always comes down to positioning or pipeline. Seeing both a lot lately.

Which feels more like your pain point? And who am I chatting with?"`;

    case "educator":
      return `${baseInstructions}
YOUR TASK: Share relevant experience with precision. Keep them engaged and curious.

TEACHING RULES:
1. ONE case study or credential per response - don't dump everything
2. Connect it to their specific situation
3. Use exact numbers: "**130% growth**", "**3 patents**", "**50% lift**"
4. End with pull-through: "Want the breakdown?" or "Curious about the approach?"
5. If conversation has momentum, naturally suggest talking to Habib

${nextField ? `ALSO COLLECT: ${nextField}${fieldPromptHint}` : ""}`;

    case "scheduler":
      return `${baseInstructions}
YOUR TASK: Book the meeting. Be efficient.

HAVE: ${Object.keys(conversation.collectedInfo).filter(k => conversation.collectedInfo[k as keyof typeof conversation.collectedInfo]).join(", ") || "nothing"}
${!conversation.collectedInfo.email ? "NEED EMAIL: 'What email for the invite?'" : ""}
${!conversation.collectedInfo.name ? "NEED NAME: 'Name for the calendar invite?'" : ""}

BOOKING SCRIPT:
1. Calendly: https://calendly.com/habib-mehmoodi
2. Fallback: "Send 2-3 times, Habib will confirm"
3. Confirm: "Done. ${conversation.collectedInfo.name || "You"}'ll get it at ${conversation.collectedInfo.email || "your email"}."`;

    case "objection_handler":
      return `${baseInstructions}
YOUR TASK: Address concern without pressure.

SCRIPT:
1. Validate: "Makes sense." (not defensive)
2. Reframe: "Most felt the same before seeing [specific result]..."
3. Low-bar offer: "15-min call. No pitch - just see if there's fit."
4. Proof if needed: GEC Award, **3 patents**, **130% growth**

${nextField ? `IF THEY WARM UP, COLLECT: ${nextField}` : ""}`;

    default:
      return baseInstructions;
  }
}

// Parse assistant response for any actions to take
export function parseAssistantResponse(response: string): {
  shouldSaveLead: boolean;
  detectedInfo: Partial<Lead>;
} {
  // Check if assistant confirmed scheduling or captured info
  const shouldSaveLead =
    response.toLowerCase().includes("i'll have habib reach out") ||
    response.toLowerCase().includes("calendar invite") ||
    response.toLowerCase().includes("we'll be in touch") ||
    response.toLowerCase().includes("thanks for sharing");

  return {
    shouldSaveLead,
    detectedInfo: {},
  };
}
