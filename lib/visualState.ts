// Visual State System - Controls how the page morphs based on conversation
// NOTE: The 4 service canvases (ai-strategy, gtm, expansion, speaking) are ONLY
// triggered by explicit button clicks. ALL conversation-driven content is dynamic.

export type CanvasMode =
  | "initial"        // Welcome state, exploring
  | "ai-strategy"    // ONLY from button click
  | "gtm"            // ONLY from button click
  | "expansion"      // ONLY from button click
  | "speaking"       // From button OR conversation about speaking/events
  | "case-study"     // Deep dive on a case study
  | "scheduling"     // Ready to book
  | "assessment"     // Showing generated assessment
  | "estimator"      // Showing engagement estimator
  | "dynamic";       // ALL conversation-driven content

export type VisualMood =
  | "neutral"        // Default, calm
  | "engaged"        // Active discussion, energetic
  | "focused"        // Deep dive, structured
  | "excited"        // Ready to act, bright
  | "thoughtful";    // Considering options

// Dynamic content generated for conversation topics
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

// Comprehensive topic mappings for dynamic content generation
const TOPIC_MAPPINGS: Record<string, {
  headline: string;
  experience: string[];
  approach: string[];
  services: string[];
  caseStudy?: string;
}> = {
  // Customer Data & Marketing Tech
  "cdp": {
    headline: "Customer Data Platform Strategy",
    experience: ["Enterprise data architecture and integration", "Customer 360 implementations", "Marketing technology stack optimization"],
    approach: ["Audit current data sources and flows", "Design unified customer data model", "Implement CDP with activation channels"],
    services: ["AI Platform Strategy", "Go-to-Market Strategy"],
    caseStudy: "arqai"
  },
  "braze": {
    headline: "Marketing Automation & Braze Implementation",
    experience: ["Marketing automation platform implementations", "Customer engagement optimization", "Cross-channel campaign orchestration"],
    approach: ["Map customer journey touchpoints", "Design engagement strategy", "Implement and optimize campaigns"],
    services: ["Go-to-Market Strategy", "AI Platform Strategy"],
    caseStudy: "aml-saas"
  },
  "martech": {
    headline: "Marketing Technology Strategy",
    experience: ["Full-stack MarTech implementations", "Marketing operations optimization", "Data-driven campaign management"],
    approach: ["Assess current MarTech stack", "Design integrated architecture", "Implement with measurable KPIs"],
    services: ["Go-to-Market Strategy", "AI Platform Strategy"],
    caseStudy: "aml-saas"
  },
  "marketing automation": {
    headline: "Marketing Automation Strategy",
    experience: ["Enterprise marketing automation", "Lead nurturing optimization", "Campaign performance analytics"],
    approach: ["Map buyer journey stages", "Design automation workflows", "Implement scoring and attribution"],
    services: ["Go-to-Market Strategy"],
    caseStudy: "aml-saas"
  },
  "customer data": {
    headline: "Customer Data Strategy",
    experience: ["Enterprise data platform architecture", "Customer analytics and insights", "Privacy-compliant data management"],
    approach: ["Audit data sources and quality", "Design unified data model", "Implement activation strategy"],
    services: ["AI Platform Strategy", "Go-to-Market Strategy"],
    caseStudy: "arqai"
  },

  // Data & Analytics
  "data integration": {
    headline: "Data Integration Strategy",
    experience: ["Enterprise data platform architecture", "API and ETL pipeline design", "Real-time data synchronization"],
    approach: ["Map data sources and requirements", "Design integration architecture", "Implement with monitoring"],
    services: ["AI Platform Strategy"],
    caseStudy: "arqai"
  },
  "data platform": {
    headline: "Data Platform Architecture",
    experience: ["Enterprise data lake and warehouse design", "Modern data stack implementations", "Analytics infrastructure"],
    approach: ["Assess current data landscape", "Design scalable architecture", "Implement governance framework"],
    services: ["AI Platform Strategy"],
    caseStudy: "arqai"
  },
  "analytics": {
    headline: "Analytics & Business Intelligence",
    experience: ["Enterprise BI implementations", "Self-service analytics platforms", "Data visualization and dashboards"],
    approach: ["Define key metrics and KPIs", "Design analytics architecture", "Enable data-driven decisions"],
    services: ["AI Platform Strategy", "Go-to-Market Strategy"],
    caseStudy: "arqai"
  },
  "data warehouse": {
    headline: "Data Warehouse Modernization",
    experience: ["Cloud data warehouse migrations", "Modern data stack design", "Performance optimization"],
    approach: ["Assess current architecture", "Design target state", "Execute migration plan"],
    services: ["AI Platform Strategy"],
    caseStudy: "arqai"
  },

  // Enterprise Systems
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
  "salesforce": {
    headline: "Salesforce Strategy & Implementation",
    experience: ["Enterprise CRM implementations", "Sales process optimization", "Salesforce ecosystem integration"],
    approach: ["Assess sales process maturity", "Design Salesforce architecture", "Implement with adoption strategy"],
    services: ["Go-to-Market Strategy", "AI Platform Strategy"],
    caseStudy: "aml-saas"
  },
  "crm": {
    headline: "CRM Strategy & Optimization",
    experience: ["Enterprise CRM implementations", "Sales process design", "Customer data management"],
    approach: ["Audit current CRM usage", "Design optimized processes", "Implement improvements"],
    services: ["Go-to-Market Strategy"],
    caseStudy: "aml-saas"
  },
  "oracle": {
    headline: "Oracle Systems Strategy",
    experience: ["Enterprise system modernization", "Cloud migration strategies", "Integration architecture"],
    approach: ["Assess current Oracle landscape", "Design modernization roadmap", "Execute transformation"],
    services: ["AI Platform Strategy"],
    caseStudy: "arqai"
  },
  "dynamics": {
    headline: "Microsoft Dynamics Strategy",
    experience: ["Enterprise ERP/CRM implementations", "Microsoft ecosystem integration", "Business process optimization"],
    approach: ["Assess current Dynamics usage", "Design target architecture", "Implement enhancements"],
    services: ["AI Platform Strategy", "Go-to-Market Strategy"],
    caseStudy: "arqai"
  },

  // Migration & Modernization
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
  "legacy": {
    headline: "Legacy System Transformation",
    experience: ["Legacy modernization programs", "Technical debt reduction", "Incremental transformation"],
    approach: ["Assess legacy landscape", "Prioritize modernization efforts", "Execute phased transformation"],
    services: ["AI Platform Strategy"],
    caseStudy: "arqai"
  },
  "cloud migration": {
    headline: "Cloud Migration Strategy",
    experience: ["Enterprise cloud migrations", "Multi-cloud architecture", "Cloud-native transformation"],
    approach: ["Assess cloud readiness", "Design migration approach", "Execute with governance"],
    services: ["AI Platform Strategy"],
    caseStudy: "arqai"
  },

  // Industry Verticals
  "fintech": {
    headline: "FinTech Strategy & Compliance",
    experience: ["RegTech product strategy", "AML/Compliance solutions", "Multi-region financial services launches"],
    approach: ["Navigate regulatory requirements", "Build compliant infrastructure", "Scale across jurisdictions"],
    services: ["AI Platform Strategy", "Market Expansion"],
    caseStudy: "regtech"
  },
  "healthtech": {
    headline: "HealthTech Strategy",
    experience: ["Healthcare technology implementations", "HIPAA-compliant architectures", "Patient engagement platforms"],
    approach: ["Navigate healthcare regulations", "Design compliant solutions", "Scale with governance"],
    services: ["AI Platform Strategy", "Go-to-Market Strategy"],
    caseStudy: "arqai"
  },
  "insurtech": {
    headline: "InsurTech Strategy",
    experience: ["Insurance technology platforms", "Digital transformation in insurance", "Claims automation"],
    approach: ["Assess digital maturity", "Design transformation roadmap", "Implement with compliance"],
    services: ["AI Platform Strategy", "Go-to-Market Strategy"],
    caseStudy: "regtech"
  },
  "edtech": {
    headline: "EdTech Strategy",
    experience: ["Education technology platforms", "Learning management systems", "Student engagement optimization"],
    approach: ["Understand learning objectives", "Design engaging experiences", "Scale with impact measurement"],
    services: ["Go-to-Market Strategy", "AI Platform Strategy"],
    caseStudy: "aml-saas"
  },
  "retail": {
    headline: "Retail Technology Strategy",
    experience: ["Omnichannel retail platforms", "Customer experience optimization", "Retail analytics"],
    approach: ["Map customer journey", "Design unified experience", "Implement with measurement"],
    services: ["Go-to-Market Strategy", "AI Platform Strategy"],
    caseStudy: "aml-saas"
  },
  "banking": {
    headline: "Banking Technology Strategy",
    experience: ["Core banking modernization", "Digital banking platforms", "Regulatory compliance"],
    approach: ["Assess current architecture", "Design target state", "Execute with risk management"],
    services: ["AI Platform Strategy", "Market Expansion"],
    caseStudy: "regtech"
  },
  "healthcare": {
    headline: "Healthcare Technology Strategy",
    experience: ["Healthcare system integrations", "Patient data platforms", "Clinical workflow optimization"],
    approach: ["Navigate compliance requirements", "Design secure architecture", "Implement with governance"],
    services: ["AI Platform Strategy"],
    caseStudy: "arqai"
  },
  "manufacturing": {
    headline: "Manufacturing Technology Strategy",
    experience: ["Industry 4.0 implementations", "IoT and automation platforms", "Supply chain optimization"],
    approach: ["Assess operational maturity", "Design digital twin strategy", "Implement with ROI focus"],
    services: ["AI Platform Strategy"],
    caseStudy: "arqai"
  },

  // Business Functions
  "compliance": {
    headline: "Compliance & Governance Strategy",
    experience: ["GEC Award 2025 for AI Governance", "Enterprise compliance frameworks", "Regulatory navigation across regions"],
    approach: ["Assess compliance gaps", "Design governance framework", "Implement controls"],
    services: ["AI Platform Strategy"],
    caseStudy: "arqai"
  },
  "regulatory": {
    headline: "Regulatory Strategy",
    experience: ["Multi-jurisdiction compliance", "RegTech implementations", "Regulatory change management"],
    approach: ["Map regulatory requirements", "Design compliance architecture", "Implement monitoring"],
    services: ["AI Platform Strategy", "Market Expansion"],
    caseStudy: "regtech"
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
  },

  // Business Growth
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
  "saas": {
    headline: "SaaS Growth Strategy",
    experience: ["50% conversion improvements", "Enterprise SaaS scaling", "Full-funnel optimization"],
    approach: ["Optimize conversion funnel", "Build sales-marketing alignment", "Scale customer acquisition"],
    services: ["Go-to-Market Strategy"],
    caseStudy: "aml-saas"
  },
  "growth": {
    headline: "Growth Strategy",
    experience: ["130% year-over-year growth achievements", "Scalable growth frameworks", "Data-driven optimization"],
    approach: ["Identify growth levers", "Design experimentation framework", "Execute and iterate"],
    services: ["Go-to-Market Strategy", "Market Expansion"],
    caseStudy: "aml-saas"
  },
  "scale": {
    headline: "Scaling Strategy",
    experience: ["Scaled B2B companies to enterprise", "Operational excellence", "Team and process scaling"],
    approach: ["Assess scaling readiness", "Design scalable processes", "Execute growth plan"],
    services: ["Go-to-Market Strategy", "Market Expansion"],
    caseStudy: "aml-saas"
  },
  "revenue": {
    headline: "Revenue Strategy",
    experience: ["Revenue optimization programs", "Pricing strategy", "Sales process design"],
    approach: ["Analyze revenue drivers", "Design optimization strategy", "Implement improvements"],
    services: ["Go-to-Market Strategy"],
    caseStudy: "aml-saas"
  },
  "sales": {
    headline: "Sales Strategy & Enablement",
    experience: ["Enterprise sales transformation", "Sales process optimization", "50% conversion improvements"],
    approach: ["Assess sales maturity", "Design sales playbook", "Enable and coach teams"],
    services: ["Go-to-Market Strategy"],
    caseStudy: "aml-saas"
  },
  "marketing": {
    headline: "Marketing Strategy",
    experience: ["B2B marketing leadership", "Demand generation", "Brand positioning"],
    approach: ["Define target segments", "Design marketing strategy", "Execute with measurement"],
    services: ["Go-to-Market Strategy"],
    caseStudy: "aml-saas"
  },
  "pricing": {
    headline: "Pricing Strategy",
    experience: ["Enterprise pricing optimization", "Value-based pricing", "Monetization strategy"],
    approach: ["Analyze value drivers", "Design pricing model", "Test and optimize"],
    services: ["Go-to-Market Strategy", "AI Platform Strategy"],
    caseStudy: "aml-saas"
  },

  // Digital Transformation
  "digital transformation": {
    headline: "Digital Transformation Advisory",
    experience: ["Enterprise AI implementation", "Platform modernization", "Change management"],
    approach: ["Assess current state", "Design target architecture", "Execute transformation roadmap"],
    services: ["AI Platform Strategy", "Go-to-Market Strategy"],
    caseStudy: "arqai"
  },
  "innovation": {
    headline: "Innovation Strategy",
    experience: ["Innovation program design", "Emerging technology assessment", "Digital innovation labs"],
    approach: ["Identify innovation opportunities", "Design innovation framework", "Execute pilot programs"],
    services: ["AI Platform Strategy"],
    caseStudy: "arqai"
  },
  "technology": {
    headline: "Technology Strategy",
    experience: ["Enterprise technology leadership", "Architecture and roadmap design", "Technology transformation"],
    approach: ["Assess technology landscape", "Design target architecture", "Execute transformation"],
    services: ["AI Platform Strategy"],
    caseStudy: "arqai"
  },
  "ai": {
    headline: "AI Strategy & Implementation",
    experience: ["GEC Award 2025 for AI Governance", "Enterprise AI platforms", "3 patents in AI methodologies"],
    approach: ["Assess AI readiness", "Design AI strategy", "Implement with governance"],
    services: ["AI Platform Strategy"],
    caseStudy: "arqai"
  },
  "machine learning": {
    headline: "Machine Learning Strategy",
    experience: ["Enterprise ML implementations", "MLOps and model governance", "AI-driven automation"],
    approach: ["Identify ML use cases", "Design ML architecture", "Implement with monitoring"],
    services: ["AI Platform Strategy"],
    caseStudy: "arqai"
  },

  // International
  "international": {
    headline: "International Expansion Strategy",
    experience: ["Multi-region market launches", "Cross-border GTM strategies", "Local market adaptation"],
    approach: ["Assess market opportunity", "Design entry strategy", "Execute localized launch"],
    services: ["Market Expansion", "Go-to-Market Strategy"],
    caseStudy: "regtech"
  },
  "global": {
    headline: "Global Strategy",
    experience: ["Global market expansion programs", "Multi-region operations", "Cross-cultural leadership"],
    approach: ["Evaluate global opportunities", "Design expansion strategy", "Execute regional launches"],
    services: ["Market Expansion", "Go-to-Market Strategy"],
    caseStudy: "regtech"
  },
  "mena": {
    headline: "MENA Market Strategy",
    experience: ["MENA region market launches", "Regional regulatory navigation", "Local partnership development"],
    approach: ["Assess MENA market fit", "Design localized strategy", "Execute with local partners"],
    services: ["Market Expansion"],
    caseStudy: "regtech"
  },
  "europe": {
    headline: "European Market Strategy",
    experience: ["European market expansion", "GDPR and regulatory compliance", "Multi-country GTM"],
    approach: ["Evaluate European markets", "Design compliant strategy", "Execute phased expansion"],
    services: ["Market Expansion", "Go-to-Market Strategy"],
    caseStudy: "regtech"
  },
  "apac": {
    headline: "APAC Market Strategy",
    experience: ["Asia-Pacific market launches", "Regional market adaptation", "Cross-border operations"],
    approach: ["Assess APAC opportunities", "Design regional strategy", "Execute market entry"],
    services: ["Market Expansion"],
    caseStudy: "regtech"
  },
};

