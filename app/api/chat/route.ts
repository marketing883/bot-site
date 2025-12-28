import { streamText } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import {
  buildSystemPrompt,
  getServices,
  getCaseStudies,
  getSpeakingTopics,
  getCredentials,
  getAbout,
  getContactInfo,
} from "@/lib/knowledge";

// ============================================================================
// REQUEST HANDLER
// ============================================================================

export async function POST(request: Request) {
  // Check for API key first
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "API key not configured. Please add ANTHROPIC_API_KEY to .env.local" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const body = await request.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Messages array is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Create Anthropic provider
    const anthropic = createAnthropic({ apiKey });

    // Build system prompt with all knowledge embedded
    const basePrompt = buildSystemPrompt();

    // Embed key knowledge directly in the system prompt for now
    const services = getServices().data;
    const caseStudies = getCaseStudies().data;
    const speakingTopics = getSpeakingTopics().data;
    const credentials = getCredentials().data;
    const about = getAbout().data;
    const contact = getContactInfo().data;

    const enhancedPrompt = `${basePrompt}

## AVAILABLE KNOWLEDGE

### Services Offered
${JSON.stringify(services, null, 2)}

### Case Studies
${JSON.stringify(caseStudies, null, 2)}

### Speaking Topics
${JSON.stringify(speakingTopics, null, 2)}

### Credentials & Achievements
${JSON.stringify(credentials, null, 2)}

### About Habib
${JSON.stringify(about, null, 2)}

### Contact Information
${JSON.stringify(contact, null, 2)}

## INSTRUCTIONS
1. Use the knowledge above to answer questions accurately.
2. Keep responses concise and helpful.
3. Guide visitors toward booking a call when appropriate.
4. Be conversational but professional.`;

    // Create streaming response
    const result = await streamText({
      model: anthropic("claude-3-sonnet-20240229"),
      system: enhancedPrompt,
      messages,
    });

    // Create a plain text stream with error handling
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of result.textStream) {
            controller.enqueue(encoder.encode(chunk));
          }
          controller.close();
        } catch (err) {
          console.error("Stream error:", err);
          const errorMsg = err instanceof Error ? err.message : "Stream error";
          controller.enqueue(encoder.encode(`\n\n[Error: ${errorMsg}]`));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
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
