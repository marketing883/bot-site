// Visual State System - Controls how the page morphs based on conversation

export type CanvasMode =
  | "initial"        // Welcome state, exploring
  | "ai-strategy"    // Discussing AI/platform strategy
  | "gtm"            // Go-to-market discussion
  | "expansion"      // Market expansion
  | "speaking"       // Speaking/events inquiry
  | "case-study"     // Deep dive on a case study
  | "scheduling"     // Ready to book
  | "assessment"     // Showing generated assessment
  | "estimator"      // Showing engagement estimator
  | "dynamic";       // Dynamically generated content for unlisted topics

export type VisualMood =
  | "neutral"        // Default, calm
  | "engaged"        // Active discussion, energetic
  | "focused"        // Deep dive, structured
  | "excited"        // Ready to act, bright
  | "thoughtful";    // Considering options

// Dynamic content generated for unlisted topics
export interface DynamicContent {
  topic: string;
  headline: string;
  relevantExperience: string[];
  approachPoints: string[];
  relatedServices: string[];
  suggestedCaseStudy?: string;
}

export interface VisualState {
  canvas: CanvasMode;
  mood: VisualMood;
  highlightedService?: string;
  highlightedCaseStudy?: string;
  showMetrics?: string[];
  showCredentials?: boolean;
  progressStage?: "exploring" | "qualifying" | "educating" | "closing";
  customInsight?: string;
  dynamicContent?: DynamicContent;
  estimatorData?: {
    scope?: string;
    complexity?: "low" | "medium" | "high";
    duration?: string;
    investmentRange?: string;
  };
}

// Default initial state
export const initialVisualState: VisualState = {
  canvas: "initial",
  mood: "neutral",
  progressStage: "exploring",
};

// Topics that indicate substantive discussion (trigger dynamic canvas)
const SUBSTANTIVE_TOPICS = [
  "product", "strategy", "growth", "scale", "startup", "enterprise",
  "saas", "b2b", "fintech", "healthtech", "edtech", "insurtech",
  "compliance", "regulatory", "digital transformation", "innovation",
  "automation", "efficiency", "team", "leadership", "advisory",
  "consulting", "partnership", "investment", "fundraising", "pitch",
  "positioning", "brand", "pricing", "revenue", "customers", "users",
  "roadmap", "launch", "mvp", "prototype", "technology", "software",
  "integration", "api", "cloud", "security", "privacy", "gdpr",
  "analytics", "metrics", "kpi", "performance", "optimization",
  // Enterprise systems & migration
  "sap", "s4hana", "s/4hana", "erp", "oracle", "salesforce", "dynamics",
  "migration", "modernization", "modernize", "legacy", "upgrade",
  "crm", "hcm", "scm", "supply chain", "hr system", "finance system"
];

// Extract the main topic from a message
export function extractTopic(message: string): string | null {
  const lowerMessage = message.toLowerCase();

  // Priority topics - check these first (specific enterprise systems)
  const priorityTopics = [
    "s4hana", "s/4hana", "sap", "erp", "oracle", "salesforce", "dynamics",
    "modernize", "modernization", "migration", "upgrade", "legacy",
    "fintech", "healthtech", "insurtech", "edtech",
    "compliance", "regulatory", "digital transformation",
    "automation", "integration"
  ];

  for (const topic of priorityTopics) {
    if (lowerMessage.includes(topic)) {
      // Normalize topic names
      if (topic === "s/4hana") return "s4hana";
      if (topic === "modernization") return "modernize";
      return topic;
    }
  }

  // Check for other substantive topics
  for (const topic of SUBSTANTIVE_TOPICS) {
    if (lowerMessage.includes(topic)) {
      return topic;
    }
  }

  // Check for industry mentions
  const industries = ["retail", "finance", "banking", "healthcare", "manufacturing",
    "logistics", "real estate", "media", "entertainment", "education", "government"];
  for (const industry of industries) {
    if (lowerMessage.includes(industry)) {
      return industry;
    }
  }

  // If message is substantial (describes a challenge), extract key theme
  if (message.length > 60 && (
    lowerMessage.includes("we") ||
    lowerMessage.includes("our") ||
    lowerMessage.includes("help") ||
    lowerMessage.includes("need") ||
    lowerMessage.includes("challenge") ||
    lowerMessage.includes("problem")
  )) {
    // Return a generic "business challenge" topic
    return "business challenge";
  }

  return null;
}

