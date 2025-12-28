import Anthropic from "@anthropic-ai/sdk";
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

    // Create Anthropic client
    const anthropic = new Anthropic({
      apiKey,
    });

    // Build system prompt with all knowledge embedded
    const basePrompt = buildSystemPrompt();

    // Embed key knowledge directly in the system prompt
    const services = getServices().data;
    const caseStudies = getCaseStudies().data;
    const speakingTopics = getSpeakingTopics().data;
    const credentials = getCredentials().data;
    const about = getAbout().data;
    const contact = getContactInfo().data;

    const systemPrompt = `${basePrompt}

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
1. Keep responses SHORT - 2-3 sentences max unless asked for details.
2. Be conversational and warm, like texting a helpful friend.
3. Ask ONE follow-up question to understand their specific need.
4. Don't list services or bullet points unless specifically asked.
5. Don't explain your approach or methodology unprompted.
6. Only mention booking a call after understanding their challenge.
7. Never start with "It's great that..." or similar filler phrases.

EXAMPLE GOOD RESPONSE:
User: "Help us improve our GTM"
Assistant: "Happy to help! What's the biggest GTM challenge you're facing right now - is it positioning, lead gen, or something else?"

EXAMPLE BAD RESPONSE (too long):
User: "Help us improve our GTM"
Assistant: "It's great that you're looking to optimize... [long explanation of services and methodology]"`;

    // Convert messages to Anthropic format
    const anthropicMessages = messages.map((m: { role: string; content: string }) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

    // Create streaming response using official SDK
    // Using claude-3-haiku for faster responses and wider availability
    const stream = await anthropic.messages.stream({
      model: "claude-3-haiku-20240307",
      max_tokens: 256, // Keep responses short
      system: systemPrompt,
      messages: anthropicMessages,
    });

    // Create a ReadableStream from the Anthropic stream
    const readableStream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const event of stream) {
            if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
              controller.enqueue(encoder.encode(event.delta.text));
            }
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

    return new Response(readableStream, {
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
