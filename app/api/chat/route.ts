import { NextRequest, NextResponse } from "next/server";
import { CanvasType, Intent, ExtractedContext, ApiResponse } from "@/lib/types";

// Intent keywords mapping
const intentKeywords: Record<Intent, string[]> = {
  "ai-strategy": [
    "ai",
    "artificial intelligence",
    "machine learning",
    "ml",
    "data",
    "snowflake",
    "platform",
    "architecture",
    "governance",
    "enterprise ai",
    "ai strategy",
    "data strategy",
    "ai platform",
    "llm",
    "large language model",
    "gpt",
    "claude",
    "generative ai",
    "gen ai",
  ],
  speaking: [
    "speaker",
    "speaking",
    "keynote",
    "conference",
    "event",
    "panel",
    "talk",
    "presentation",
    "workshop",
    "summit",
    "forum",
    "webinar",
    "podcast",
  ],
  gtm: [
    "go to market",
    "gtm",
    "marketing",
    "sales",
    "conversion",
    "pipeline",
    "demand generation",
    "demand gen",
    "positioning",
    "messaging",
    "funnel",
    "lead generation",
    "leads",
    "revenue",
    "growth",
  ],
  "market-expansion": [
    "expansion",
    "expand",
    "international",
    "global",
    "new market",
    "region",
    "europe",
    "eu",
    "mena",
    "middle east",
    "africa",
    "asia",
    "apac",
    "gdpr",
    "compliance",
    "partnership",
    "channel",
  ],
  "case-study": [
    "case study",
    "example",
    "portfolio",
    "past work",
    "previous work",
    "results",
    "success story",
  ],
  general: [
    "help",
    "services",
    "what do you do",
    "about",
    "who are you",
    "background",
  ],
  unknown: [],
};

// Industry extraction patterns
const industryPatterns: Record<string, string[]> = {
  retail: ["retail", "ecommerce", "e-commerce", "shopping", "store"],
  fintech: ["fintech", "financial", "banking", "payments", "aml", "compliance"],
  healthcare: ["healthcare", "health", "medical", "pharma", "hospital"],
  saas: ["saas", "software", "platform", "b2b", "enterprise software"],
  regtech: ["regtech", "regulatory", "compliance", "legal tech"],
};

function classifyIntent(message: string): Intent {
  const lowerMessage = message.toLowerCase();

  // Check each intent category
  const scores: Record<Intent, number> = {
    "ai-strategy": 0,
    speaking: 0,
    gtm: 0,
    "market-expansion": 0,
    "case-study": 0,
    general: 0,
    unknown: 0,
  };

  for (const [intent, keywords] of Object.entries(intentKeywords)) {
    for (const keyword of keywords) {
      if (lowerMessage.includes(keyword)) {
        scores[intent as Intent] += keyword.split(" ").length; // Weight multi-word matches higher
      }
    }
  }

  // Find the highest scoring intent
  let maxIntent: Intent = "unknown";
  let maxScore = 0;

  for (const [intent, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      maxIntent = intent as Intent;
    }
  }

  return maxIntent;
}

function extractContext(message: string): ExtractedContext {
  const lowerMessage = message.toLowerCase();
  const context: ExtractedContext = {};

  // Extract industry
  for (const [industry, patterns] of Object.entries(industryPatterns)) {
    if (patterns.some((p) => lowerMessage.includes(p))) {
      context.industry = industry.charAt(0).toUpperCase() + industry.slice(1);
      break;
    }
  }

  // Extract company size hints
  if (lowerMessage.includes("startup") || lowerMessage.includes("small")) {
    context.companySize = "Startup/Small";
  } else if (lowerMessage.includes("mid-size") || lowerMessage.includes("medium")) {
    context.companySize = "Mid-size";
  } else if (lowerMessage.includes("enterprise") || lowerMessage.includes("large")) {
    context.companySize = "Enterprise";
  }

  // Extract challenge (simplified - in production, use NLP)
  if (message.length > 20) {
    context.challenge = message;
  }

  // Extract audience type for speaking
  if (lowerMessage.includes("technical") || lowerMessage.includes("developer")) {
    context.audienceType = "Technical";
  } else if (lowerMessage.includes("business") || lowerMessage.includes("executive")) {
    context.audienceType = "Business";
  }

  // Extract region
  const regionPatterns: Record<string, string[]> = {
    EU: ["europe", "eu", "gdpr"],
    MENA: ["middle east", "mena", "dubai", "uae"],
    APAC: ["asia", "apac", "singapore", "india"],
    Africa: ["africa", "south africa"],
  };

  for (const [region, patterns] of Object.entries(regionPatterns)) {
    if (patterns.some((p) => lowerMessage.includes(p))) {
      context.region = region;
      break;
    }
  }

  return context;
}