// Extract the main topic from a message
export function extractTopic(message: string): string | null {
  const lowerMessage = message.toLowerCase();

  // Check all topic mappings first (most specific)
  for (const topic of Object.keys(TOPIC_MAPPINGS)) {
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

  // If message is substantial (describes a challenge), use generic topic
  if (message.length > 50 && (
    lowerMessage.includes("we") ||
    lowerMessage.includes("our") ||
    lowerMessage.includes("help") ||
    lowerMessage.includes("need") ||
    lowerMessage.includes("want") ||
    lowerMessage.includes("looking") ||
    lowerMessage.includes("challenge") ||
    lowerMessage.includes("problem") ||
    lowerMessage.includes("issue")
  )) {
    return "business challenge";
  }

  return null;
}

// Detect canvas mode from conversation content
// NOTE: AI Strategy, GTM, and Market Expansion are ONLY triggered by button clicks
// All conversation-driven content shows dynamic canvas
export function detectCanvasMode(
  userMessage: string,
  conversationHistory: string[]
): CanvasMode {
  const lowerMessage = userMessage.toLowerCase();

  // Speaking/Events - still detect from conversation (very specific intent)
  if (
    lowerMessage.includes("speaker") ||
    lowerMessage.includes("keynote") ||
    lowerMessage.includes("conference") ||
    lowerMessage.includes("speaking engagement") ||
    lowerMessage.includes("panel")
  ) {
    return "speaking";
  }

  // Scheduling - detect ready to book
  if (
    (lowerMessage.includes("book") && lowerMessage.includes("call")) ||
    (lowerMessage.includes("schedule") && lowerMessage.includes("meeting")) ||
    lowerMessage.includes("calendly") ||
    lowerMessage.includes("set up a call")
  ) {
    return "scheduling";
  }

  // Case study deep dive - explicit mentions only
  if (
    lowerMessage.includes("case study") ||
    lowerMessage.includes("arqai") ||
    lowerMessage.includes("regtech case")
  ) {
    return "case-study";
  }

  // ALL other substantive conversation → dynamic content
  const topic = extractTopic(userMessage);
  if (topic) {
    return "dynamic";
  }

  // Short messages without clear topic stay on initial
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

// Detect which service to highlight (for reference, not canvas switching)
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

// Generate dynamic content for conversation topics
export function generateDynamicContent(
  topic: string,
  userMessage: string,
  conversationHistory: string[]
): DynamicContent {
  // Get mapping from our comprehensive list
  let mapping = TOPIC_MAPPINGS[topic];

  // Check for partial matches if no exact match
  if (!mapping) {
    for (const [key, value] of Object.entries(TOPIC_MAPPINGS)) {
      if (topic.includes(key) || key.includes(topic)) {
        mapping = value;
        break;
      }
    }
  }

  // Default mapping for unmatched topics
  if (!mapping) {
    // Capitalize first letter of each word
    const formattedTopic = topic.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    mapping = {
      headline: `${formattedTopic} Strategy`,
      experience: [
        "20+ years enterprise technology experience",
        "Cross-functional leadership and delivery",
        "Global market expertise across industries"
      ],
      approach: [
        "Understand your specific challenge and context",
        "Map to proven frameworks and methodologies",
        "Execute with measurable outcomes and ROI"
      ],
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
  const lowerMessage = userMessage.toLowerCase();

  if (lowerMessage.includes("gtm") || lowerMessage.includes("sales") || lowerMessage.includes("conversion")) {
    showMetrics.push("130% growth", "50% conversion lift");
  }
  if (lowerMessage.includes("ai") || lowerMessage.includes("governance") || lowerMessage.includes("platform")) {
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