// Topics that should trigger dynamic canvas (not our 4 main services)
const DYNAMIC_TRIGGER_TOPICS = [
  "sap", "s4hana", "s/4hana", "erp", "oracle", "salesforce", "dynamics",
  "migration", "modernization", "modernize", "legacy", "upgrade",
  "crm", "hcm", "scm", "supply chain", "hr system", "finance system",
  "product", "startup", "fintech", "healthtech", "edtech", "insurtech",
  "compliance", "regulatory", "digital transformation",
  "automation", "efficiency", "integration", "cloud migration",
  "enterprise software", "system implementation"
];

// Detect canvas mode from conversation content
export function detectCanvasMode(
  userMessage: string,
  conversationHistory: string[]
): CanvasMode {
  const lowerMessage = userMessage.toLowerCase();
  const fullContext = [...conversationHistory, userMessage].join(" ").toLowerCase();

  // Speaking/Events - very specific
  if (
    lowerMessage.includes("speak") ||
    lowerMessage.includes("keynote") ||
    lowerMessage.includes("conference") ||
    lowerMessage.includes("event") ||
    lowerMessage.includes("panel")
  ) {
    return "speaking";
  }

  // Scheduling - very specific
  if (
    lowerMessage.includes("book") ||
    lowerMessage.includes("schedule") ||
    lowerMessage.includes("calendar") ||
    (lowerMessage.includes("meet") && lowerMessage.includes("call"))
  ) {
    return "scheduling";
  }

  // Case study deep dive - explicit mentions
  if (
    lowerMessage.includes("case study") ||
    lowerMessage.includes("tell me more about") ||
    lowerMessage.includes("arqai") ||
    lowerMessage.includes("regtech")
  ) {
    return "case-study";
  }

  // Check for dynamic topics FIRST - specific enterprise/tech topics
  // These should show tailored content, not default AI Strategy
  for (const topic of DYNAMIC_TRIGGER_TOPICS) {
    if (lowerMessage.includes(topic)) {
      return "dynamic";
    }
  }

  // AI Strategy - only for EXPLICIT AI discussions
  if (
    lowerMessage.includes("ai strategy") ||
    lowerMessage.includes("ai platform") ||
    lowerMessage.includes("artificial intelligence") ||
    lowerMessage.includes("ai governance") ||
    (lowerMessage.includes("ai") && (
      lowerMessage.includes("help") ||
      lowerMessage.includes("need") ||
      lowerMessage.includes("looking for")
    ))
  ) {
    return "ai-strategy";
  }

  // GTM - explicit go-to-market
  if (
    lowerMessage.includes("gtm") ||
    lowerMessage.includes("go-to-market") ||
    lowerMessage.includes("go to market") ||
    (lowerMessage.includes("marketing") && lowerMessage.includes("strategy")) ||
    lowerMessage.includes("sales strategy") ||
    lowerMessage.includes("pipeline")
  ) {
    return "gtm";
  }

  // Market Expansion - explicit expansion
  if (
    lowerMessage.includes("expand") ||
    lowerMessage.includes("international") ||
    lowerMessage.includes("mena") ||
    lowerMessage.includes("apac") ||
    (lowerMessage.includes("global") && lowerMessage.includes("market"))
  ) {
    return "expansion";
  }

  // Check for any substantive topic that deserves dynamic content
  const topic = extractTopic(userMessage);
  if (topic) {
    return "dynamic";
  }

  return "initial";
}

