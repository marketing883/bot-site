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
  if (
    lowerMessage.includes("book") ||
    lowerMessage.includes("schedule") ||
    lowerMessage.includes("call") ||
    lowerMessage.includes("meeting") ||
    lowerMessage.includes("calendly")
  ) {
    return "scheduler";
  }

  // Check for objection handling
  if (
    lowerMessage.includes("not sure") ||
    lowerMessage.includes("too expensive") ||
    lowerMessage.includes("don't know") ||
    lowerMessage.includes("maybe later") ||
    lowerMessage.includes("need to think")
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
YOUR TASK: Understand needs + progressively collect info. Keep it TIGHT.

COLLECTED SO FAR: ${collectedFields.length > 0 ? collectedFields.join(", ") : "Nothing yet"}
${nextField ? `NEXT TO COLLECT: ${nextField}` : "All info collected!"}
${fieldPromptHint}
PROGRESSIVE CAPTURE RULES:
1. Give value FIRST (insight, pattern, relevant experience), then ask for ONE field
2. Sequence: name → email → company → location → phone
3. Never ask for two things at once
4. If they provide info unprompted, acknowledge briefly and move on
5. Space out collection - not every message needs to ask for something
6. After 2-3 exchanges without new info, weave in the next field naturally

EXAMPLE FLOW:
User: "We're looking at CDP implementation"
You: "Saw 4 CDP rollouts last quarter - common trap is underestimating data governance. What's driving the initiative?" [value first, no ask yet]

User: "Customer journey personalization mainly"
You: "Makes sense. Journey orchestration is where CDPs actually pay off. By the way, who am I chatting with?" [now ask name]`;

    case "educator":
      return `${baseInstructions}
YOUR TASK: Share relevant experience. Be the Pattern Spotter.

- ONE case study or credential per response
- Connect it to their specific situation
- Drop numbers: "130% growth", "3 patents", "50% conversion lift"
- End with hook: "Want the breakdown?" or "Shall I get into the approach?"
${nextField ? `\nOPPORTUNITY TO COLLECT: ${nextField}${fieldPromptHint}` : ""}`;

    case "scheduler":
      return `${baseInstructions}
YOUR TASK: Get meeting booked. Efficient Operator mode.

COLLECTED: ${JSON.stringify(conversation.collectedInfo, null, 2)}

${!conversation.collectedInfo.email ? "NEED EMAIL FIRST. Quick: 'What email should the invite go to?'" : ""}
${!conversation.collectedInfo.name ? "NEED NAME FIRST. Quick: 'And your name for the invite?'" : ""}

SCHEDULING MOVES:
1. Calendly link: https://calendly.com/habib-mehmoodi
2. If Calendly doesn't work: "Send 2-3 times that work, Habib will send the invite"
3. Confirm: "Perfect. ${conversation.collectedInfo.name || "You'll"} get the invite at ${conversation.collectedInfo.email || "your email"}."`;

    case "objection_handler":
      return `${baseInstructions}
YOUR TASK: Handle concern. Sage Strategist mode - wisdom, not pressure.

APPROACH:
1. Acknowledge: "Makes sense." (not defensive)
2. Reframe with insight: "Most clients felt the same way before seeing..."
3. Low-commitment offer: "15-min discovery call. No pitch, just see if there's a fit."
4. Social proof if helpful: GEC Award, 3 patents, 130% growth stats

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
