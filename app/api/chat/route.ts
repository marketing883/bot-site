import { streamText } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { z } from "zod";
import {
  buildSystemPrompt,
  getServices,
  getCaseStudy,
  getCaseStudies,
  getSpeakingTopics,
  getCredentials,
  getAbout,
  getMetrics,
  getContactInfo,
} from "@/lib/knowledge";

// ============================================================================
// TOOL DEFINITIONS (AI SDK v6 - uses inputSchema)
// ============================================================================

const tools = {
  get_services: {
    description: "Get all available services Habib offers",
    inputSchema: z.object({
      query: z.string().optional().describe("Optional query"),
    }),
    execute: async () => {
      return getServices().data;
    },
  },

  get_case_study: {
    description: "Get details of a specific case study by ID",
    inputSchema: z.object({
      id: z.string().describe("Case study ID: arqai, regtech, or aml-saas"),
    }),
    execute: async ({ id }: { id: string }) => {
      return getCaseStudy(id).data;
    },
  },

  get_case_studies: {
    description: "Get all available case studies",
    inputSchema: z.object({
      query: z.string().optional(),
    }),
    execute: async () => {
      return getCaseStudies().data;
    },
  },

  get_speaking_topics: {
    description: "Get available speaking topics",
    inputSchema: z.object({
      audience: z.string().optional().describe("Filter by audience type"),
    }),
    execute: async ({ audience }: { audience?: string }) => {
      return getSpeakingTopics(audience).data;
    },
  },

  get_credentials: {
    description: "Get Habib's credentials and achievements",
    inputSchema: z.object({
      type: z.enum(["award", "patent", "achievement", "speaking", "certification"]).optional(),
    }),
    execute: async ({ type }: { type?: "award" | "patent" | "achievement" | "speaking" | "certification" }) => {
      return getCredentials(type).data;
    },
  },

  get_about: {
    description: "Get information about Habib",
    inputSchema: z.object({
      query: z.string().optional(),
    }),
    execute: async () => {
      return getAbout().data;
    },
  },

  get_metrics: {
    description: "Get performance metrics",
    inputSchema: z.object({
      caseStudyId: z.string().optional(),
    }),
    execute: async ({ caseStudyId }: { caseStudyId?: string }) => {
      return getMetrics(caseStudyId).data;
    },
  },

  get_contact_info: {
    description: "Get contact information",
    inputSchema: z.object({
      query: z.string().optional(),
    }),
    execute: async () => {
      return getContactInfo().data;
    },
  },
};

// ============================================================================
// REQUEST HANDLER
// ============================================================================

export async function POST(request: Request) {
  try {
    // Check for API key
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "API key not configured. Please add ANTHROPIC_API_KEY to .env.local" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Create Anthropic provider
    const anthropic = createAnthropic({ apiKey });

    const body = await request.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Messages array is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Build system prompt
    const systemPrompt = buildSystemPrompt();

    // Create streaming response
    const result = streamText({
      model: anthropic("claude-3-sonnet-20240229"),
      system: systemPrompt + `

## INSTRUCTIONS
1. Use tools to retrieve accurate information. Never make up facts.
2. Keep responses concise and helpful.
3. Guide visitors toward booking a call when appropriate.`,
      messages,
      tools,
    });

    // Return streaming response
    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function GET() {
  const hasApiKey = !!process.env.ANTHROPIC_API_KEY;
  return new Response(
    JSON.stringify({
      status: hasApiKey ? "ok" : "missing_api_key",
      message: hasApiKey ? "Chat API ready" : "Add ANTHROPIC_API_KEY to .env.local",
    }),
    { headers: { "Content-Type": "application/json" } }
  );
}
