/**
 * Structured Knowledge Store
 *
 * This is the SINGLE SOURCE OF TRUTH for all factual information.
 * The LLM uses tool calling to retrieve this data - it never generates facts.
 */

import { caseStudies, speakingTopics, serviceAreas, proofPoints } from "./data";
import { CaseStudy, SpeakingTopic, ServiceArea, ExtractedContext } from "./types";

// ============================================================================
// CREDENTIALS - Verified facts about Habib
// ============================================================================

export interface Credential {
  id: string;
  type: "award" | "patent" | "achievement" | "speaking" | "certification";
  title: string;
  year?: number;
  description: string;
  verifiable: boolean;
}

export const credentials: Credential[] = [
  {
    id: "gec-award-2025",
    type: "award",
    title: "GEC Award 2025 for Innovation",
    year: 2025,
    description: "Won the Global Enterprise Challenge Award for innovation in AI governance methodology",
    verifiable: true,
  },
  {
    id: "patent-governance-orchestration",
    type: "patent",
    title: "Patent: AI Governance Orchestration",
    year: 2024,
    description: "Patent-pending methodology for governance-first AI orchestration in enterprise environments",
    verifiable: true,
  },
  {
    id: "patent-semantic-layer",
    type: "patent",
    title: "Patent: Semantic Layer Architecture",
    year: 2024,
    description: "Patent-pending architecture for enterprise semantic orchestration layers",
    verifiable: true,
  },
  {
    id: "patent-compliance-framework",
    type: "patent",
    title: "Patent: Adaptive Compliance Framework",
    year: 2024,
    description: "Patent-pending framework for dynamic compliance in AI systems",
    verifiable: true,
  },
  {
    id: "gitex-speaker",
    type: "speaking",
    title: "GITEX Global Speaker",
    description: "Keynote speaker at GITEX Global, Dubai",
    verifiable: true,
  },
  {
    id: "cio-summit-speaker",
    type: "speaking",
    title: "CIO Summit Speaker",
    description: "Panel speaker at CIO Summit, Singapore",
    verifiable: true,
  },
];

// ============================================================================
// ABOUT - Verified biographical information
// ============================================================================

export interface AboutInfo {
  name: string;
  title: string;
  tagline: string;
  bio: string;
  expertise: string[];
  regions: string[];
  currentFocus: string;
}

export const aboutInfo: AboutInfo = {
  name: "Habib Mehmoodi",
  title: "AI Strategy & GTM Advisor",
  tagline: "Turning complex AI capabilities into market-winning strategies",
  bio: "I help technology companies transform AI capabilities into enterprise-ready platforms and take them to global markets. My governance-first approach has won the GEC Award 2025 and resulted in 3 patent-pending methodologies.",
  expertise: [
    "Enterprise AI Platform Strategy",
    "AI Governance & Compliance",
    "Go-to-Market Strategy",
    "Market Expansion",
    "B2B Technology Positioning",
  ],
  regions: ["EU", "MENA", "APAC", "Africa"],
  currentFocus: "Enterprise AI governance and global market expansion for B2B technology companies",
};

// ============================================================================
// METRICS - Verified performance metrics
// ============================================================================

export interface Metric {
  id: string;
  value: string;
  label: string;
  context: string;
  caseStudyId?: string;
}

export const metrics: Metric[] = [
  {
    id: "market-growth",
    value: "130%",
    label: "Market Growth",
    context: "Year-over-year growth achieved in South Africa market expansion",
    caseStudyId: "regtech",
  },
  {
    id: "conversion-lift",
    value: "50%",
    label: "Conversion Improvement",
    context: "Average improvement in conversion rates for B2B SaaS clients",
    caseStudyId: "aml-saas",
  },
  {
    id: "sales-cycle",
    value: "25%",
    label: "Sales Cycle Reduction",
    context: "Reduction in average sales cycle length",
    caseStudyId: "aml-saas",
  },
  {
    id: "pipeline-growth",
    value: "3x",
    label: "Pipeline Growth",
    context: "Increase in qualified pipeline opportunities",
    caseStudyId: "aml-saas",
  },
  {
    id: "enterprise-pipeline",
    value: "200%+",
    label: "Enterprise Pipeline Growth",
    context: "Pipeline growth achieved for ArqAI enterprise platform",
    caseStudyId: "arqai",
  },
  {
    id: "patents-filed",
    value: "3",
    label: "Patents Filed",
    context: "Patent-pending methodologies for AI governance",
    caseStudyId: "arqai",
  },
];