// Detect visual mood from message sentiment/intent
export function detectMood(userMessage: string, agentMode: string): VisualMood {
  const lowerMessage = userMessage.toLowerCase();

  // Excited - ready to act
  if (
    lowerMessage.includes("let's do") ||
    lowerMessage.includes("sounds great") ||
    lowerMessage.includes("i'm ready") ||
    lowerMessage.includes("book") ||
    lowerMessage.includes("schedule") ||
    agentMode === "scheduler"
  ) {
    return "excited";
  }

  // Thoughtful - considering
  if (
    lowerMessage.includes("not sure") ||
    lowerMessage.includes("thinking") ||
    lowerMessage.includes("maybe") ||
    lowerMessage.includes("consider") ||
    lowerMessage.includes("depends")
  ) {
    return "thoughtful";
  }

  // Focused - deep dive
  if (
    lowerMessage.includes("tell me more") ||
    lowerMessage.includes("how does") ||
    lowerMessage.includes("explain") ||
    lowerMessage.includes("details") ||
    agentMode === "educator"
  ) {
    return "focused";
  }

  // Engaged - active discussion
  if (userMessage.length > 50 || lowerMessage.includes("we") || lowerMessage.includes("our")) {
    return "engaged";
  }

  return "neutral";
}

// Detect which service to highlight
export function detectHighlightedService(userMessage: string): string | undefined {
  const lowerMessage = userMessage.toLowerCase();

  if (lowerMessage.includes("ai") || lowerMessage.includes("platform") || lowerMessage.includes("governance")) {
    return "ai-platform";
  }
  if (lowerMessage.includes("gtm") || lowerMessage.includes("go-to-market") || lowerMessage.includes("marketing")) {
    return "gtm";
  }
  if (lowerMessage.includes("expand") || lowerMessage.includes("region") || lowerMessage.includes("international")) {
    return "expansion";
  }
  if (lowerMessage.includes("speak") || lowerMessage.includes("keynote")) {
    return "speaking";
  }

  return undefined;
}

// Detect which case study to highlight
export function detectHighlightedCaseStudy(userMessage: string): string | undefined {
  const lowerMessage = userMessage.toLowerCase();

  if (lowerMessage.includes("arqai") || lowerMessage.includes("ai platform") || lowerMessage.includes("governance")) {
    return "arqai";
  }
  if (lowerMessage.includes("regtech") || lowerMessage.includes("expansion") || lowerMessage.includes("region")) {
    return "regtech";
  }
  if (lowerMessage.includes("aml") || lowerMessage.includes("conversion") || lowerMessage.includes("saas")) {
    return "aml-saas";
  }

  return undefined;
}

// Determine progress stage
export function detectProgressStage(
  collectedInfo: Record<string, unknown>,
  messageCount: number,
  agentMode: string
): "exploring" | "qualifying" | "educating" | "closing" {
  if (agentMode === "scheduler") return "closing";
  if (agentMode === "educator") return "educating";

  const hasContactInfo = collectedInfo.name || collectedInfo.email;
  if (hasContactInfo) return "qualifying";

  if (messageCount > 4) return "qualifying";

  return "exploring";
}

