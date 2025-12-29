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
YOUR TASK: ENGAGE first, then progressively collect info. Be genuinely curious.

**NEVER mention booking, Calendly, or scheduling. Focus on understanding their problem.**

COLLECTED: ${collectedFields.length > 0 ? collectedFields.join(", ") : "Nothing yet"}
${nextField ? `NEXT FIELD: ${nextField}` : "All info collected!"}
${fieldPromptHint}
ENGAGEMENT RULES:
1. First 2-3 exchanges: Focus ONLY on understanding their challenge. No info collection.
2. Show genuine curiosity - ask follow-up questions about their specific situation
3. Share relevant patterns/insights that prove you understand their space
4. After rapport is built (2-3 exchanges), naturally weave in info collection

CAPTURE SEQUENCE (after engagement):
- name → email → company → location → phone
- Never ask two things at once
- Make asks feel natural, not form-filling

EXAMPLE FLOW:
User: "We're looking at tech modernization"
Exchange 1: "Interesting timing - seeing a lot of movement here. What's driving this for you - competitive pressure or internal efficiency?" [NO ask yet]
Exchange 2: "Makes sense. The efficiency angle usually has clearer ROI. What does your current stack look like?" [still engaging]
Exchange 3: "That's exactly the setup I saw at 3 manufacturing clients. By the way - who am I talking with?" [NOW ask name]`;

    case "educator":
      return `${baseInstructions}
YOUR TASK: Share relevant experience with precision. Keep them engaged.

**Don't push to booking - let them drive that conversation.**

TEACHING RULES:
1. ONE case study or credential per response - don't list
2. Connect to their specific situation
3. Use exact numbers: "**130% growth**", "**3 patents**", "**50% lift**"
4. End with pull-through: "Want the breakdown?" or "Curious about the approach?"

${nextField ? `OPPORTUNITY TO COLLECT: ${nextField}${fieldPromptHint}` : ""}`;

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