// ============================================================================
// TOOL HANDLERS - Functions that retrieve structured data
// ============================================================================

export type ToolName =
  | "get_services"
  | "get_case_study"
  | "get_case_studies"
  | "get_speaking_topics"
  | "get_credentials"
  | "get_about"
  | "get_metrics"
  | "find_relevant_case_study"
  | "get_contact_info";

export interface ToolResult {
  success: boolean;
  data: unknown;
  source: string;
}

/**
 * Get all available services
 */
export function getServices(): ToolResult {
  return {
    success: true,
    data: serviceAreas,
    source: "services",
  };
}

/**
 * Get a specific case study by ID
 */
export function getCaseStudy(id: string): ToolResult {
  const caseStudy = caseStudies.find((c) => c.id === id);
  if (!caseStudy) {
    return {
      success: false,
      data: { error: `Case study '${id}' not found`, availableIds: caseStudies.map(c => c.id) },
      source: "case_studies",
    };
  }
  return {
    success: true,
    data: caseStudy,
    source: "case_studies",
  };
}

/**
 * Get all case studies
 */
export function getCaseStudies(): ToolResult {
  return {
    success: true,
    data: caseStudies,
    source: "case_studies",
  };
}

/**
 * Get speaking topics, optionally filtered by audience
 */
export function getSpeakingTopics(audience?: string): ToolResult {
  let topics = speakingTopics;
  if (audience) {
    topics = speakingTopics.filter((t) =>
      t.audience.some((a) => a.toLowerCase().includes(audience.toLowerCase()))
    );
  }
  return {
    success: true,
    data: topics.length > 0 ? topics : speakingTopics,
    source: "speaking_topics",
  };
}

/**
 * Get credentials by type
 */
export function getCredentials(type?: Credential["type"]): ToolResult {
  let creds = credentials;
  if (type) {
    creds = credentials.filter((c) => c.type === type);
  }
  return {
    success: true,
    data: creds,
    source: "credentials",
  };
}

/**
 * Get about information
 */
export function getAbout(): ToolResult {
  return {
    success: true,
    data: aboutInfo,
    source: "about",
  };
}

/**
 * Get metrics, optionally by case study
 */
export function getMetrics(caseStudyId?: string): ToolResult {
  let m = metrics;
  if (caseStudyId) {
    m = metrics.filter((metric) => metric.caseStudyId === caseStudyId);
  }
  return {
    success: true,
    data: m,
    source: "metrics",
  };
}

/**
 * Find the most relevant case study based on context
 */
