"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Linkedin, Mail, Calendar, Sparkles } from "lucide-react";
import { ConversationInput } from "@/components/ConversationInput";
import { MessageList } from "@/components/MessageList";
import { DynamicCanvas } from "@/components/DynamicCanvas";
import { CanvasType, ExtractedContext, Message } from "@/lib/types";
import { quickPrompts, proofPoints } from "@/lib/data";
import type { VisualState, CanvasMode } from "@/lib/visualState";
import { getMoodStyles, initialVisualState } from "@/lib/visualState";

// Generate a unique session ID
function generateSessionId(): string {
  return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Map visual canvas mode to UI canvas type
const canvasModeToType: Record<CanvasMode, CanvasType> = {
  "initial": "initial",
  "ai-strategy": "ai-strategy",
  "gtm": "gtm",
  "expansion": "market-expansion",
  "speaking": "speaking",
  "case-study": "case-study",
  "scheduling": "initial",
  "assessment": "initial",
  "estimator": "initial",
  "dynamic": "dynamic",
};

export default function Home() {
  const [currentCanvas, setCurrentCanvas] = useState<CanvasType>("initial");
  const [context, setContext] = useState<ExtractedContext>({});
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visualState, setVisualState] = useState<VisualState>(initialVisualState);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Session ID - persists across the conversation
  const [sessionId] = useState(() => {
    // Check if we have a session in localStorage
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("chat-session-id");
      if (stored) return stored;
      const newId = generateSessionId();
      localStorage.setItem("chat-session-id", newId);
      return newId;
    }
    return generateSessionId();
  });

  const hasConversation = messages.length > 0;

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleMessageSubmit = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;

      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content: content.trim(),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            messages: [...messages, userMessage].map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Error: ${response.status}`);
        }

        // Read visual state from headers and update UI
        const visualStateHeader = response.headers.get("X-Visual-State");
        if (visualStateHeader) {
          try {
            const newVisualState = JSON.parse(visualStateHeader) as VisualState;
            setVisualState(newVisualState);

            // Update canvas based on visual state
            const newCanvas = canvasModeToType[newVisualState.canvas] || "initial";
            if (newCanvas !== currentCanvas) {
              setCurrentCanvas(newCanvas);
            }

            // Update context with highlighted case study
            if (newVisualState.highlightedCaseStudy) {
              setContext(prev => ({ ...prev, caseStudyId: newVisualState.highlightedCaseStudy }));
            }
          } catch (e) {
            console.error("Failed to parse visual state:", e);
          }
        }

        // Handle streaming response
        const reader = response.body?.getReader();
        if (!reader) throw new Error("No response body");

        const decoder = new TextDecoder();
        let assistantContent = "";

        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: "",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          assistantContent += chunk;

          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMessage.id
                ? { ...m, content: assistantContent }
                : m
            )
          );
        }
      } catch (err) {
        console.error("Chat error:", err);
        setError(err instanceof Error ? err.message : "Failed to send message");
        // Remove the empty assistant message on error
        setMessages((prev) => prev.filter((m) => m.content !== ""));
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading]
  );

  const handleServiceClick = useCallback(
    (serviceId: string) => {
      const serviceToCanvas: Record<string, CanvasType> = {
        "ai-strategy": "ai-strategy",
        gtm: "gtm",
        "market-expansion": "market-expansion",
        speaking: "speaking",
      };
      setCurrentCanvas(serviceToCanvas[serviceId] || "initial");

      const serviceMessages: Record<string, string> = {
        "ai-strategy": "I need help with AI strategy",
        gtm: "I want to improve my go-to-market",
        "market-expansion": "I'm looking to expand to new markets",
        speaking: "I'm looking for a speaker on AI",
      };
      handleMessageSubmit(serviceMessages[serviceId] || "Tell me more about your services");
    },
    [handleMessageSubmit]
  );

  const handleCaseStudyClick = useCallback((id: string) => {
    setContext((prev) => ({ ...prev, caseStudyId: id }));
    setCurrentCanvas("case-study");
  }, []);

  const handleBookCall = useCallback(() => {
    window.open("https://calendly.com/habib-mehmoodi", "_blank");
  }, []);

  const handleBack = useCallback(() => {
    if (context.caseStudyId) {
      const caseStudyToCanvas: Record<string, CanvasType> = {
        arqai: "ai-strategy",
        regtech: "market-expansion",
        "aml-saas": "gtm",
      };
      setCurrentCanvas(caseStudyToCanvas[context.caseStudyId] || "initial");
      setContext((prev) => ({ ...prev, caseStudyId: undefined }));
    } else {
      setCurrentCanvas("initial");
    }
  }, [context]);

  const handleReset = useCallback(() => {
    setCurrentCanvas("initial");
    setMessages([]);
    setContext({});
    setError(null);
  }, []);

  // Get mood-based styles
  const moodStyles = getMoodStyles(visualState.mood);

  return (
    <div className="min-h-screen bg-gradient-animated grid-overlay relative overflow-hidden">
      {/* Mood-responsive ambient orbs */}
      <motion.div
        animate={{
          scale: visualState.mood === "excited" ? 1.2 : visualState.mood === "engaged" ? 1.1 : 1,
          opacity: visualState.mood === "neutral" ? 0.3 : 0.5,
        }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className={`orb-glow w-[500px] h-[500px] -top-48 -left-48 fixed ${
          visualState.mood === "excited" ? "bg-cyan-400" :
          visualState.mood === "engaged" ? "bg-teal-500" :
          visualState.mood === "focused" ? "bg-blue-500" :
          visualState.mood === "thoughtful" ? "bg-indigo-500" : "bg-cyan-500"
        }`}
      />
      <motion.div
        animate={{
          scale: visualState.mood === "excited" ? 1.3 : 1,
          opacity: visualState.mood === "neutral" ? 0.3 : 0.5,
        }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
        className={`orb-glow w-[600px] h-[600px] -bottom-64 -right-64 fixed ${
          visualState.mood === "excited" ? "bg-pink-500" :
          visualState.mood === "engaged" ? "bg-cyan-500" :
          visualState.mood === "focused" ? "bg-indigo-500" :
          visualState.mood === "thoughtful" ? "bg-purple-500" : "bg-purple-500"
        }`}
      />
      <div className="orb-glow w-[300px] h-[300px] bg-blue-500 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 fixed opacity-20" />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg btn-glow flex items-center justify-center text-white font-bold text-sm">
                H
              </div>
              <span className="font-semibold text-white/90">Habib Mehmoodi</span>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <button
                onClick={handleReset}
                className="text-sm text-white/60 hover:text-cyan-400 transition-colors text-glow-hover"
              >
                Home
              </button>
              <button
                onClick={() => handleServiceClick("ai-strategy")}
                className="text-sm text-white/60 hover:text-cyan-400 transition-colors text-glow-hover"
              >
                AI Strategy
              </button>
              <button
                onClick={() => handleServiceClick("speaking")}
                className="text-sm text-white/60 hover:text-cyan-400 transition-colors text-glow-hover"
              >
                Speaking
              </button>
              <a
                href="https://linkedin.com/in/habibmehmoodi"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-white/60 hover:text-cyan-400 transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 pt-14 min-h-screen">
        <AnimatePresence mode="wait">
          {!hasConversation ? (
            <motion.div
              key="hero"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
              transition={{ duration: 0.5 }}
              className="h-[calc(100vh-3.5rem)] flex flex-col"
            >
              <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-center max-w-4xl mx-auto mb-8"
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-card text-xs text-cyan-400 mb-6">
                    <Sparkles className="w-3 h-3" />
                    <span>AI-Powered Conversation Interface</span>
                  </div>

                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                    Turn complex AI into{" "}
                    <span className="gradient-text-glow">revenue outcomes</span>
                  </h1>

                  <p className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto">
                    Tell me your challenge, and I&apos;ll show you how I can help with AI strategy,
                    go-to-market, or global expansion.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-wrap justify-center gap-4 mb-8"
                >
                  {proofPoints.map((proof, index) => (
                    <div
                      key={index}
                      className="glass-card px-4 py-2 rounded-xl text-center card-hover"
                    >
                      <div className="text-xl font-bold gradient-text">{proof.value}</div>
                      <div className="text-xs text-white/60">{proof.label}</div>
                    </div>
                  ))}
                </motion.div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm max-w-2xl mx-auto w-full text-center"
                  >
                    {error}
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="w-full max-w-2xl mx-auto"
                >
                  <div className="glass-chat rounded-2xl p-1">
                    <ConversationInput
                      onSubmit={handleMessageSubmit}
                      isLoading={isLoading}
                      quickPrompts={quickPrompts}
                    />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="conversation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="min-h-[calc(100vh-3.5rem)] flex flex-col lg:flex-row"
            >
              <motion.div
                initial={{ opacity: 0, x: -20, filter: "blur(10px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="lg:w-3/5 p-4 sm:p-6 lg:p-8 overflow-y-auto"
              >
                <div className="max-w-3xl mx-auto">
                  <DynamicCanvas
                    canvas={currentCanvas}
                    context={context}
                    visualState={visualState}
                    onServiceClick={handleServiceClick}
                    onCaseStudyClick={handleCaseStudyClick}
                    onBookCall={handleBookCall}
                    onBack={handleBack}
                  />

                  {/* Context-aware metrics display */}
                  {visualState.showMetrics && visualState.showMetrics.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 flex flex-wrap gap-3 justify-center"
                    >
                      {visualState.showMetrics.map((metric, i) => (
                        <div
                          key={i}
                          className="glass-card px-4 py-2 rounded-lg text-sm text-cyan-400 border border-cyan-500/20"
                        >
                          {metric}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20, filter: "blur(10px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="lg:w-2/5 lg:fixed lg:right-0 lg:top-14 lg:bottom-0 lg:border-l border-white/5 flex flex-col"
              >
                <div className="flex-1 flex flex-col h-full glass-strong">
                  <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <h3 className="font-medium text-white/80 text-sm">Conversation</h3>
                    {isLoading && (
                      <span className="text-xs text-white/40 ml-2">Thinking...</span>
                    )}
                  </div>

                  {error && (
                    <div className="mx-4 mt-2 px-3 py-2 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-xs">
                      {error}
                    </div>
                  )}

                  <div className="flex-1 overflow-y-auto px-4 hide-scrollbar">
                    <MessageList messages={messages} isLoading={isLoading} />
                    <div ref={messagesEndRef} />
                  </div>

                  <div className="p-4 border-t border-white/5">
                    <ConversationInput
                      onSubmit={handleMessageSubmit}
                      isLoading={isLoading}
                      placeholder="Ask a follow-up question..."
                      compact
                    />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {!hasConversation && (
        <footer className="fixed bottom-0 left-0 right-0 z-40 glass border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-xs text-white/30">
                © {new Date().getFullYear()} Habib Mehmoodi
              </div>
              <div className="flex items-center gap-4">
                <a
                  href="https://linkedin.com/in/habibmehmoodi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-white/30 hover:text-cyan-400 transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href="mailto:hello@habibmehmoodi.com"
                  className="p-2 text-white/30 hover:text-cyan-400 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                </a>
                <button
                  onClick={handleBookCall}
                  className="btn-glow px-4 py-2 rounded-lg text-white text-xs font-medium flex items-center gap-2"
                >
                  <Calendar className="w-3 h-3" />
                  Book a Call
                </button>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
