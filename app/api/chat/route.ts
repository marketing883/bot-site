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
import {
  getOrCreateConversation,
  updateConversation,
  addMessage,
  saveLeadFromConversation,
  type Conversation,
  type Lead,
} from "@/lib/db";
import {
  determineAgentMode,
  getNextFieldToCollect,
  isLeadComplete,
  extractInfoFromMessage,
  getAgentPromptAdditions,
} from "@/lib/agents";
import { buildVisualState, type VisualState } from "@/lib/visualState";

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
    const { messages, sessionId = `session-${Date.now()}` } = body;

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Messages array is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get or create conversation
    const conversation = getOrCreateConversation(sessionId);

    // Get the latest user message
    const latestUserMessage = messages[messages.length - 1];
    if (latestUserMessage?.role === "user") {
      // Extract any info from user message
      const nextField = getNextFieldToCollect(conversation.collectedInfo);
      const extractedInfo = extractInfoFromMessage(latestUserMessage.content, nextField || undefined);

      // Update collected info
      const updatedCollectedInfo: Partial<Lead> = {
        ...conversation.collectedInfo,
        ...extractedInfo,
      };

      // Determine agent mode
      const agentMode = determineAgentMode(
        { ...conversation, collectedInfo: updatedCollectedInfo },
        latestUserMessage.content
      );

      // Update conversation
      updateConversation(sessionId, {
        agentMode,
        collectedInfo: updatedCollectedInfo,
      });

      // Save message
      addMessage(sessionId, {
        role: "user",
        content: latestUserMessage.content,
        agentMode,
      });

      // Check if we should save the lead
      if (isLeadComplete(updatedCollectedInfo) && !conversation.leadCaptured) {
        saveLeadFromConversation(sessionId);
      }
    }

    // Create Anthropic client
    const anthropic = new Anthropic({ apiKey });

    // Build system prompt with all knowledge embedded
    const basePrompt = buildSystemPrompt();
    const services = getServices().data;
    const caseStudies = getCaseStudies().data;
    const speakingTopics = getSpeakingTopics().data;
    const credentials = getCredentials().data;
    const about = getAbout().data;
    const contact = getContactInfo().data;

    // Get updated conversation state
    const updatedConversation = getOrCreateConversation(sessionId);
    const nextField = getNextFieldToCollect(updatedConversation.collectedInfo);
    const agentAdditions = getAgentPromptAdditions(
      updatedConversation.agentMode,
      updatedConversation,
      nextField
    );

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

## RESPONSE RULES (CRITICAL)
1. MAX 2-3 SENTENCES. Period. Stop writing.
2. Sound like a sharp advisor texting - not a brochure
3. ONE question max per response. Make it count.
4. No "Great question!" or "I'd be happy to..." - just answer
5. Lead with insight/pattern, not explanation
6. Drop numbers when relevant (130% growth, 3 patents, etc.)
7. End with intrigue or a question that keeps them engaged

## FORMATTING
- Use **bold** for key metrics: "**130% growth**"
- Use *italics* for wisdom/asides: *"Timing is everything"*
- Add line breaks between thoughts for readability
- Numbered lists only for 3+ structured points

${agentAdditions}`;

    // Convert messages to Anthropic format
    const anthropicMessages = messages.map((m: { role: string; content: string }) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

    // Create streaming response - keep max_tokens moderate for formatted responses
    const stream = await anthropic.messages.stream({
      model: "claude-3-haiku-20240307",
      max_tokens: 200,  // Slightly higher for markdown formatting
      system: systemPrompt,
      messages: anthropicMessages,
    });

    // Track the response for saving
    let fullResponse = "";

    // Create a ReadableStream from the Anthropic stream
    const readableStream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const event of stream) {
            if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
              fullResponse += event.delta.text;
              controller.enqueue(encoder.encode(event.delta.text));
            }
          }

          // Save assistant message after streaming completes
          addMessage(sessionId, {
            role: "assistant",
            content: fullResponse,
            agentMode: updatedConversation.agentMode,
          });

          controller.close();
        } catch (err) {
          console.error("Stream error:", err);
          const errorMsg = err instanceof Error ? err.message : "Stream error";
          controller.enqueue(encoder.encode(`\n\n[Error: ${errorMsg}]`));
          controller.close();
        }
      },
    });

    // Build visual state for UI morphing
    const conversationHistory = updatedConversation.messages.map(m => m.content);
    const visualState = buildVisualState(
      latestUserMessage?.content || "",
      conversationHistory,
      updatedConversation.agentMode,
      updatedConversation.collectedInfo
    );

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Session-Id": sessionId,
        "X-Visual-State": JSON.stringify(visualState),
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
