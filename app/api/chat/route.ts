import { streamText, tool } from "ai";
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
  findRelevantCaseStudy,
  getContactInfo,
} from "@/lib/knowledge";

// Create Anthropic provider
const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// ============================================================================
// TOOL DEFINITIONS (AI SDK v3 format)
// ============================================================================

const tools = {
  get_services: tool({
    description: "Get all available services Habib offers",
    parameters: z.object({
      query: z.string().optional().describe("Optional query parameter"),
    }),
    execute: async () => {
      const result = getServices();
      return result.data;
    },
  }),

  get_case_study: tool({
    description: "Get details of a specific case study by ID (arqai, regtech, or aml-saas)",
    parameters: z.object({
      id: z.string().describe("The case study ID: arqai, regtech, or aml-saas"),
    }),
    execute: async ({ id }) => {
      const result = getCaseStudy(id);
      return result.data;
    },
  }),

  get_case_studies: tool({
    description: "Get a summary of all available case studies",
    parameters: z.object({
      query: z.string().optional().describe("Optional query parameter"),
    }),
    execute: async () => {
      const result = getCaseStudies();
      return result.data;
    },
  }),

  get_speaking_topics: tool({
    description: "Get available speaking topics, optionally filtered by audience type",
    parameters: z.object({
      audience: z.string().optional().describe("Filter by audience type (e.g., 'CIOs', 'Technical', 'Business')"),
    }),
    execute: async ({ audience }) => {
      const result = getSpeakingTopics(audience);
      return result.data;
    },
  }),

  get_credentials: tool({
    description: "Get Habib's credentials and achievements",
    parameters: z.object({
      type: z.enum(["award", "patent", "achievement", "speaking", "certification"]).optional()
        .describe("Filter by credential type"),
    }),
    execute: async ({ type }) => {
      const result = getCredentials(type);
      return result.data;
    },
  }),

  get_about: tool({
    description: "Get information about Habib including bio, expertise, and background",
    parameters: z.object({
      query: z.string().optional().describe("Optional query parameter"),
    }),
    execute: async () => {
      const result = getAbout();
      return result.data;
    },
  }),

  get_metrics: tool({
    description: "Get performance metrics and results, optionally filtered by case study",
    parameters: z.object({
      caseStudyId: z.string().optional().describe("Filter metrics by case study ID"),
    }),
    execute: async ({ caseStudyId }) => {
      const result = getMetrics(caseStudyId);
      return result.data;
    },
  }),

  find_relevant_case_study: tool({
    description: "Find the most relevant case study based on visitor context",
    parameters: z.object({
      industry: z.string().optional().describe("Visitor's industry"),
      challenge: z.string().optional().describe("Visitor's challenge"),
      region: z.string().optional().describe("Target region"),
    }),
    execute: async ({ industry, challenge, region }) => {
      const result = findRelevantCaseStudy({ industry, challenge, region });
      return result.data;
    },
  }),

  get_contact_info: tool({
    description: "Get contact information and booking links",
    parameters: z.object({
      query: z.string().optional().describe("Optional query parameter"),
    }),
    execute: async () => {
      const result = getContactInfo();
      return result.data;
    },
  }),
};

// ============================================================================
// REQUEST HANDLER
// ============================================================================

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { messages, sessionContext } = body;

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Messages array is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Build system prompt with knowledge context
    const systemPrompt = buildSystemPrompt();

    // Add session context if available
    const contextAddition = sessionContext
      ? `\n\n## VISITOR CONTEXT\n${sessionContext}`
      : "";

    // Create streaming response
    const result = await streamText({
      model: anthropic("claude-sonnet-4-20250514"),
      system: systemPrompt + contextAddition + `

## IMPORTANT INSTRUCTIONS

1. Use the tools to retrieve accurate information. Never make up facts.
2. Keep responses concise and helpful.
3. Guide high-engagement visitors toward booking a call.
4. When mentioning metrics, always use the exact values from tools.`,
      messages,
      tools,
      maxToolRoundtrips: 3,
    });

    // Return streaming response
    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// ============================================================================
// SIMPLE ENDPOINT FOR NON-STREAMING REQUESTS
// ============================================================================

export async function GET() {
  return new Response(
    JSON.stringify({
      status: "ok",
      message: "Chat API is running. Use POST with messages array.",
    }),
    { headers: { "Content-Type": "application/json" } }
  );
}