function intentToCanvas(intent: Intent): CanvasType {
  const mapping: Record<Intent, CanvasType> = {
    "ai-strategy": "ai-strategy",
    speaking: "speaking",
    gtm: "gtm",
    "market-expansion": "market-expansion",
    "case-study": "case-study",
    general: "initial",
    unknown: "initial",
  };
  return mapping[intent];
}

function generateResponse(intent: Intent, context: ExtractedContext): string {
  switch (intent) {
    case "ai-strategy":
      if (context.industry) {
        return `I see you're working in ${context.industry} and facing AI challenges. This is exactly the kind of complexity I specialize in. My governance-first approach helps enterprises like yours get value from AI without getting stuck in compliance paralysis. Let me show you my approach and a relevant case study.`;
      }
      return `AI strategy is at the core of what I do. I've helped enterprises transform their AI capabilities with a governance-first approach that's won industry recognition (GEC Award 2025) and resulted in 3 patents. Let me show you how this might apply to your situation.`;

    case "speaking":
      if (context.audienceType) {
        return `I'd be happy to discuss speaking at your event. I regularly present to ${context.audienceType.toLowerCase()} audiences on enterprise AI, governance, and go-to-market strategies. Here are my recent talks and available topics.`;
      }
      return `I speak regularly at conferences and events on enterprise AI, governance paradoxes, and global go-to-market strategies. Recent appearances include GITEX and CIO Summit. Let me show you my available topics and how to check availability.`;

    case "gtm":
      return `Go-to-market strategy for complex B2B tech is my specialty. I've helped companies achieve 50% conversion improvements and 130% market growth. Let me show you my approach and some recent results.`;

    case "market-expansion":
      if (context.region) {
        return `${context.region} market expansion is an area where I have direct experience. I've helped companies navigate regulatory requirements, build channel partnerships, and establish local presence in multiple regions. Here's my approach and a relevant case study.`;
      }
      return `International expansion for technology companies requires navigating regulatory complexity, building local partnerships, and adapting your positioning. I've launched products across EU, MENA, APAC, and Africa. Let me show you how.`;

    case "case-study":
      return `I'd be happy to share detailed case studies. Here are examples of recent work across AI strategy, market expansion, and go-to-market optimization.`;

    case "general":
      return `I help technology companies turn complex innovation into revenue. My focus areas are AI Platform Strategy, Go-to-Market, and International Expansion. What challenge are you working on?`;

    default:
      return `I help technology companies with AI strategy, go-to-market, and international expansion. Could you tell me more about the specific challenge you're facing? That will help me show you the most relevant experience and approach.`;
  }
}

function generateSuggestions(intent: Intent): string[] {
  switch (intent) {
    case "ai-strategy":
      return [
        "Tell me about your governance approach",
        "Show me the ArqAI case study",
        "What industries have you worked with?",
      ];
    case "speaking":
      return [
        "What topics do you cover?",
        "Check availability for Q1",
        "Send me your speaker kit",
      ];
    case "gtm":
      return [
        "How do you improve conversion?",
        "Show me results from AML SaaS",
        "What's your approach to positioning?",
      ];
    case "market-expansion":
      return [
        "Tell me about EU expansion",
        "How do you handle GDPR?",
        "Show me the RegTech case study",
      ];
    default:
      return [
        "Help with AI strategy",
        "Looking for a speaker",
        "Need to expand internationally",
      ];
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Classify intent
    const intent = classifyIntent(message);

    // Extract context
    const context = extractContext(message);

    // Determine canvas
    const canvas = intentToCanvas(intent);

    // Generate response
    const responseMessage = generateResponse(intent, context);

    // Generate follow-up suggestions
    const suggestions = generateSuggestions(intent);

    const response: ApiResponse = {
      message: responseMessage,
      canvas,
      intent,
      context,
      suggestions,
    };

    // Simulate some processing time for realistic feel
    await new Promise((resolve) => setTimeout(resolve, 500));

    return NextResponse.json(response);
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
