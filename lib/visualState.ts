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

// Rich dynamic content for conversation topics
export interface DynamicContent {
  topic: string;
  category: string;
  headline: string;
  subheadline: string;
  heroStats: Array<{ value: string; label: string }>;
  relevantExperience: Array<{ title: string; description: string }>;
  approachSteps: Array<{ title: string; description: string; icon: string }>;
  keyDeliverables: string[];
  toolsAndTech?: string[];
  relatedServices: string[];
  suggestedCaseStudy?: string;
  caseStudyTeaser?: string;
  ctaText: string;
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

// ============================================================================
// COMPREHENSIVE TOPIC MAPPINGS - 100+ topics across all major domains
// ============================================================================

interface TopicMapping {
  category: string;
  headline: string;
  subheadline: string;
  heroStats: Array<{ value: string; label: string }>;
  experience: Array<{ title: string; description: string }>;
  approach: Array<{ title: string; description: string; icon: string }>;
  deliverables: string[];
  tools?: string[];
  services: string[];
  caseStudy?: string;
  caseStudyTeaser?: string;
  cta: string;
}

const TOPIC_MAPPINGS: Record<string, TopicMapping> = {
  // ============================================================================
  // CUSTOMER DATA & MARTECH
  // ============================================================================
  "cdp": {
    category: "Customer Data",
    headline: "Customer Data Platform Strategy",
    subheadline: "Unify your customer data to deliver personalized experiences at scale",
    heroStats: [
      { value: "360°", label: "Customer View" },
      { value: "40%", label: "Engagement Lift" },
      { value: "3x", label: "ROI on Data" }
    ],
    experience: [
      { title: "Enterprise CDP Implementations", description: "Deployed Segment, mParticle, and custom CDP solutions for Fortune 500 companies" },
      { title: "Customer 360 Architecture", description: "Designed unified customer data models integrating 50+ data sources" },
      { title: "Real-time Personalization", description: "Built ML-powered personalization engines driving 40%+ engagement improvements" }
    ],
    approach: [
      { title: "Data Audit & Mapping", description: "Inventory all customer touchpoints and data sources across your organization", icon: "database" },
      { title: "Identity Resolution", description: "Design cross-device, cross-channel identity graph for unified profiles", icon: "users" },
      { title: "Architecture Design", description: "Select and architect the right CDP stack for your scale and use cases", icon: "layers" },
      { title: "Activation Strategy", description: "Connect CDP to marketing, sales, and service channels for real-time activation", icon: "zap" }
    ],
    deliverables: [
      "Customer data landscape assessment",
      "CDP vendor evaluation and selection",
      "Identity resolution strategy",
      "Data governance framework",
      "Implementation roadmap",
      "Activation playbook"
    ],
    tools: ["Segment", "mParticle", "Tealium", "Adobe CDP", "Salesforce CDP", "Snowflake"],
    services: ["AI Platform Strategy", "Go-to-Market Strategy"],
    caseStudy: "arqai",
    caseStudyTeaser: "See how we built a unified data platform that improved personalization by 40%",
    cta: "Design Your CDP Strategy"
  },

  "braze": {
    category: "Marketing Automation",
    headline: "Braze Implementation & Optimization",
    subheadline: "Orchestrate personalized customer journeys across every channel",
    heroStats: [
      { value: "50%", label: "Conversion Lift" },
      { value: "10x", label: "Campaign Velocity" },
      { value: "2.5x", label: "LTV Increase" }
    ],
    experience: [
      { title: "Braze Certified Partner", description: "Implemented Braze for 15+ enterprise clients across retail, fintech, and media" },
      { title: "Cross-Channel Orchestration", description: "Designed omnichannel campaigns spanning push, email, SMS, and in-app" },
      { title: "Personalization at Scale", description: "Built Liquid-powered dynamic content systems serving millions of users" }
    ],
    approach: [
      { title: "Current State Assessment", description: "Audit existing marketing stack and identify integration requirements", icon: "search" },
      { title: "Journey Mapping", description: "Map customer lifecycle stages and design engagement touchpoints", icon: "map" },
      { title: "Technical Implementation", description: "Configure Braze, integrate data sources, and build campaign templates", icon: "code" },
      { title: "Campaign Strategy", description: "Design test-and-learn frameworks for continuous optimization", icon: "target" }
    ],
    deliverables: [
      "Marketing tech stack assessment",
      "Customer journey maps",
      "Braze implementation plan",
      "Campaign templates library",
      "A/B testing framework",
      "Performance dashboards"
    ],
    tools: ["Braze", "Segment", "Amplitude", "Snowflake", "Liquid", "Looker"],
    services: ["Go-to-Market Strategy", "AI Platform Strategy"],
    caseStudy: "aml-saas",
    caseStudyTeaser: "How we achieved 50% conversion improvement through intelligent engagement",
    cta: "Optimize Your Braze Setup"
  },

  "martech": {
    category: "Marketing Technology",
    headline: "Marketing Technology Strategy",
    subheadline: "Build a modern, integrated MarTech stack that drives measurable results",
    heroStats: [
      { value: "130%", label: "Marketing ROI" },
      { value: "60%", label: "Efficiency Gain" },
      { value: "15+", label: "Tools Integrated" }
    ],
    experience: [
      { title: "MarTech Stack Design", description: "Architected end-to-end marketing technology ecosystems for enterprise brands" },
      { title: "Vendor Selection", description: "Evaluated 100+ MarTech tools and negotiated enterprise agreements" },
      { title: "Integration Architecture", description: "Built seamless data flows between marketing, sales, and analytics platforms" }
    ],
    approach: [
      { title: "Stack Assessment", description: "Audit current tools, identify gaps, and evaluate total cost of ownership", icon: "clipboard" },
      { title: "Requirements Definition", description: "Map business needs to technical requirements across the marketing funnel", icon: "file-text" },
      { title: "Vendor Evaluation", description: "Score and select vendors based on fit, scalability, and integration capabilities", icon: "check-square" },
      { title: "Implementation Roadmap", description: "Plan phased rollout with quick wins and long-term transformation", icon: "calendar" }
    ],
    deliverables: [
      "MarTech maturity assessment",
      "Stack architecture blueprint",
      "Vendor comparison matrix",
      "Integration specifications",
      "Implementation timeline",
      "Change management plan"
    ],
    tools: ["HubSpot", "Marketo", "Salesforce Marketing Cloud", "Google Marketing Platform", "Adobe Experience Cloud"],
    services: ["Go-to-Market Strategy", "AI Platform Strategy"],
    caseStudy: "aml-saas",
    caseStudyTeaser: "How we consolidated 20+ tools into an integrated stack driving 130% ROI",
    cta: "Audit Your MarTech Stack"
  },

  "marketing automation": {
    category: "Marketing Technology",
    headline: "Marketing Automation Strategy",
    subheadline: "Automate repetitive tasks and scale personalized engagement",
    heroStats: [
      { value: "70%", label: "Time Saved" },
      { value: "50%", label: "Lead Quality Up" },
      { value: "3x", label: "Pipeline Growth" }
    ],
    experience: [
      { title: "Enterprise Automation", description: "Implemented HubSpot, Marketo, and Pardot for B2B enterprises" },
      { title: "Lead Nurturing Programs", description: "Designed multi-touch nurture sequences increasing MQL-to-SQL by 50%" },
      { title: "Sales-Marketing Alignment", description: "Built integrated workflows connecting marketing automation to CRM" }
    ],
    approach: [
      { title: "Process Mapping", description: "Document current marketing workflows and identify automation opportunities", icon: "git-branch" },
      { title: "Platform Selection", description: "Evaluate and select the right automation platform for your needs", icon: "box" },
      { title: "Workflow Design", description: "Build automated sequences for lead capture, nurturing, and handoff", icon: "repeat" },
      { title: "Measurement Setup", description: "Configure attribution and reporting for full-funnel visibility", icon: "bar-chart" }
    ],
    deliverables: [
      "Automation opportunity assessment",
      "Platform recommendation",
      "Lead scoring model",
      "Nurture sequence designs",
      "Sales handoff workflows",
      "Performance dashboard"
    ],
    tools: ["HubSpot", "Marketo", "Pardot", "ActiveCampaign", "Eloqua", "Zapier"],
    services: ["Go-to-Market Strategy"],
    caseStudy: "aml-saas",
    caseStudyTeaser: "How automation drove 3x pipeline growth for a B2B SaaS company",
    cta: "Automate Your Marketing"
  },

  // ============================================================================
  // DATA & ANALYTICS
  // ============================================================================
  "data integration": {
    category: "Data & Analytics",
    headline: "Data Integration Strategy",
    subheadline: "Connect your systems and unlock the full value of your data",
    heroStats: [
      { value: "50+", label: "Sources Integrated" },
      { value: "Real-time", label: "Data Sync" },
      { value: "99.9%", label: "Data Quality" }
    ],
    experience: [
      { title: "Enterprise Data Pipelines", description: "Built real-time and batch pipelines processing billions of records daily" },
      { title: "API Architecture", description: "Designed RESTful and GraphQL APIs for seamless system connectivity" },
      { title: "Data Quality Frameworks", description: "Implemented validation, monitoring, and remediation processes" }
    ],
    approach: [
      { title: "Source Inventory", description: "Catalog all data sources, formats, and current integration methods", icon: "database" },
      { title: "Architecture Design", description: "Design scalable integration patterns (ETL, ELT, CDC, API)", icon: "layers" },
      { title: "Pipeline Development", description: "Build and deploy integration pipelines with monitoring", icon: "activity" },
      { title: "Quality Assurance", description: "Implement data quality checks and alerting systems", icon: "shield" }
    ],
    deliverables: [
      "Data source catalog",
      "Integration architecture blueprint",
      "Pipeline specifications",
      "Data quality framework",
      "Monitoring dashboard",
      "Operations runbook"
    ],
    tools: ["Fivetran", "Airbyte", "dbt", "Apache Airflow", "Kafka", "Snowflake", "Databricks"],
    services: ["AI Platform Strategy"],
    caseStudy: "arqai",
    caseStudyTeaser: "How we unified 50+ data sources into a single source of truth",
    cta: "Unify Your Data"
  },

  "analytics": {
    category: "Data & Analytics",
    headline: "Analytics & Business Intelligence",
    subheadline: "Turn data into actionable insights that drive business decisions",
    heroStats: [
      { value: "10x", label: "Faster Insights" },
      { value: "100%", label: "Self-Service" },
      { value: "85%", label: "Adoption Rate" }
    ],
    experience: [
      { title: "Enterprise BI Platforms", description: "Deployed Looker, Tableau, and Power BI for organizations up to 10,000 users" },
      { title: "Semantic Layer Design", description: "Built governed metrics layers ensuring consistent reporting across teams" },
      { title: "Analytics Culture", description: "Drove data literacy programs achieving 85%+ analyst adoption" }
    ],
    approach: [
      { title: "Requirements Discovery", description: "Interview stakeholders to understand decision-making needs", icon: "message-circle" },
      { title: "Data Modeling", description: "Design dimensional models optimized for analytical queries", icon: "box" },
      { title: "Dashboard Development", description: "Build intuitive, self-service dashboards and reports", icon: "layout" },
      { title: "Enablement Program", description: "Train users and establish governance for sustainable adoption", icon: "users" }
    ],
    deliverables: [
      "Analytics requirements document",
      "Semantic data model",
      "Executive dashboards",
      "Department-specific reports",
      "Training materials",
      "Governance guidelines"
    ],
    tools: ["Looker", "Tableau", "Power BI", "Metabase", "dbt", "Snowflake"],
    services: ["AI Platform Strategy", "Go-to-Market Strategy"],
    caseStudy: "arqai",
    caseStudyTeaser: "How we built a self-service analytics platform with 85% adoption",
    cta: "Transform Your Analytics"
  },

  "data warehouse": {
    category: "Data & Analytics",
    headline: "Data Warehouse Modernization",
    subheadline: "Migrate to a modern cloud data warehouse for speed and scale",
    heroStats: [
      { value: "100x", label: "Query Speed" },
      { value: "70%", label: "Cost Reduction" },
      { value: "PB+", label: "Scale" }
    ],
    experience: [
      { title: "Cloud Migrations", description: "Migrated legacy on-prem warehouses to Snowflake, BigQuery, and Redshift" },
      { title: "Modern Data Stack", description: "Implemented dbt, Fivetran, and Looker for complete analytics modernization" },
      { title: "Performance Optimization", description: "Achieved 100x query performance improvements through optimization" }
    ],
    approach: [
      { title: "Assessment", description: "Evaluate current warehouse, usage patterns, and migration complexity", icon: "search" },
      { title: "Platform Selection", description: "Select optimal cloud warehouse based on workload and requirements", icon: "cloud" },
      { title: "Migration Execution", description: "Migrate schemas, data, and workloads with minimal downtime", icon: "upload-cloud" },
      { title: "Optimization", description: "Tune performance and implement cost management controls", icon: "sliders" }
    ],
    deliverables: [
      "Migration assessment report",
      "Platform recommendation",
      "Migration runbook",
      "Optimized data models",
      "Cost management framework",
      "Performance benchmarks"
    ],
    tools: ["Snowflake", "BigQuery", "Redshift", "Databricks", "dbt", "Fivetran"],
    services: ["AI Platform Strategy"],
    caseStudy: "arqai",
    caseStudyTeaser: "How we cut warehouse costs 70% while improving performance 100x",
    cta: "Modernize Your Warehouse"
  },

  // ============================================================================
  // ENTERPRISE SYSTEMS
  // ============================================================================
  "sap": {
    category: "Enterprise Systems",
    headline: "SAP Strategy & Modernization",
    subheadline: "Unlock value from your SAP investment with AI-ready architecture",
    heroStats: [
      { value: "40%", label: "Process Efficiency" },
      { value: "25%", label: "Cost Reduction" },
      { value: "6mo", label: "Faster ROI" }
    ],
    experience: [
      { title: "SAP Transformations", description: "Led SAP modernization programs for Fortune 500 manufacturing and retail" },
      { title: "S/4HANA Migrations", description: "Delivered brownfield and greenfield S/4HANA implementations" },
      { title: "SAP + AI Integration", description: "Integrated AI/ML capabilities into SAP processes for intelligent automation" }
    ],
    approach: [
      { title: "Landscape Assessment", description: "Analyze current SAP footprint, customizations, and integration points", icon: "map" },
      { title: "Roadmap Development", description: "Plan migration path considering business priorities and technical debt", icon: "git-branch" },
      { title: "Architecture Design", description: "Design target architecture with cloud, AI, and analytics integration", icon: "layers" },
      { title: "Execution Planning", description: "Create detailed implementation plan with risk mitigation strategies", icon: "calendar" }
    ],
    deliverables: [
      "SAP landscape assessment",
      "Modernization roadmap",
      "Business case and ROI model",
      "Target architecture blueprint",
      "Risk mitigation plan",
      "Vendor evaluation (if applicable)"
    ],
    tools: ["SAP S/4HANA", "SAP BTP", "SAP Analytics Cloud", "SAP Integration Suite", "Signavio"],
    services: ["AI Platform Strategy", "Go-to-Market Strategy"],
    caseStudy: "arqai",
    caseStudyTeaser: "How we modernized an SAP landscape to enable AI-driven operations",
    cta: "Plan Your SAP Journey"
  },

  "s4hana": {
    category: "Enterprise Systems",
    headline: "S/4HANA Migration Strategy",
    subheadline: "Navigate your S/4HANA journey with a proven methodology",
    heroStats: [
      { value: "50%", label: "Faster Close" },
      { value: "30%", label: "TCO Reduction" },
      { value: "Real-time", label: "Analytics" }
    ],
    experience: [
      { title: "Migration Expertise", description: "Delivered 10+ S/4HANA migrations across manufacturing, retail, and services" },
      { title: "Brownfield & Greenfield", description: "Experience with system conversion, selective data transition, and new implementations" },
      { title: "Change Management", description: "Led organizational change programs ensuring user adoption and business continuity" }
    ],
    approach: [
      { title: "Readiness Assessment", description: "Evaluate technical readiness, custom code, and business process fit", icon: "clipboard" },
      { title: "Migration Strategy", description: "Define optimal migration approach (brownfield, greenfield, selective)", icon: "git-merge" },
      { title: "Fit-to-Standard Analysis", description: "Map current processes to S/4HANA best practices", icon: "check-square" },
      { title: "Implementation Planning", description: "Create detailed project plan with milestones and dependencies", icon: "calendar" }
    ],
    deliverables: [
      "Readiness assessment report",
      "Migration strategy recommendation",
      "Custom code remediation plan",
      "Fit-to-standard analysis",
      "Project plan and timeline",
      "Change management strategy"
    ],
    tools: ["SAP S/4HANA", "SAP Readiness Check", "ABAP Test Cockpit", "SAP LT", "SAP BTP"],
    services: ["AI Platform Strategy"],
    caseStudy: "arqai",
    caseStudyTeaser: "How we delivered a seamless S/4HANA migration with zero business disruption",
    cta: "Start Your S/4HANA Journey"
  },

  "erp": {
    category: "Enterprise Systems",
    headline: "ERP Strategy & Selection",
    subheadline: "Choose and implement the right ERP to power your business",
    heroStats: [
      { value: "35%", label: "Efficiency Gain" },
      { value: "Single", label: "Source of Truth" },
      { value: "20%", label: "Cost Savings" }
    ],
    experience: [
      { title: "ERP Selection", description: "Led vendor evaluation and selection for SAP, Oracle, NetSuite, and D365" },
      { title: "Implementation Leadership", description: "Delivered full-lifecycle ERP implementations for mid-market and enterprise" },
      { title: "Process Optimization", description: "Redesigned business processes to maximize ERP value" }
    ],
    approach: [
      { title: "Requirements Gathering", description: "Document functional and technical requirements across all business units", icon: "file-text" },
      { title: "Vendor Evaluation", description: "Score vendors on fit, TCO, implementation risk, and strategic alignment", icon: "check-square" },
      { title: "Process Design", description: "Map future-state processes aligned with ERP best practices", icon: "git-branch" },
      { title: "Implementation Planning", description: "Define phased rollout approach with clear success metrics", icon: "calendar" }
    ],
    deliverables: [
      "Business requirements document",
      "Vendor evaluation scorecard",
      "TCO analysis",
      "Future-state process maps",
      "Implementation roadmap",
      "Change management plan"
    ],
    tools: ["SAP", "Oracle", "Microsoft Dynamics", "NetSuite", "Workday", "Infor"],
    services: ["AI Platform Strategy", "Go-to-Market Strategy"],
    caseStudy: "arqai",
    caseStudyTeaser: "How we helped a $500M company select and implement their ERP",
    cta: "Evaluate Your ERP Options"
  },

  "salesforce": {
    category: "CRM & Sales Tech",
    headline: "Salesforce Strategy & Implementation",
    subheadline: "Maximize your Salesforce investment with best-practice implementation",
    heroStats: [
      { value: "50%", label: "Sales Productivity" },
      { value: "360°", label: "Customer View" },
      { value: "30%", label: "Pipeline Growth" }
    ],
    experience: [
      { title: "Salesforce Certified", description: "Certified Salesforce architect with 50+ implementations across industries" },
      { title: "Multi-Cloud Expertise", description: "Experience across Sales, Service, Marketing, and Commerce clouds" },
      { title: "Enterprise Scale", description: "Deployed Salesforce for organizations with 10,000+ users globally" }
    ],
    approach: [
      { title: "Discovery", description: "Map sales processes, data requirements, and integration needs", icon: "search" },
      { title: "Architecture Design", description: "Design scalable Salesforce architecture with proper data model", icon: "layers" },
      { title: "Implementation", description: "Configure, customize, and integrate with best-practice methodology", icon: "code" },
      { title: "Adoption & Training", description: "Drive user adoption through training and change management", icon: "users" }
    ],
    deliverables: [
      "Sales process documentation",
      "Salesforce architecture design",
      "Data migration plan",
      "Integration specifications",
      "Training materials",
      "Admin playbook"
    ],
    tools: ["Salesforce Sales Cloud", "Salesforce Service Cloud", "Salesforce CPQ", "MuleSoft", "Tableau CRM"],
    services: ["Go-to-Market Strategy", "AI Platform Strategy"],
    caseStudy: "aml-saas",
    caseStudyTeaser: "How we transformed sales operations driving 50% productivity improvement",
    cta: "Optimize Your Salesforce"
  },

  "crm": {
    category: "CRM & Sales Tech",
    headline: "CRM Strategy & Optimization",
    subheadline: "Build a CRM foundation that accelerates revenue growth",
    heroStats: [
      { value: "40%", label: "Win Rate Increase" },
      { value: "25%", label: "Sales Cycle Reduction" },
      { value: "95%", label: "Data Accuracy" }
    ],
    experience: [
      { title: "CRM Transformations", description: "Redesigned CRM strategies for companies from startup to Fortune 500" },
      { title: "Platform Expertise", description: "Deep experience with Salesforce, HubSpot, Dynamics, and Pipedrive" },
      { title: "Sales Process Design", description: "Optimized sales methodologies integrated with CRM workflows" }
    ],
    approach: [
      { title: "Process Assessment", description: "Evaluate current sales process and CRM utilization", icon: "clipboard" },
      { title: "Data Strategy", description: "Clean, enrich, and structure customer data for accuracy", icon: "database" },
      { title: "Workflow Optimization", description: "Redesign CRM workflows to match best-practice sales motions", icon: "repeat" },
      { title: "Reporting & Insights", description: "Build dashboards for pipeline visibility and forecasting", icon: "bar-chart" }
    ],
    deliverables: [
      "CRM health assessment",
      "Sales process redesign",
      "Data quality improvement plan",
      "Workflow configurations",
      "Sales dashboards",
      "User training program"
    ],
    tools: ["Salesforce", "HubSpot", "Microsoft Dynamics", "Pipedrive", "Zoho CRM"],
    services: ["Go-to-Market Strategy"],
    caseStudy: "aml-saas",
    caseStudyTeaser: "How CRM optimization drove 40% improvement in win rates",
    cta: "Transform Your CRM"
  },

  // ============================================================================
  // AI & MACHINE LEARNING
  // ============================================================================
  "ai": {
    category: "AI & Machine Learning",
    headline: "AI Strategy & Implementation",
    subheadline: "Harness AI to transform operations and create competitive advantage",
    heroStats: [
      { value: "GEC 2025", label: "Award Winner" },
      { value: "3", label: "Patents Filed" },
      { value: "40%", label: "Efficiency Gains" }
    ],
    experience: [
      { title: "AI Governance Pioneer", description: "Won GEC Award 2025 for AI governance methodology" },
      { title: "Enterprise AI Platforms", description: "Built AI platforms processing millions of predictions daily" },
      { title: "Responsible AI", description: "Developed frameworks for ethical, explainable, and governed AI" }
    ],
    approach: [
      { title: "AI Readiness Assessment", description: "Evaluate data, infrastructure, and organizational readiness for AI", icon: "clipboard" },
      { title: "Use Case Prioritization", description: "Identify and score AI opportunities by value and feasibility", icon: "target" },
      { title: "Architecture Design", description: "Design scalable AI infrastructure with proper governance", icon: "layers" },
      { title: "Implementation & Scale", description: "Build, deploy, and scale AI solutions with MLOps best practices", icon: "trending-up" }
    ],
    deliverables: [
      "AI readiness assessment",
      "Use case portfolio with ROI",
      "AI architecture blueprint",
      "Governance framework",
      "Implementation roadmap",
      "MLOps strategy"
    ],
    tools: ["OpenAI", "Azure AI", "AWS SageMaker", "Databricks", "MLflow", "Weights & Biases"],
    services: ["AI Platform Strategy"],
    caseStudy: "arqai",
    caseStudyTeaser: "The award-winning AI platform that redefined enterprise governance",
    cta: "Define Your AI Strategy"
  },

  "machine learning": {
    category: "AI & Machine Learning",
    headline: "Machine Learning Implementation",
    subheadline: "Deploy production ML systems that deliver measurable business value",
    heroStats: [
      { value: "10M+", label: "Predictions/Day" },
      { value: "95%", label: "Model Accuracy" },
      { value: "5x", label: "Faster Deployment" }
    ],
    experience: [
      { title: "Production ML Systems", description: "Deployed ML models serving millions of real-time predictions" },
      { title: "MLOps Excellence", description: "Built CI/CD pipelines for automated model training and deployment" },
      { title: "Feature Engineering", description: "Designed feature stores powering 100+ production models" }
    ],
    approach: [
      { title: "Problem Framing", description: "Define ML problem, success metrics, and business integration points", icon: "target" },
      { title: "Data Preparation", description: "Build data pipelines and feature engineering workflows", icon: "database" },
      { title: "Model Development", description: "Train, evaluate, and select optimal models for the use case", icon: "cpu" },
      { title: "Production Deployment", description: "Deploy with monitoring, versioning, and automated retraining", icon: "upload-cloud" }
    ],
    deliverables: [
      "ML problem definition",
      "Feature engineering pipeline",
      "Trained model with documentation",
      "MLOps infrastructure",
      "Monitoring dashboard",
      "Model maintenance runbook"
    ],
    tools: ["Python", "TensorFlow", "PyTorch", "scikit-learn", "MLflow", "Kubeflow", "SageMaker"],
    services: ["AI Platform Strategy"],
    caseStudy: "arqai",
    caseStudyTeaser: "How we built an ML platform processing 10M+ predictions daily",
    cta: "Build Your ML Capability"
  },

  "generative ai": {
    category: "AI & Machine Learning",
    headline: "Generative AI Strategy",
    subheadline: "Leverage LLMs and generative AI to transform your business",
    heroStats: [
      { value: "80%", label: "Task Automation" },
      { value: "10x", label: "Content Velocity" },
      { value: "Enterprise", label: "Grade Security" }
    ],
    experience: [
      { title: "Enterprise GenAI", description: "Deployed GPT-4 and Claude solutions for Fortune 500 companies" },
      { title: "RAG Architectures", description: "Built retrieval-augmented generation systems over enterprise knowledge bases" },
      { title: "AI Governance", description: "Implemented guardrails, monitoring, and compliance for GenAI deployments" }
    ],
    approach: [
      { title: "Use Case Discovery", description: "Identify high-value GenAI applications across your organization", icon: "search" },
      { title: "Architecture Design", description: "Design secure, scalable GenAI architecture with proper controls", icon: "layers" },
      { title: "Implementation", description: "Build and deploy GenAI solutions with enterprise integrations", icon: "code" },
      { title: "Governance & Monitoring", description: "Implement guardrails, monitoring, and continuous improvement", icon: "shield" }
    ],
    deliverables: [
      "GenAI use case assessment",
      "Architecture blueprint",
      "Security and governance framework",
      "Implementation playbook",
      "Prompt engineering guidelines",
      "Monitoring and optimization plan"
    ],
    tools: ["OpenAI GPT-4", "Anthropic Claude", "Azure OpenAI", "LangChain", "Pinecone", "Weaviate"],
    services: ["AI Platform Strategy"],
    caseStudy: "arqai",
    caseStudyTeaser: "How we deployed enterprise GenAI with bulletproof governance",
    cta: "Explore GenAI Opportunities"
  },

  "llm": {
    category: "AI & Machine Learning",
    headline: "LLM Strategy & Implementation",
    subheadline: "Deploy large language models that understand your business context",
    heroStats: [
      { value: "Custom", label: "Fine-tuning" },
      { value: "RAG", label: "Architecture" },
      { value: "Enterprise", label: "Integration" }
    ],
    experience: [
      { title: "LLM Fine-tuning", description: "Fine-tuned LLMs on domain-specific data for improved accuracy" },
      { title: "RAG Systems", description: "Built retrieval systems over millions of enterprise documents" },
      { title: "Multi-modal AI", description: "Deployed vision-language models for document and image understanding" }
    ],
    approach: [
      { title: "Requirements Analysis", description: "Define use cases, accuracy requirements, and latency constraints", icon: "file-text" },
      { title: "Model Selection", description: "Evaluate and select optimal LLMs (proprietary vs open-source)", icon: "check-square" },
      { title: "Knowledge Integration", description: "Build RAG pipeline over your enterprise knowledge base", icon: "database" },
      { title: "Deployment & Optimization", description: "Deploy with caching, monitoring, and cost optimization", icon: "upload-cloud" }
    ],
    deliverables: [
      "LLM requirements specification",
      "Model evaluation report",
      "RAG architecture design",
      "Fine-tuning strategy (if needed)",
      "Deployment infrastructure",
      "Cost optimization plan"
    ],
    tools: ["GPT-4", "Claude", "Llama", "Mistral", "LangChain", "LlamaIndex", "Vector DBs"],
    services: ["AI Platform Strategy"],
    caseStudy: "arqai",
    caseStudyTeaser: "How we built an LLM system that understands 10 years of enterprise data",
    cta: "Deploy Your LLM Strategy"
  },

  // ============================================================================
  // SALES & GTM
  // ============================================================================
  "sales": {
    category: "Sales & GTM",
    headline: "Sales Strategy & Enablement",
    subheadline: "Build a high-performance sales organization that consistently wins",
    heroStats: [
      { value: "50%", label: "Conversion Lift" },
      { value: "130%", label: "Quota Attainment" },
      { value: "40%", label: "Cycle Reduction" }
    ],
    experience: [
      { title: "Sales Transformation", description: "Led sales transformations driving 130%+ quota attainment" },
      { title: "Enterprise Sales", description: "Built and scaled enterprise sales teams from $0 to $50M ARR" },
      { title: "Sales Methodology", description: "Implemented MEDDIC, Challenger, and value-based selling frameworks" }
    ],
    approach: [
      { title: "Sales Diagnostic", description: "Analyze pipeline, win/loss, and rep performance data", icon: "bar-chart" },
      { title: "Process Redesign", description: "Optimize sales stages, qualification criteria, and handoffs", icon: "git-branch" },
      { title: "Enablement Program", description: "Develop training, playbooks, and coaching programs", icon: "book" },
      { title: "Tech Optimization", description: "Configure CRM and sales tools for maximum productivity", icon: "settings" }
    ],
    deliverables: [
      "Sales diagnostic report",
      "Redesigned sales process",
      "Sales playbook",
      "Training curriculum",
      "CRM optimization plan",
      "Performance dashboards"
    ],
    tools: ["Salesforce", "Gong", "Outreach", "LinkedIn Sales Navigator", "ZoomInfo", "Clari"],
    services: ["Go-to-Market Strategy"],
    caseStudy: "aml-saas",
    caseStudyTeaser: "How we transformed a sales team to achieve 130% quota attainment",
    cta: "Transform Your Sales"
  },

  "revenue operations": {
    category: "Sales & GTM",
    headline: "Revenue Operations Strategy",
    subheadline: "Align sales, marketing, and CS for predictable revenue growth",
    heroStats: [
      { value: "25%", label: "Revenue Growth" },
      { value: "95%", label: "Forecast Accuracy" },
      { value: "Single", label: "Source of Truth" }
    ],
    experience: [
      { title: "RevOps Transformation", description: "Built RevOps functions driving 25%+ revenue growth" },
      { title: "Tech Stack Design", description: "Architected integrated revenue tech stacks across GTM teams" },
      { title: "Process Optimization", description: "Redesigned lead-to-cash processes for efficiency and visibility" }
    ],
    approach: [
      { title: "Current State Assessment", description: "Audit processes, tools, and data across GTM functions", icon: "clipboard" },
      { title: "Operating Model Design", description: "Define RevOps structure, roles, and responsibilities", icon: "users" },
      { title: "Process Unification", description: "Standardize processes and metrics across sales, marketing, and CS", icon: "git-merge" },
      { title: "Tech Stack Integration", description: "Connect and optimize GTM tools for single source of truth", icon: "link" }
    ],
    deliverables: [
      "RevOps maturity assessment",
      "Operating model design",
      "Unified process documentation",
      "Tech stack architecture",
      "Revenue dashboards",
      "Forecasting framework"
    ],
    tools: ["Salesforce", "HubSpot", "Clari", "Gong", "LeanData", "ChurnZero"],
    services: ["Go-to-Market Strategy"],
    caseStudy: "aml-saas",
    caseStudyTeaser: "How RevOps transformation drove 25% revenue growth in 12 months",
    cta: "Build Your RevOps Function"
  },

  "pricing": {
    category: "Sales & GTM",
    headline: "Pricing Strategy",
    subheadline: "Optimize pricing to maximize revenue and market penetration",
    heroStats: [
      { value: "20%", label: "Revenue Lift" },
      { value: "15%", label: "Margin Improvement" },
      { value: "Value", label: "Based Pricing" }
    ],
    experience: [
      { title: "SaaS Pricing", description: "Designed pricing strategies for 20+ B2B SaaS companies" },
      { title: "Enterprise Deals", description: "Structured complex enterprise pricing and packaging" },
      { title: "Price Optimization", description: "Implemented dynamic pricing driving 20%+ revenue lift" }
    ],
    approach: [
      { title: "Value Analysis", description: "Quantify customer value and willingness to pay", icon: "dollar-sign" },
      { title: "Competitive Positioning", description: "Analyze competitor pricing and market positioning", icon: "target" },
      { title: "Model Design", description: "Design pricing model, tiers, and packaging strategy", icon: "package" },
      { title: "Testing & Optimization", description: "Implement and test pricing with continuous optimization", icon: "trending-up" }
    ],
    deliverables: [
      "Value analysis report",
      "Competitive pricing analysis",
      "Pricing model recommendation",
      "Packaging strategy",
      "Sales enablement materials",
      "Testing framework"
    ],
    tools: ["ProfitWell", "Price Intelligently", "Chargebee", "Stripe", "Salesforce CPQ"],
    services: ["Go-to-Market Strategy"],
    caseStudy: "aml-saas",
    caseStudyTeaser: "How pricing optimization drove 20% revenue lift without losing customers",
    cta: "Optimize Your Pricing"
  },

  // ============================================================================
  // PRODUCT & GROWTH
  // ============================================================================
  "product": {
    category: "Product & Growth",
    headline: "Product Strategy & Development",
    subheadline: "Build products that customers love and markets reward",
    heroStats: [
      { value: "PMF", label: "Achieved" },
      { value: "3x", label: "Engagement" },
      { value: "$50M+", label: "Products Built" }
    ],
    experience: [
      { title: "Product Leadership", description: "Built and scaled enterprise SaaS products to $50M+ ARR" },
      { title: "Product-Market Fit", description: "Achieved PMF for 5+ B2B products through systematic discovery" },
      { title: "Platform Strategy", description: "Designed platform architectures enabling ecosystem growth" }
    ],
    approach: [
      { title: "Market Discovery", description: "Validate market opportunity through customer research", icon: "search" },
      { title: "Product Definition", description: "Define product vision, strategy, and prioritized roadmap", icon: "map" },
      { title: "Development Execution", description: "Guide agile development with clear requirements and feedback loops", icon: "code" },
      { title: "Launch & Iterate", description: "Execute go-to-market and drive continuous improvement", icon: "rocket" }
    ],
    deliverables: [
      "Market opportunity assessment",
      "Product vision and strategy",
      "Prioritized roadmap",
      "PRDs and specifications",
      "Launch plan",
      "Success metrics framework"
    ],
    tools: ["Productboard", "Amplitude", "Mixpanel", "Figma", "Jira", "Linear"],
    services: ["AI Platform Strategy", "Go-to-Market Strategy"],
    caseStudy: "arqai",
    caseStudyTeaser: "How we built an award-winning AI product from concept to market",
    cta: "Define Your Product Strategy"
  },

  "growth": {
    category: "Product & Growth",
    headline: "Growth Strategy",
    subheadline: "Unlock scalable growth with data-driven experimentation",
    heroStats: [
      { value: "130%", label: "YoY Growth" },
      { value: "3x", label: "User Acquisition" },
      { value: "50%", label: "Retention Lift" }
    ],
    experience: [
      { title: "Growth Leadership", description: "Drove 130%+ YoY growth for B2B SaaS companies" },
      { title: "Full-Funnel Optimization", description: "Optimized acquisition, activation, retention, and referral" },
      { title: "Experimentation", description: "Built growth experimentation programs running 100+ tests/quarter" }
    ],
    approach: [
      { title: "Growth Audit", description: "Analyze funnel metrics, cohorts, and growth levers", icon: "bar-chart" },
      { title: "Opportunity Identification", description: "Identify and prioritize highest-impact growth opportunities", icon: "target" },
      { title: "Experiment Design", description: "Design and execute rapid experimentation program", icon: "flask" },
      { title: "Scale Winners", description: "Double down on winning experiments and scale systematically", icon: "trending-up" }
    ],
    deliverables: [
      "Growth audit report",
      "Opportunity backlog",
      "Experimentation framework",
      "Growth model",
      "Dashboards and tracking",
      "Playbooks for scale"
    ],
    tools: ["Amplitude", "Mixpanel", "Optimizely", "LaunchDarkly", "Segment", "Google Analytics"],
    services: ["Go-to-Market Strategy", "Market Expansion"],
    caseStudy: "aml-saas",
    caseStudyTeaser: "How we achieved 130% YoY growth through systematic experimentation",
    cta: "Accelerate Your Growth"
  },

  "startup": {
    category: "Product & Growth",
    headline: "Startup Advisory",
    subheadline: "Navigate the startup journey with battle-tested guidance",
    heroStats: [
      { value: "5+", label: "Startups Scaled" },
      { value: "$50M+", label: "Funding Raised" },
      { value: "Exit", label: "Experience" }
    ],
    experience: [
      { title: "Founder Experience", description: "Built and scaled startups from zero to acquisition" },
      { title: "Investor Relations", description: "Helped raise $50M+ across seed, Series A, and B rounds" },
      { title: "Scale-up Leadership", description: "Guided startups through critical growth inflection points" }
    ],
    approach: [
      { title: "Assessment", description: "Evaluate product-market fit, team, and growth potential", icon: "clipboard" },
      { title: "Strategy Definition", description: "Define go-to-market strategy and resource allocation", icon: "map" },
      { title: "Execution Support", description: "Provide hands-on support for critical initiatives", icon: "users" },
      { title: "Fundraising Prep", description: "Prepare materials and positioning for investor conversations", icon: "dollar-sign" }
    ],
    deliverables: [
      "Business assessment",
      "GTM strategy",
      "Investor deck",
      "Financial model",
      "Hiring plan",
      "Advisory engagement"
    ],
    tools: ["Notion", "Pitch", "Carta", "Mercury", "Stripe", "AWS/GCP"],
    services: ["Go-to-Market Strategy", "Market Expansion"],
    caseStudy: "aml-saas",
    caseStudyTeaser: "How we helped a startup achieve product-market fit and scale to Series A",
    cta: "Get Startup Guidance"
  },

  "saas": {
    category: "Product & Growth",
    headline: "SaaS Growth Strategy",
    subheadline: "Scale your SaaS business with proven playbooks",
    heroStats: [
      { value: "50%", label: "Conversion Lift" },
      { value: "120%", label: "Net Retention" },
      { value: "3x", label: "ARR Growth" }
    ],
    experience: [
      { title: "SaaS Scaling", description: "Scaled B2B SaaS companies from $1M to $50M ARR" },
      { title: "Metrics Optimization", description: "Improved key SaaS metrics: CAC, LTV, NRR, and payback period" },
      { title: "PLG + Sales", description: "Built hybrid product-led and sales-led growth motions" }
    ],
    approach: [
      { title: "Metrics Deep Dive", description: "Analyze unit economics, cohorts, and growth efficiency", icon: "bar-chart" },
      { title: "Motion Design", description: "Design optimal growth motion (PLG, sales-led, or hybrid)", icon: "git-branch" },
      { title: "Funnel Optimization", description: "Optimize conversion, activation, and retention funnels", icon: "filter" },
      { title: "Scale Playbooks", description: "Build repeatable playbooks for customer acquisition", icon: "book" }
    ],
    deliverables: [
      "SaaS metrics analysis",
      "Growth motion recommendation",
      "Funnel optimization plan",
      "Pricing and packaging review",
      "Go-to-market playbooks",
      "Investor-ready metrics dashboard"
    ],
    tools: ["ChartMogul", "ProfitWell", "Amplitude", "Intercom", "Segment", "Stripe"],
    services: ["Go-to-Market Strategy"],
    caseStudy: "aml-saas",
    caseStudyTeaser: "How we drove 50% conversion lift and 3x ARR growth for a B2B SaaS",
    cta: "Scale Your SaaS"
  },

  // ============================================================================
  // DIGITAL TRANSFORMATION
  // ============================================================================
  "digital transformation": {
    category: "Digital Transformation",
    headline: "Digital Transformation Strategy",
    subheadline: "Modernize your business for the digital age",
    heroStats: [
      { value: "40%", label: "Cost Reduction" },
      { value: "2x", label: "Speed to Market" },
      { value: "NPS+30", label: "Customer Experience" }
    ],
    experience: [
      { title: "Enterprise Transformation", description: "Led digital transformations for Fortune 500 companies" },
      { title: "Technology Modernization", description: "Modernized legacy systems to cloud-native architectures" },
      { title: "Change Leadership", description: "Drove organizational change ensuring lasting adoption" }
    ],
    approach: [
      { title: "Maturity Assessment", description: "Evaluate digital maturity across people, process, and technology", icon: "clipboard" },
      { title: "Vision & Strategy", description: "Define digital vision aligned with business objectives", icon: "eye" },
      { title: "Roadmap Development", description: "Create phased transformation roadmap with quick wins", icon: "map" },
      { title: "Execution & Change", description: "Execute transformation with robust change management", icon: "refresh-cw" }
    ],
    deliverables: [
      "Digital maturity assessment",
      "Transformation vision",
      "Strategic roadmap",
      "Business case and ROI",
      "Change management plan",
      "Governance framework"
    ],
    tools: ["Cloud platforms", "Low-code tools", "Integration platforms", "Analytics tools"],
    services: ["AI Platform Strategy", "Go-to-Market Strategy"],
    caseStudy: "arqai",
    caseStudyTeaser: "How we transformed a legacy enterprise into a digital leader",
    cta: "Start Your Transformation"
  },

  "automation": {
    category: "Digital Transformation",
    headline: "Process Automation Strategy",
    subheadline: "Automate manual processes to boost efficiency and reduce errors",
    heroStats: [
      { value: "80%", label: "Time Saved" },
      { value: "99%", label: "Error Reduction" },
      { value: "5x", label: "Throughput" }
    ],
    experience: [
      { title: "Enterprise Automation", description: "Delivered automation programs saving millions in operational costs" },
      { title: "RPA + AI", description: "Combined RPA with AI for intelligent process automation" },
      { title: "Workflow Design", description: "Redesigned end-to-end workflows for automation readiness" }
    ],
    approach: [
      { title: "Process Discovery", description: "Identify and document automation candidates across the organization", icon: "search" },
      { title: "Opportunity Assessment", description: "Score processes by automation potential and business value", icon: "target" },
      { title: "Solution Design", description: "Design automation solutions (RPA, workflow, AI, or hybrid)", icon: "cpu" },
      { title: "Implementation", description: "Build, test, and deploy with proper governance", icon: "play" }
    ],
    deliverables: [
      "Process inventory",
      "Automation opportunity assessment",
      "Solution architecture",
      "ROI business case",
      "Implementation plan",
      "Operating model"
    ],
    tools: ["UiPath", "Automation Anywhere", "Power Automate", "Zapier", "Workato", "n8n"],
    services: ["AI Platform Strategy", "Go-to-Market Strategy"],
    caseStudy: "arqai",
    caseStudyTeaser: "How we automated 80% of manual processes saving $2M annually",
    cta: "Automate Your Processes"
  },

  "cloud": {
    category: "Digital Transformation",
    headline: "Cloud Strategy & Migration",
    subheadline: "Accelerate innovation with cloud-native architecture",
    heroStats: [
      { value: "60%", label: "Cost Savings" },
      { value: "10x", label: "Deployment Speed" },
      { value: "99.99%", label: "Availability" }
    ],
    experience: [
      { title: "Cloud Migrations", description: "Migrated 100+ enterprise applications to AWS, Azure, and GCP" },
      { title: "Cloud-Native", description: "Designed and built cloud-native applications at scale" },
      { title: "Multi-Cloud", description: "Architected multi-cloud strategies for resilience and cost optimization" }
    ],
    approach: [
      { title: "Assessment", description: "Evaluate current infrastructure and cloud readiness", icon: "clipboard" },
      { title: "Strategy Design", description: "Define cloud strategy, platform selection, and migration approach", icon: "cloud" },
      { title: "Migration Execution", description: "Execute migration with minimal disruption and risk", icon: "upload-cloud" },
      { title: "Optimization", description: "Continuously optimize for cost, performance, and security", icon: "sliders" }
    ],
    deliverables: [
      "Cloud readiness assessment",
      "Cloud strategy document",
      "Migration roadmap",
      "Architecture blueprints",
      "Cost optimization plan",
      "Security and compliance framework"
    ],
    tools: ["AWS", "Azure", "GCP", "Terraform", "Kubernetes", "Docker"],
    services: ["AI Platform Strategy"],
    caseStudy: "arqai",
    caseStudyTeaser: "How we migrated to cloud and reduced infrastructure costs by 60%",
    cta: "Plan Your Cloud Journey"
  },

  // ============================================================================
  // COMPLIANCE & GOVERNANCE
  // ============================================================================
  "compliance": {
    category: "Compliance & Governance",
    headline: "Compliance Strategy",
    subheadline: "Build compliance into your DNA without slowing innovation",
    heroStats: [
      { value: "GEC 2025", label: "Award Winner" },
      { value: "Zero", label: "Audit Findings" },
      { value: "3x", label: "Faster Audits" }
    ],
    experience: [
      { title: "Regulatory Expertise", description: "Navigated SOC2, GDPR, HIPAA, and financial regulations" },
      { title: "AI Governance", description: "Won GEC Award 2025 for AI governance framework design" },
      { title: "Audit Excellence", description: "Achieved clean audits for 20+ enterprise clients" }
    ],
    approach: [
      { title: "Gap Assessment", description: "Identify compliance gaps against relevant frameworks", icon: "clipboard" },
      { title: "Control Design", description: "Design controls that meet requirements without hindering operations", icon: "shield" },
      { title: "Implementation", description: "Implement controls with automation where possible", icon: "settings" },
      { title: "Continuous Monitoring", description: "Establish ongoing monitoring and audit readiness", icon: "eye" }
    ],
    deliverables: [
      "Compliance gap assessment",
      "Control framework",
      "Policy documentation",
      "Implementation roadmap",
      "Audit preparation materials",
      "Monitoring dashboard"
    ],
    tools: ["Vanta", "Drata", "Secureframe", "OneTrust", "ServiceNow GRC"],
    services: ["AI Platform Strategy"],
    caseStudy: "arqai",
    caseStudyTeaser: "How our governance framework won the GEC Award 2025",
    cta: "Strengthen Your Compliance"
  },

  "gdpr": {
    category: "Compliance & Governance",
    headline: "GDPR & Privacy Strategy",
    subheadline: "Turn privacy compliance into a competitive advantage",
    heroStats: [
      { value: "100%", label: "GDPR Compliant" },
      { value: "Privacy", label: "By Design" },
      { value: "Trust", label: "Building" }
    ],
    experience: [
      { title: "GDPR Programs", description: "Led GDPR compliance programs for multinational enterprises" },
      { title: "Privacy Engineering", description: "Designed privacy-by-design architectures for data platforms" },
      { title: "Cross-Border Data", description: "Navigated complex international data transfer requirements" }
    ],
    approach: [
      { title: "Data Mapping", description: "Map personal data flows across your organization", icon: "map" },
      { title: "Gap Assessment", description: "Identify gaps against GDPR requirements", icon: "search" },
      { title: "Privacy Program", description: "Build comprehensive privacy program and governance", icon: "shield" },
      { title: "Technical Controls", description: "Implement privacy-enhancing technologies and controls", icon: "lock" }
    ],
    deliverables: [
      "Data processing inventory",
      "Gap assessment report",
      "Privacy program design",
      "Policy templates",
      "Technical requirements",
      "Training materials"
    ],
    tools: ["OneTrust", "BigID", "Securiti", "TrustArc", "DataGrail"],
    services: ["AI Platform Strategy", "Market Expansion"],
    caseStudy: "regtech",
    caseStudyTeaser: "How we achieved GDPR compliance while expanding across Europe",
    cta: "Get Privacy Right"
  },

  // ============================================================================
  // INDUSTRY VERTICALS
  // ============================================================================
  "fintech": {
    category: "Financial Services",
    headline: "FinTech Strategy",
    subheadline: "Navigate fintech complexity with regulatory-aware innovation",
    heroStats: [
      { value: "RegTech", label: "Pioneer" },
      { value: "Multi-Region", label: "Launches" },
      { value: "SOC2+", label: "Compliant" }
    ],
    experience: [
      { title: "RegTech Leadership", description: "Built and scaled RegTech products across multiple jurisdictions" },
      { title: "AML/KYC Solutions", description: "Designed compliance solutions for financial institutions" },
      { title: "Financial Services GTM", description: "Launched fintech products in US, EU, and MENA markets" }
    ],
    approach: [
      { title: "Regulatory Mapping", description: "Map regulatory requirements across target markets", icon: "file-text" },
      { title: "Product Strategy", description: "Design products with compliance built-in from day one", icon: "layers" },
      { title: "GTM Planning", description: "Develop market entry strategy with regulatory considerations", icon: "map" },
      { title: "Execution Support", description: "Support implementation and regulatory engagement", icon: "users" }
    ],
    deliverables: [
      "Regulatory landscape analysis",
      "Compliance-ready architecture",
      "Go-to-market strategy",
      "Partnership framework",
      "Risk management plan",
      "Implementation roadmap"
    ],
    tools: ["Core banking systems", "Payment gateways", "KYC/AML tools", "Regulatory reporting"],
    services: ["AI Platform Strategy", "Market Expansion"],
    caseStudy: "regtech",
    caseStudyTeaser: "How we launched a RegTech product across 3 continents",
    cta: "Explore FinTech Opportunities"
  },

  "healthtech": {
    category: "Healthcare",
    headline: "HealthTech Strategy",
    subheadline: "Innovate in healthcare while maintaining patient trust and compliance",
    heroStats: [
      { value: "HIPAA", label: "Compliant" },
      { value: "10M+", label: "Patients Served" },
      { value: "FDA", label: "Experience" }
    ],
    experience: [
      { title: "Healthcare Platforms", description: "Built patient engagement and clinical workflow platforms" },
      { title: "HIPAA Compliance", description: "Designed HIPAA-compliant architectures for health data" },
      { title: "Health AI", description: "Deployed AI solutions for clinical and operational use cases" }
    ],
    approach: [
      { title: "Compliance Assessment", description: "Evaluate HIPAA, FDA, and other regulatory requirements", icon: "shield" },
      { title: "Product Strategy", description: "Define product strategy with healthcare workflows in mind", icon: "heart" },
      { title: "Architecture Design", description: "Design compliant, scalable technical architecture", icon: "layers" },
      { title: "GTM Planning", description: "Develop go-to-market strategy for healthcare buyers", icon: "map" }
    ],
    deliverables: [
      "Regulatory requirements analysis",
      "Product strategy document",
      "Compliance architecture",
      "Go-to-market plan",
      "Security documentation",
      "Implementation roadmap"
    ],
    tools: ["EHR systems", "FHIR", "HL7", "Healthcare clouds", "Compliance tools"],
    services: ["AI Platform Strategy", "Go-to-Market Strategy"],
    caseStudy: "arqai",
    caseStudyTeaser: "How we built a compliant health AI platform serving millions",
    cta: "Innovate in Healthcare"
  },

  "retail": {
    category: "Retail & E-commerce",
    headline: "Retail Technology Strategy",
    subheadline: "Create seamless omnichannel experiences that drive loyalty and revenue",
    heroStats: [
      { value: "30%", label: "Revenue Lift" },
      { value: "Omnichannel", label: "Excellence" },
      { value: "NPS+40", label: "Customer Experience" }
    ],
    experience: [
      { title: "Omnichannel Retail", description: "Built unified commerce platforms for major retailers" },
      { title: "Personalization", description: "Deployed AI-powered personalization driving 30%+ revenue lift" },
      { title: "Retail Operations", description: "Optimized inventory, fulfillment, and supply chain operations" }
    ],
    approach: [
      { title: "Experience Mapping", description: "Map customer journeys across all touchpoints", icon: "map" },
      { title: "Platform Strategy", description: "Design unified commerce and data architecture", icon: "layers" },
      { title: "Personalization", description: "Build AI-driven personalization capabilities", icon: "users" },
      { title: "Operations Optimization", description: "Optimize supply chain and fulfillment operations", icon: "truck" }
    ],
    deliverables: [
      "Customer journey maps",
      "Omnichannel architecture",
      "Personalization strategy",
      "Technology roadmap",
      "Operations optimization plan",
      "Implementation timeline"
    ],
    tools: ["Shopify Plus", "Salesforce Commerce", "Adobe Commerce", "Algolia", "Segment"],
    services: ["Go-to-Market Strategy", "AI Platform Strategy"],
    caseStudy: "aml-saas",
    caseStudyTeaser: "How we drove 30% revenue lift through omnichannel personalization",
    cta: "Transform Your Retail"
  },

  "manufacturing": {
    category: "Manufacturing",
    headline: "Manufacturing Technology Strategy",
    subheadline: "Embrace Industry 4.0 to optimize operations and drive innovation",
    heroStats: [
      { value: "25%", label: "OEE Improvement" },
      { value: "50%", label: "Downtime Reduction" },
      { value: "Real-time", label: "Visibility" }
    ],
    experience: [
      { title: "Industry 4.0", description: "Led digital manufacturing transformations for global manufacturers" },
      { title: "IoT & Analytics", description: "Deployed IoT platforms with real-time analytics and AI" },
      { title: "Supply Chain", description: "Optimized supply chain visibility and planning systems" }
    ],
    approach: [
      { title: "Maturity Assessment", description: "Evaluate Industry 4.0 maturity and opportunities", icon: "clipboard" },
      { title: "Use Case Identification", description: "Identify and prioritize high-value use cases", icon: "target" },
      { title: "Platform Design", description: "Design IoT, data, and analytics architecture", icon: "layers" },
      { title: "Implementation", description: "Execute phased rollout with change management", icon: "play" }
    ],
    deliverables: [
      "Industry 4.0 assessment",
      "Use case portfolio",
      "Platform architecture",
      "Vendor evaluation",
      "Implementation roadmap",
      "ROI business case"
    ],
    tools: ["Siemens", "PTC", "Rockwell", "Azure IoT", "AWS IoT", "Snowflake"],
    services: ["AI Platform Strategy"],
    caseStudy: "arqai",
    caseStudyTeaser: "How we achieved 25% OEE improvement through smart manufacturing",
    cta: "Modernize Manufacturing"
  },

  // ============================================================================
  // INTERNATIONAL EXPANSION
  // ============================================================================
  "international": {
    category: "International",
    headline: "International Expansion Strategy",
    subheadline: "Enter new markets with confidence and local expertise",
    heroStats: [
      { value: "15+", label: "Countries" },
      { value: "3", label: "Continents" },
      { value: "$100M+", label: "Revenue Enabled" }
    ],
    experience: [
      { title: "Global Expansion", description: "Led market entry into 15+ countries across Americas, EMEA, and APAC" },
      { title: "Localization", description: "Adapted products and GTM for diverse market requirements" },
      { title: "Regulatory Navigation", description: "Navigated complex regulatory environments in multiple jurisdictions" }
    ],
    approach: [
      { title: "Market Assessment", description: "Evaluate market opportunity, competition, and entry barriers", icon: "globe" },
      { title: "Entry Strategy", description: "Define optimal entry mode and go-to-market approach", icon: "map" },
      { title: "Localization", description: "Adapt product, pricing, and messaging for local markets", icon: "users" },
      { title: "Execution Support", description: "Support launch with local partnerships and operations", icon: "flag" }
    ],
    deliverables: [
      "Market opportunity analysis",
      "Competitive landscape",
      "Entry strategy recommendation",
      "Localization requirements",
      "Partnership framework",
      "Launch playbook"
    ],
    tools: ["Market research platforms", "Localization tools", "International payment systems"],
    services: ["Market Expansion", "Go-to-Market Strategy"],
    caseStudy: "regtech",
    caseStudyTeaser: "How we expanded a RegTech product across 3 continents",
    cta: "Plan Your Expansion"
  },

  "mena": {
    category: "International",
    headline: "MENA Market Strategy",
    subheadline: "Capture growth in the Middle East and North Africa",
    heroStats: [
      { value: "GCC+", label: "Coverage" },
      { value: "Local", label: "Partnerships" },
      { value: "Regulatory", label: "Expertise" }
    ],
    experience: [
      { title: "MENA Market Entry", description: "Launched technology products across UAE, Saudi, and broader MENA" },
      { title: "Local Partnerships", description: "Built strategic partnerships with regional distributors and integrators" },
      { title: "Regulatory Navigation", description: "Navigated data localization and financial regulations in GCC" }
    ],
    approach: [
      { title: "Market Analysis", description: "Analyze MENA market dynamics and opportunity sizing", icon: "globe" },
      { title: "Regulatory Review", description: "Map regulatory requirements across target countries", icon: "file-text" },
      { title: "Partner Strategy", description: "Identify and evaluate potential local partners", icon: "users" },
      { title: "Launch Planning", description: "Design localized go-to-market and launch plan", icon: "rocket" }
    ],
    deliverables: [
      "MENA market analysis",
      "Country prioritization",
      "Regulatory compliance plan",
      "Partner evaluation framework",
      "Localization requirements",
      "Launch timeline"
    ],
    tools: ["Regional market data", "Local payment systems", "Arabic localization"],
    services: ["Market Expansion"],
    caseStudy: "regtech",
    caseStudyTeaser: "How we launched a SaaS product across GCC in 6 months",
    cta: "Enter MENA Markets"
  },

  "europe": {
    category: "International",
    headline: "European Market Strategy",
    subheadline: "Navigate European market complexity for sustainable growth",
    heroStats: [
      { value: "EU-wide", label: "Compliance" },
      { value: "Multi-Country", label: "Launches" },
      { value: "GDPR", label: "Expertise" }
    ],
    experience: [
      { title: "European Expansion", description: "Led market entry into UK, Germany, France, and Nordics" },
      { title: "GDPR Leadership", description: "Built privacy-compliant operations across European markets" },
      { title: "Multi-Country GTM", description: "Executed coordinated launches across multiple European markets" }
    ],
    approach: [
      { title: "Market Prioritization", description: "Evaluate and prioritize European markets by opportunity", icon: "bar-chart" },
      { title: "Compliance Planning", description: "Plan for GDPR and country-specific requirements", icon: "shield" },
      { title: "Localization Strategy", description: "Design localization approach for key markets", icon: "globe" },
      { title: "Launch Execution", description: "Execute phased market entry with local resources", icon: "flag" }
    ],
    deliverables: [
      "European market analysis",
      "Country prioritization matrix",
      "GDPR compliance plan",
      "Localization roadmap",
      "Sales and marketing plan",
      "Partnership strategy"
    ],
    tools: ["GDPR compliance tools", "European payment systems", "Localization platforms"],
    services: ["Market Expansion", "Go-to-Market Strategy"],
    caseStudy: "regtech",
    caseStudyTeaser: "How we built a European presence while staying GDPR-compliant",
    cta: "Expand to Europe"
  },
};

// Additional topic aliases that map to main topics
const TOPIC_ALIASES: Record<string, string> = {
  "customer data platform": "cdp",
  "segment": "cdp",
  "mparticle": "cdp",
  "data platform": "data integration",
  "etl": "data integration",
  "elt": "data integration",
  "data pipeline": "data integration",
  "bi": "analytics",
  "business intelligence": "analytics",
  "looker": "analytics",
  "tableau": "analytics",
  "power bi": "analytics",
  "snowflake": "data warehouse",
  "bigquery": "data warehouse",
  "redshift": "data warehouse",
  "databricks": "data warehouse",
  "s/4hana": "s4hana",
  "hana": "s4hana",
  "oracle": "erp",
  "netsuite": "erp",
  "dynamics": "erp",
  "workday": "erp",
  "hubspot": "crm",
  "pipedrive": "crm",
  "artificial intelligence": "ai",
  "ml": "machine learning",
  "deep learning": "machine learning",
  "neural network": "machine learning",
  "gpt": "generative ai",
  "chatgpt": "generative ai",
  "claude": "generative ai",
  "large language model": "llm",
  "rag": "llm",
  "retrieval augmented": "llm",
  "revops": "revenue operations",
  "plg": "growth",
  "product led": "growth",
  "b2b saas": "saas",
  "subscription": "saas",
  "arr": "saas",
  "mrr": "saas",
  "digital": "digital transformation",
  "modernization": "digital transformation",
  "modernize": "digital transformation",
  "legacy": "digital transformation",
  "rpa": "automation",
  "robotic process": "automation",
  "workflow automation": "automation",
  "aws": "cloud",
  "azure": "cloud",
  "gcp": "cloud",
  "google cloud": "cloud",
  "cloud migration": "cloud",
  "sox": "compliance",
  "soc2": "compliance",
  "soc 2": "compliance",
  "hipaa": "compliance",
  "pci": "compliance",
  "iso 27001": "compliance",
  "privacy": "gdpr",
  "data protection": "gdpr",
  "ccpa": "gdpr",
  "banking": "fintech",
  "financial services": "fintech",
  "payments": "fintech",
  "insurance": "fintech",
  "insurtech": "fintech",
  "healthcare": "healthtech",
  "health tech": "healthtech",
  "medical": "healthtech",
  "ecommerce": "retail",
  "e-commerce": "retail",
  "commerce": "retail",
  "industry 4.0": "manufacturing",
  "smart factory": "manufacturing",
  "iot": "manufacturing",
  "global": "international",
  "expansion": "international",
  "new markets": "international",
  "middle east": "mena",
  "uae": "mena",
  "saudi": "mena",
  "dubai": "mena",
  "gcc": "mena",
  "uk": "europe",
  "germany": "europe",
  "france": "europe",
  "eu": "europe",
  "apac": "international",
  "asia": "international",
  "marketing": "martech",
  "demand generation": "martech",
  "demand gen": "martech",
  "lead generation": "martech",
  "lead gen": "martech",
  "account based": "sales",
  "abm": "sales",
  "outbound": "sales",
  "inbound": "marketing automation",
  "email marketing": "marketing automation",
  "nurture": "marketing automation",
  "campaign": "marketing automation",
  "personalization": "cdp",
  "customer experience": "cdp",
  "cx": "cdp",
};

// Extract the main topic from a message
export function extractTopic(message: string): string | null {
  const lowerMessage = message.toLowerCase();

  // Check aliases first (more specific)
  for (const [alias, topic] of Object.entries(TOPIC_ALIASES)) {
    if (lowerMessage.includes(alias)) {
      return topic;
    }
  }

  // Check main topic mappings
  for (const topic of Object.keys(TOPIC_MAPPINGS)) {
    if (lowerMessage.includes(topic)) {
      return topic;
    }
  }

  // Check for substantial message with business intent
  if (message.length > 50 && (
    lowerMessage.includes("we") ||
    lowerMessage.includes("our") ||
    lowerMessage.includes("help") ||
    lowerMessage.includes("need") ||
    lowerMessage.includes("want") ||
    lowerMessage.includes("looking") ||
    lowerMessage.includes("challenge") ||
    lowerMessage.includes("problem") ||
    lowerMessage.includes("issue") ||
    lowerMessage.includes("struggling")
  )) {
    return "business challenge";
  }

  return null;
}

// Detect canvas mode from conversation content
export function detectCanvasMode(
  userMessage: string,
  conversationHistory: string[]
): CanvasMode {
  const lowerMessage = userMessage.toLowerCase();

  // Speaking/Events - very specific intent
  if (
    lowerMessage.includes("speaker") ||
    lowerMessage.includes("keynote") ||
    lowerMessage.includes("conference") ||
    lowerMessage.includes("speaking engagement") ||
    lowerMessage.includes("panel")
  ) {
    return "speaking";
  }

  // Scheduling - ready to book
  if (
    (lowerMessage.includes("book") && lowerMessage.includes("call")) ||
    (lowerMessage.includes("schedule") && lowerMessage.includes("meeting")) ||
    lowerMessage.includes("calendly") ||
    lowerMessage.includes("set up a call")
  ) {
    return "scheduling";
  }

  // Case study deep dive
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

  return "initial";
}

// Detect visual mood
export function detectMood(userMessage: string, agentMode: string): VisualMood {
  const lowerMessage = userMessage.toLowerCase();

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

  if (
    lowerMessage.includes("not sure") ||
    lowerMessage.includes("thinking") ||
    lowerMessage.includes("maybe") ||
    lowerMessage.includes("consider")
  ) {
    return "thoughtful";
  }

  if (
    lowerMessage.includes("tell me more") ||
    lowerMessage.includes("how does") ||
    lowerMessage.includes("explain") ||
    lowerMessage.includes("details") ||
    agentMode === "educator"
  ) {
    return "focused";
  }

  if (userMessage.length > 50 || lowerMessage.includes("we") || lowerMessage.includes("our")) {
    return "engaged";
  }

  return "neutral";
}

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

// Generate rich dynamic content
export function generateDynamicContent(
  topic: string,
  userMessage: string,
  conversationHistory: string[]
): DynamicContent {
  let mapping = TOPIC_MAPPINGS[topic];

  // Check aliases if no direct match
  if (!mapping && TOPIC_ALIASES[topic]) {
    mapping = TOPIC_MAPPINGS[TOPIC_ALIASES[topic]];
  }

  // Default for unmatched topics
  if (!mapping) {
    const formattedTopic = topic.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    mapping = {
      category: "Strategy",
      headline: `${formattedTopic} Strategy`,
      subheadline: "Tailored expertise for your specific challenge",
      heroStats: [
        { value: "20+", label: "Years Experience" },
        { value: "100+", label: "Projects Delivered" },
        { value: "Global", label: "Reach" }
      ],
      experience: [
        { title: "Enterprise Leadership", description: "20+ years leading technology and strategy initiatives" },
        { title: "Cross-Industry Expertise", description: "Experience across fintech, SaaS, retail, and manufacturing" },
        { title: "Global Delivery", description: "Delivered projects across Americas, EMEA, and APAC" }
      ],
      approach: [
        { title: "Discovery", description: "Deep dive into your specific context and challenges", icon: "search" },
        { title: "Strategy", description: "Develop tailored strategy aligned with your goals", icon: "map" },
        { title: "Execution", description: "Support implementation with hands-on expertise", icon: "play" },
        { title: "Optimization", description: "Continuously improve based on results", icon: "trending-up" }
      ],
      deliverables: [
        "Current state assessment",
        "Strategy recommendation",
        "Implementation roadmap",
        "Success metrics framework"
      ],
      services: ["AI Platform Strategy", "Go-to-Market Strategy", "Market Expansion"],
      cta: "Discuss Your Challenge"
    };
  }

  return {
    topic,
    category: mapping.category,
    headline: mapping.headline,
    subheadline: mapping.subheadline,
    heroStats: mapping.heroStats,
    relevantExperience: mapping.experience,
    approachSteps: mapping.approach,
    keyDeliverables: mapping.deliverables,
    toolsAndTech: mapping.tools,
    relatedServices: mapping.services,
    suggestedCaseStudy: mapping.caseStudy,
    caseStudyTeaser: mapping.caseStudyTeaser,
    ctaText: mapping.cta
  };
}

// Build visual state
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

  const showMetrics: string[] = [];
  const lowerMessage = userMessage.toLowerCase();

  if (lowerMessage.includes("gtm") || lowerMessage.includes("sales") || lowerMessage.includes("conversion")) {
    showMetrics.push("130% growth", "50% conversion lift");
  }
  if (lowerMessage.includes("ai") || lowerMessage.includes("governance") || lowerMessage.includes("platform")) {
    showMetrics.push("GEC Award 2025", "3 Patents");
  }

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