// Generate dynamic content for unlisted topics
export function generateDynamicContent(
  topic: string,
  userMessage: string,
  conversationHistory: string[]
): DynamicContent {
  const lowerMessage = userMessage.toLowerCase();
  const fullContext = [...conversationHistory, userMessage].join(" ").toLowerCase();

  // Map topics to relevant experience and approach
  const topicMappings: Record<string, {
    headline: string;
    experience: string[];
    approach: string[];
    services: string[];
    caseStudy?: string;
  }> = {
    "sap": {
      headline: "Enterprise Systems & SAP Modernization",
      experience: ["Enterprise architecture and system integration", "Digital transformation for large organizations", "AI-readiness assessment for legacy systems"],
      approach: ["Assess current architecture and pain points", "Design migration strategy with AI optimization", "Plan phased implementation with quick wins"],
      services: ["AI Platform Strategy", "Go-to-Market Strategy"],
      caseStudy: "arqai"
    },
    "s4hana": {
      headline: "S/4HANA Migration Strategy",
      experience: ["Enterprise architecture and system integration", "Platform modernization strategies", "Change management for digital transformation"],
      approach: ["Evaluate current SAP landscape", "Design AI-optimized target architecture", "Create phased migration roadmap"],
      services: ["AI Platform Strategy", "Go-to-Market Strategy"],
      caseStudy: "arqai"
    },
    "erp": {
      headline: "ERP Strategy & Modernization",
      experience: ["Enterprise platform architecture", "System integration and data strategy", "AI-enabled process optimization"],
      approach: ["Map current processes and pain points", "Design future-state architecture", "Build business case and roadmap"],
      services: ["AI Platform Strategy", "Go-to-Market Strategy"],
      caseStudy: "arqai"
    },
    "modernize": {
      headline: "System Modernization Strategy",
      experience: ["Enterprise digital transformation", "Legacy system migration", "AI-readiness and optimization"],
      approach: ["Assess current state and technical debt", "Define modernization priorities", "Execute transformation with measurable milestones"],
      services: ["AI Platform Strategy", "Go-to-Market Strategy"],
      caseStudy: "arqai"
    },
    "migration": {
      headline: "Migration Strategy & Execution",
      experience: ["Enterprise platform migrations", "Risk mitigation and change management", "Cross-functional program leadership"],
      approach: ["Assess migration scope and risks", "Design migration architecture", "Execute with minimal disruption"],
      services: ["AI Platform Strategy", "Market Expansion"],
      caseStudy: "arqai"
    },
    "product": {
      headline: "Product Strategy & Development",
      experience: ["Built and scaled enterprise SaaS products", "Product-market fit optimization", "Technical product leadership"],
      approach: ["Validate market opportunity", "Define product roadmap", "Build go-to-market motion"],
      services: ["AI Platform Strategy", "Go-to-Market Strategy"],
      caseStudy: "arqai"
    },
    "startup": {
      headline: "Startup Growth Advisory",
      experience: ["Scaled multiple B2B startups", "Enterprise sales strategy", "Investor-ready positioning"],
      approach: ["Clarify value proposition", "Build repeatable sales process", "Establish market presence"],
      services: ["Go-to-Market Strategy", "Market Expansion"],
      caseStudy: "aml-saas"
    },
    "fintech": {
      headline: "FinTech Strategy & Compliance",
      experience: ["RegTech product strategy", "AML/Compliance solutions", "Multi-region financial services launches"],
      approach: ["Navigate regulatory requirements", "Build compliant infrastructure", "Scale across jurisdictions"],
      services: ["AI Platform Strategy", "Market Expansion"],
      caseStudy: "regtech"
    },
    "compliance": {
      headline: "Compliance & Governance Strategy",
      experience: ["GEC Award 2025 for AI Governance", "Enterprise compliance frameworks", "Regulatory navigation across regions"],
      approach: ["Assess compliance gaps", "Design governance framework", "Implement controls"],
      services: ["AI Platform Strategy"],
      caseStudy: "arqai"
    },
    "saas": {
      headline: "SaaS Growth Strategy",
      experience: ["50% conversion improvements", "Enterprise SaaS scaling", "Full-funnel optimization"],
      approach: ["Optimize conversion funnel", "Build sales-marketing alignment", "Scale customer acquisition"],
      services: ["Go-to-Market Strategy"],
      caseStudy: "aml-saas"
    },
    "digital transformation": {
      headline: "Digital Transformation Advisory",
      experience: ["Enterprise AI implementation", "Platform modernization", "Change management"],
      approach: ["Assess current state", "Design target architecture", "Execute transformation roadmap"],
      services: ["AI Platform Strategy", "Go-to-Market Strategy"],
      caseStudy: "arqai"
    },
    "automation": {
      headline: "Process Automation Strategy",
      experience: ["AI-driven automation solutions", "Enterprise workflow optimization", "ROI-focused implementation"],
      approach: ["Identify automation opportunities", "Prioritize by business impact", "Implement with governance"],
      services: ["AI Platform Strategy", "Go-to-Market Strategy"],
      caseStudy: "arqai"
    },
    "integration": {
      headline: "System Integration Strategy",
      experience: ["Enterprise API and data integration", "Cross-platform architecture", "AI-enabled data pipelines"],
      approach: ["Map integration requirements", "Design scalable architecture", "Implement with monitoring"],
      services: ["AI Platform Strategy"],
      caseStudy: "arqai"
    }
  };

  // Find matching topic or use defaults
  let mapping = topicMappings[topic];

  if (!mapping) {
    // Check for partial matches
    for (const [key, value] of Object.entries(topicMappings)) {
      if (topic.includes(key) || key.includes(topic)) {
        mapping = value;
        break;
      }
    }
  }

  // Default mapping for unmatched topics
  if (!mapping) {
    mapping = {
      headline: `${topic.charAt(0).toUpperCase() + topic.slice(1)} Strategy`,
      experience: ["20+ years enterprise experience", "Cross-functional leadership", "Global market expertise"],
      approach: ["Understand your specific challenge", "Map to proven methodologies", "Execute with measurable outcomes"],
      services: ["AI Platform Strategy", "Go-to-Market Strategy", "Market Expansion"],
    };
  }

  return {
    topic,
    headline: mapping.headline,
    relevantExperience: mapping.experience,
    approachPoints: mapping.approach,
    relatedServices: mapping.services,
    suggestedCaseStudy: mapping.caseStudy,
  };
}

