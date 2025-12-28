import { CaseStudy, SpeakingTopic, ServiceArea } from "./types";

export const caseStudies: CaseStudy[] = [
  {
    id: "arqai",
    title: "ArqAI - Enterprise AI Platform",
    industry: "Enterprise Software / AI Infrastructure",
    challenge:
      "Strong technical AI capabilities but lacked strategic framework for enterprise adoption. Needed governance-first approach to differentiate in crowded market.",
    approach: [
      "Developed governance-first orchestration methodology",
      "Created semantic layer architecture for enterprise integration",
      "Filed 3 patent-pending methodologies for AI governance",
      "Positioned as category-defining enterprise AI platform",
    ],
    results: [
      "Won GEC Award 2025 for Innovation",
      "3 patents filed for AI governance methodologies",
      "Established category-defining market positioning",
      "Enterprise pipeline growth of 200%+",
    ],
    tags: ["AI", "Enterprise", "Governance", "Patents", "Award"],
  },
  {
    id: "regtech",
    title: "RegTech Market Expansion",
    industry: "RegTech / Financial Services",
    challenge:
      "Strong presence in India but no international footprint. Complex regulatory requirements across target regions.",
    approach: [
      "Developed multi-region GTM strategy",
      "Built GDPR and regional compliance frameworks",
      "Established channel partnerships in target markets",
      "Created localized positioning for each region",
    ],
    results: [
      "130% market growth in South Africa",
      "Successfully launched in 3 new regions",
      "Built sustainable partner network",
      "Reduced time-to-market by 40%",
    ],
    tags: ["RegTech", "Market Expansion", "GDPR", "Partnerships", "Africa"],
  },
  {
    id: "aml-saas",
    title: "AML SaaS - Conversion Optimization",
    industry: "FinTech / AML Compliance",
    challenge:
      "Long sales cycles (9-12 months) with less than 20% conversion. Disconnect between marketing and sales efforts.",
    approach: [
      "Implemented full-funnel marketing automation",
      "Aligned sales and marketing processes",
      "Created targeted content for each buying stage",
      "Built lead scoring and qualification framework",
    ],
    results: [
      "50% improvement in conversion rates",
      "25% reduction in sales cycle length",
      "3x increase in qualified pipeline",
      "Improved sales-marketing alignment score",
    ],
    tags: ["FinTech", "AML", "Conversion", "Sales", "Marketing"],
  },
];

export const speakingTopics: SpeakingTopic[] = [
  {
    id: "governance-paradox",
    title: "Solving Enterprise AI's Governance Paradox",
    description:
      "How to achieve both speed and compliance in enterprise AI deployment without sacrificing either.",
    audience: ["CIOs", "CTOs", "Enterprise Architects", "AI Leaders"],
    keyPoints: [
      "Why traditional governance kills innovation",
      "The patent-pending governance-first approach",
      "Real-world case studies from enterprise deployments",
      "Practical playbook for immediate implementation",
    ],
  },
  {
    id: "pilots-to-production",
    title: "From AI Pilots to Production",
    description:
      "Why 80% of AI pilots fail and a practical playbook to be in the successful 20%.",
    audience: ["Technology Leaders", "Product Teams", "AI/ML Teams"],
    keyPoints: [
      "The 5 failure modes of AI pilots",
      "Building production-ready AI from day one",
      "Stakeholder alignment frameworks",
      "Measuring and communicating AI value",
    ],
  },
  {
    id: "ai-ready-architecture",
    title: "AI-Ready Enterprise Architecture",
    description:
      "Building the semantic orchestration layer that makes enterprise AI actually work.",
    audience: ["Enterprise Architects", "Data Leaders", "Platform Teams"],
    keyPoints: [
      "Why current architectures aren't AI-ready",
      "The semantic orchestration pattern",
      "Data architecture for AI at scale",
      "Migration strategies for legacy systems",
    ],
  },
  {
    id: "global-gtm",
    title: "Taking Complex B2B Tech to Global Markets",
    description:
      "A multi-region playbook for scaling technology companies internationally.",
    audience: ["GTM Leaders", "Founders", "Revenue Teams"],
    keyPoints: [
      "Market selection and prioritization",
      "Regulatory navigation strategies",
      "Channel vs direct in new markets",
      "Building local credibility at scale",
    ],
  },
];

export const serviceAreas: ServiceArea[] = [
  {
    id: "ai-strategy",
    title: "AI Platform Strategy & Architecture",
    description:
      "Transform AI capabilities into enterprise-ready platforms with governance built in from day one.",
    highlights: [
      "Governance-first approach",
      "GEC Award 2025 winning methodology",
      "3 patent-pending frameworks",
      "Enterprise-scale architecture",
    ],
    icon: "brain",
  },
  {
    id: "gtm",
    title: "Go-to-Market Strategy",
    description:
      "Turn complex B2B technology into clear market positioning and revenue-generating demand.",
    highlights: [
      "130% growth track record",
      "50% conversion improvements",
      "Full-funnel optimization",
      "Sales-marketing alignment",
    ],
    icon: "rocket",
  },
  {
    id: "market-expansion",
    title: "Market Expansion",
    description:
      "Scale across regions with localized strategies that navigate regulatory complexity.",
    highlights: [
      "Multi-region launches",
      "Regulatory compliance (GDPR, etc.)",
      "Channel partnership development",
      "EU, MENA, APAC, Africa experience",
    ],
    icon: "globe",
  },
  {
    id: "speaking",
    title: "Speaking & Thought Leadership",
    description:
      "Engaging keynotes and panels on enterprise AI, governance, and global go-to-market.",
    highlights: [
      "GITEX, CIO Summit speaker",
      "Technical and business audiences",
      "Workshop facilitation",
      "Panel moderation",
    ],
    icon: "mic",
  },
];

export const proofPoints = [
  { label: "GEC Award", value: "2025", description: "Innovation Award Winner" },
  { label: "Market Growth", value: "130%", description: "Year-over-year" },
  { label: "Patents Filed", value: "3", description: "AI Governance" },
  {
    label: "Conversion Lift",
    value: "50%",
    description: "Average improvement",
  },
];

export const quickPrompts = [
  "I need help with AI strategy",
  "Looking for a speaker on AI",
  "We want to expand to new markets",
  "Help us improve our GTM",
];