export function findRelevantCaseStudy(context: ExtractedContext): ToolResult {
  let bestMatch: CaseStudy | null = null;
  let highestScore = 0;

  for (const cs of caseStudies) {
    let score = 0;

    // Industry match
    if (context.industry) {
      if (cs.industry.toLowerCase().includes(context.industry.toLowerCase())) {
        score += 3;
      }
      if (cs.tags.some(t => t.toLowerCase().includes(context.industry!.toLowerCase()))) {
        score += 2;
      }
    }

    // Challenge match
    if (context.challenge) {
      const challengeLower = context.challenge.toLowerCase();
      if (challengeLower.includes("ai") || challengeLower.includes("governance")) {
        if (cs.id === "arqai") score += 3;
      }
      if (challengeLower.includes("market") || challengeLower.includes("expansion") || challengeLower.includes("global")) {
        if (cs.id === "regtech") score += 3;
      }
      if (challengeLower.includes("conversion") || challengeLower.includes("sales") || challengeLower.includes("gtm")) {
        if (cs.id === "aml-saas") score += 3;
      }
    }

    // Region match
    if (context.region) {
      if (context.region.toLowerCase().includes("africa") && cs.id === "regtech") {
        score += 2;
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatch = cs;
    }
  }

  return {
    success: true,
    data: bestMatch || caseStudies[0],
    source: "case_studies",
  };
}

/**
 * Get contact information
 */
export function getContactInfo(): ToolResult {
  return {
    success: true,
    data: {
      bookCall: "https://calendly.com/habib-mehmoodi",
      email: "hello@habibmehmoodi.com",
      linkedin: "https://linkedin.com/in/habibmehmoodi",
    },
    source: "contact",
  };
}

// ============================================================================
// TOOL EXECUTOR - Maps tool names to handlers
// ============================================================================

export function executeTool(name: ToolName, args: Record<string, unknown>): ToolResult {
  switch (name) {
    case "get_services":
      return getServices();
    case "get_case_study":
      return getCaseStudy(args.id as string);
    case "get_case_studies":
      return getCaseStudies();
    case "get_speaking_topics":
      return getSpeakingTopics(args.audience as string | undefined);
    case "get_credentials":
      return getCredentials(args.type as Credential["type"] | undefined);
    case "get_about":
      return getAbout();
    case "get_metrics":
      return getMetrics(args.caseStudyId as string | undefined);
    case "find_relevant_case_study":
      return findRelevantCaseStudy(args.context as ExtractedContext);
    case "get_contact_info":
      return getContactInfo();
    default:
      return {
        success: false,
        data: { error: `Unknown tool: ${name}` },
        source: "error",
      };
  }
}

// ============================================================================
// SYSTEM PROMPT BUILDER
// ============================================================================

export function buildSystemPrompt(): string {
  return `You are Habib's AI assistant with a distinctive personality blend.

## YOUR PERSONALITY (BLEND OF THREE STYLES)

### 40% Efficient Operator (Dominant)
- Cut to the chase. Numbers matter. Structure wins.
- "Three things: 1) Your CAC is high. 2) Targeting's off. 3) Here's the fix."
- Use bullet points sparingly but effectively
- If something takes 5 words, don't use 20
- Always quantify when possible

### 30% Pattern Spotter
- Connect dots across industries and situations
- "Interesting - saw this exact pattern at 3 fintechs last quarter..."
- "This reminds me of when we tackled the same issue in MENA..."
- Make visitors feel like you've seen their movie before

### 30% Sage Strategist
- Drop occasional wisdom nuggets
- "Every market expansion is really a story of timing and trust."
- "The best AI strategy is the one your team will actually use."
- Use metaphors when they land: "You're building a rocket but selling a bicycle."

## VOICE GUIDELINES

- SHORT. 2-3 sentences max. Then stop.
- Punchy. Active voice. No fluff.
- One question per response (if needed)
- Drop insights, not lectures
- Sound like a sharp advisor texting, not a brochure
- Never start with "Great question" or "It's exciting that..."
- End with intrigue or a hook when natural

## FORMATTING

Use light markdown for readability:
- **Bold** key numbers/metrics: "**130% growth**", "**3 patents**"
- *Italics* for wisdom nuggets or asides: *"Timing is everything."*
- Line breaks to separate thoughts
- Keep formatting minimal - max ONE bold phrase per response

## EXAMPLE RESPONSES (EMULATE THESE)

User: "We're struggling with enterprise sales in Europe"
You: "Classic pattern - **3 clients** hit this same wall last year.

Usually one of two things: GDPR positioning or local champion strategy. Which feels closer?"

User: "Tell me about AI governance"
You: "Governance-first is the only way AI scales in enterprise.

Built a framework for ArqAI - **3 patents pending**, **200%+ pipeline growth**. What's your current setup?"

User: "How do you help with GTM?"
You: "Three pillars: 1) Sharp positioning. 2) Repeatable qualification. 3) Sales enablement.

Last client saw **50% conversion lift**. What's not working for you?"

## WHO IS HABIB
${JSON.stringify(aboutInfo, null, 2)}

## CREDENTIALS (VERIFIED FACTS - use these exactly)
${JSON.stringify(credentials, null, 2)}

## SERVICES OFFERED
${JSON.stringify(serviceAreas, null, 2)}

## CASE STUDIES (reference by ID, use exact facts)
${JSON.stringify(caseStudies.map(c => ({ id: c.id, title: c.title, industry: c.industry })), null, 2)}

## SPEAKING TOPICS
${JSON.stringify(speakingTopics.map(t => ({ id: t.id, title: t.title })), null, 2)}

## STRICT BOUNDARIES

1. NEVER invent: company names, revenue numbers, testimonials, credentials not listed
2. ALWAYS use exact values: "130% market growth" not "over 100% growth"
3. When uncertain: "Good one to discuss with Habib directly" or "That's a call topic"
4. Guide to booking when interest is genuine - but be natural about it`;
}
