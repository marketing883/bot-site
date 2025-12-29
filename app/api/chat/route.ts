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
import { buildVisualState, type VisualState, type DynamicContent } from "@/lib/visualState";

// ============================================================================
// CANVAS CONTEXT BUILDER
// ============================================================================

function buildConversationSummary(messages: Array<{ role: string; content: string }>): string {
  if (messages.length <= 2) return "";

  // Summarize conversation trajectory for context
  const userMessages = messages.filter(m => m.role === "user").map(m => m.content);
  if (userMessages.length === 0) return "";

  let summary = "\n## CONVERSATION SO FAR\n";

  // Detect primary topic from early messages
  const allText = userMessages.join(" ").toLowerCase();
  if (allText.includes("ai") || allText.includes("governance") || allText.includes("platform")) {
    summary += "Topic: AI/Governance focus\n";
  } else if (allText.includes("gtm") || allText.includes("sales") || allText.includes("marketing")) {
    summary += "Topic: GTM/Sales focus\n";
  } else if (allText.includes("expand") || allText.includes("market") || allText.includes("region")) {
    summary += "Topic: Market expansion focus\n";
  }

  summary += `Exchanges: ${Math.ceil(messages.length / 2)}\n`;
  summary += "Don't repeat yourself. Build on previous responses.\n";

  return summary;
}

function buildCanvasContext(visualState: VisualState): string {
  const { canvas, dynamicContent, highlightedService, highlightedCaseStudy } = visualState;

  let context = `\n## CURRENT CANVAS STATE\n`;
  context += `The user is currently viewing: `;

  if (canvas === "dynamic" && dynamicContent) {
    context += `**${dynamicContent.headline}** canvas\n`;
    context += `Topic: ${dynamicContent.topic}\n`;
    context += `They can see:\n`;
    context += `- Hero stats: ${dynamicContent.heroStats.map(s => `${s.value} ${s.label}`).join(", ")}\n`;
    context += `- Your relevant experience in this area\n`;
    context += `- Your approach steps for this type of engagement\n`;
    if (dynamicContent.suggestedCaseStudy) {
      context += `- Case study teaser: "${dynamicContent.caseStudyTeaser}"\n`;
    }
    context += `\nYour response should reference what they're seeing. Don't repeat the headline - acknowledge their interest and add insight.\n`;
  } else if (canvas === "initial") {
    context += `the welcome/initial state - they're just exploring\n`;
    context += `Be welcoming but get to business quickly. Ask about their challenge.\n`;
  } else if (canvas === "scheduling") {
    context += `the scheduling canvas with the Calendly booking option\n`;
    context += `They're ready to book. Keep it brief and confirmatory.\n`;
  } else if (canvas === "speaking") {
    context += `the speaking/events canvas\n`;
    context += `Focus on speaking topics and event experience.\n`;
  } else {
    context += `a service canvas (${canvas})\n`;
    if (highlightedService) {
      context += `Highlighted service: ${highlightedService}\n`;
    }
    if (highlightedCaseStudy) {
      context += `Highlighted case study: ${highlightedCaseStudy}\n`;
    }
  }

  return context;
}

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

    // Build visual state early so we can include canvas context
    const conversationHistory = updatedConversation.messages.map(m => m.content);
    const visualState = buildVisualState(
      latestUserMessage?.content || "",
      conversationHistory,
      updatedConversation.agentMode,
      updatedConversation.collectedInfo
    );

    // Build canvas context for the system prompt
    const canvasContext = buildCanvasContext(visualState);

    // Build conversation summary for multi-turn context
    const conversationSummary = buildConversationSummary(messages);

    const systemPrompt = `${basePrompt}
${canvasContext}${conversationSummary}
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

## RESPONSE RULES (NON-NEGOTIABLE)
1. LENGTH: 2-3 sentences + optional question. Then STOP.
2. OPENING: Never "Great question!" / "I'd be happy to..." / "That's interesting..."
3. STRUCTURE: Insight first → Evidence → Hook or question
4. FORMATTING: **Bold** for numbers only. *Italics* for asides. Line breaks between thoughts.
5. QUESTIONS: Maximum ONE per response. Specific, not generic.
6. FACTS: Use ONLY your knowledge base. Never invent numbers or companies.
7. UNCERTAINTY: Say "Good one for Habib directly" - don't guess.

${agentAdditions}`;

    // Convert messages to Anthropic format
    const anthropicMessages = messages.map((m: { role: string; content: string }) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

    // Create streaming response
    const stream = await anthropic.messages.stream({
      model: "claude-3-haiku-20240307",
      max_tokens: 250,  // Allow for markdown formatting and richer responses
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

    // Visual state was already built earlier for canvas context injection
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
