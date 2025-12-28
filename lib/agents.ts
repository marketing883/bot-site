// Agent system for intelligent conversation handling

import { Conversation, Lead } from "./db";

export type AgentMode = "qualifier" | "educator" | "scheduler" | "objection_handler";

// Fields we need to collect for a lead
const REQUIRED_FIELDS: (keyof Lead)[] = ["name", "email", "company"];
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

// Get the next field to collect
export function getNextFieldToCollect(
  collectedInfo: Partial<Lead>
): keyof Lead | null {
  // First check required fields
  for (const field of REQUIRED_FIELDS) {
    if (!collectedInfo[field]) {
      return field;
    }
  }

  // Then optional fields
  for (const field of OPTIONAL_FIELDS) {
    if (!collectedInfo[field]) {
      return field;
    }
  }

  return null;
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

// Generate agent-specific system prompt additions
export function getAgentPromptAdditions(
  mode: AgentMode,
  conversation: Conversation,
  nextField: keyof Lead | null
): string {
  const baseInstructions = `
CURRENT AGENT MODE: ${mode.toUpperCase()}
`;

  switch (mode) {
    case "qualifier":
      return `${baseInstructions}
YOUR TASK: Understand the visitor's needs and gently collect their information.

INFORMATION COLLECTED SO FAR:
${JSON.stringify(conversation.collectedInfo, null, 2)}

${nextField ? `NEXT FIELD TO COLLECT: ${nextField}` : "All required info collected!"}

COLLECTION APPROACH:
- DON'T ask for info like a form. Weave it naturally into conversation.
- After understanding their challenge, say something like "I'd love to have Habib follow up with you - what's the best email to reach you?"
- For name: "By the way, I didn't catch your name!"
- For company: "What company are you with?"
- For location: "Where are you based?"
- Only ask ONE piece of info at a time.
- If they already shared info (like in an email signature format), acknowledge you have it.`;

    case "educator":
      return `${baseInstructions}
YOUR TASK: Share relevant information about Habib's experience and capabilities.

Keep responses focused and relevant. Use specific examples from the knowledge base.
Don't overwhelm - share ONE case study or credential at a time.
After sharing, ask if they'd like to learn more or discuss their specific situation.`;

    case "scheduler":
      return `${baseInstructions}
YOUR TASK: Help schedule a meeting with Habib.

INFORMATION COLLECTED:
${JSON.stringify(conversation.collectedInfo, null, 2)}

${!conversation.collectedInfo.email ? "IMPORTANT: We still need their email before scheduling." : ""}
${!conversation.collectedInfo.name ? "IMPORTANT: We still need their name before scheduling." : ""}

SCHEDULING APPROACH:
1. If missing name/email, collect those first naturally.
2. If Calendly works for them, provide the link.
3. If they can't use Calendly, ask for 2-3 preferred times and say Habib will send a calendar invite.
4. Confirm all details before ending.`;

    case "objection_handler":
      return `${baseInstructions}
YOUR TASK: Address concerns and provide reassurance.

APPROACH:
- Acknowledge their concern genuinely
- Provide relevant social proof (awards, results, testimonials)
- Don't be pushy - offer a low-commitment next step
- Example: "Totally understand. Many clients started with just a quick discovery call to see if there's a fit. No commitment - would that work for you?"`;

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
