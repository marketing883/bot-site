export type CanvasType =
  | "initial"
  | "ai-strategy"
  | "speaking"
  | "gtm"
  | "market-expansion"
  | "case-study"
  | "dynamic";

export type Intent =
  | "ai-strategy"
  | "speaking"
  | "gtm"
  | "market-expansion"
  | "case-study"
  | "general"
  | "unknown";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface ConversationState {
  messages: Message[];
  currentCanvas: CanvasType;
  intent: Intent;
  context: ExtractedContext;
  isLoading: boolean;
}

export interface ExtractedContext {
  industry?: string;
  challenge?: string;
  companySize?: string;
  timeline?: string;
  audienceType?: string;
  region?: string;
  caseStudyId?: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  industry: string;
  challenge: string;
  approach: string[];
  results: string[];
  tags: string[];
}

export interface SpeakingTopic {
  id: string;
  title: string;
  description: string;
  audience: string[];
  keyPoints: string[];
}

export interface ServiceArea {
  id: string;
  title: string;
  description: string;
  highlights: string[];
  icon: string;
}

export interface ApiResponse {
  message: string;
  canvas: CanvasType;
  intent: Intent;
  context: ExtractedContext;
  suggestions?: string[];
}