// Build complete visual state from conversation context
export function buildVisualState(
  userMessage: string,
  conversationHistory: string[],
  agentMode: string,
  collectedInfo: Record<string, unknown>
): VisualState {
  const canvas = detectCanvasMode(userMessage, conversationHistory);
  const mood = detectMood(userMessage, agentMode);
  const highlightedService = detectHighlightedService(userMessage);
  const highlightedCaseStudy = detectHighlightedCaseStudy(userMessage);
  const progressStage = detectProgressStage(collectedInfo, conversationHistory.length, agentMode);

  // Determine which metrics to show based on context
  const showMetrics: string[] = [];
  if (canvas === "gtm" || highlightedService === "gtm") {
    showMetrics.push("130% growth", "50% conversion lift");
  }
  if (canvas === "ai-strategy" || highlightedService === "ai-platform") {
    showMetrics.push("GEC Award 2025", "3 Patents");
  }

  // Generate dynamic content if needed
  let dynamicContent: DynamicContent | undefined;
  if (canvas === "dynamic") {
    const topic = extractTopic(userMessage) || "business challenge";
    dynamicContent = generateDynamicContent(topic, userMessage, conversationHistory);
  }

  return {
    canvas,
    mood,
    highlightedService,
    highlightedCaseStudy,
    showMetrics: showMetrics.length > 0 ? showMetrics : undefined,
    showCredentials: canvas === "speaking" || agentMode === "educator",
    progressStage,
    dynamicContent,
  };
}

// Get CSS classes for mood-based styling
export function getMoodStyles(mood: VisualMood): {
  background: string;
  accent: string;
  animation: string;
} {
  switch (mood) {
    case "excited":
      return {
        background: "from-cyan-900/30 via-purple-900/20 to-pink-900/30",
        accent: "cyan-400",
        animation: "animate-pulse-slow",
      };
    case "focused":
      return {
        background: "from-slate-900/50 via-blue-900/30 to-slate-900/50",
        accent: "blue-400",
        animation: "",
      };
    case "thoughtful":
      return {
        background: "from-indigo-900/30 via-slate-900/40 to-indigo-900/30",
        accent: "indigo-400",
        animation: "animate-breathe",
      };
    case "engaged":
      return {
        background: "from-teal-900/30 via-cyan-900/20 to-blue-900/30",
        accent: "teal-400",
        animation: "animate-gradient",
      };
    default:
      return {
        background: "from-slate-900/50 via-slate-800/30 to-slate-900/50",
        accent: "slate-400",
        animation: "",
      };
  }
}
