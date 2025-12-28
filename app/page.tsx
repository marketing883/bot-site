"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Linkedin, Mail, Calendar, Sparkles } from "lucide-react";
import { ConversationInput } from "@/components/ConversationInput";
import { MessageList } from "@/components/MessageList";
import { DynamicCanvas } from "@/components/DynamicCanvas";
import { Message, CanvasType, ExtractedContext, ApiResponse } from "@/lib/types";
import { quickPrompts, proofPoints } from "@/lib/data";
import { generateId, cn } from "@/lib/utils";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentCanvas, setCurrentCanvas] = useState<CanvasType>("initial");
  const [context, setContext] = useState<ExtractedContext>({});
  const [isLoading, setIsLoading] = useState(false);

  const hasConversation = messages.length > 0;

  const handleMessage = useCallback(async (message: string) => {
    setIsLoading(true);

    const userMessage: Message = {
      id: generateId(),
      role: "user",
      content: message,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data: ApiResponse = await response.json();

      const assistantMessage: Message = {
        id: generateId(),
        role: "assistant",
        content: data.message,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setCurrentCanvas(data.canvas);
      setContext(data.context);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage: Message = {
        id: generateId(),
        role: "assistant",
        content: "I apologize, but I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleServiceClick = useCallback((serviceId: string) => {
    const serviceMessages: Record<string, string> = {
      "ai-strategy": "I need help with AI strategy",
      gtm: "I want to improve my go-to-market",
      "market-expansion": "I'm looking to expand to new markets",
      speaking: "I'm looking for a speaker on AI",
    };
    handleMessage(serviceMessages[serviceId] || "Tell me more about your services");
  }, [handleMessage]);

  const handleCaseStudyClick = useCallback((id: string) => {
    setContext((prev) => ({ ...prev, caseStudyId: id }));
    setCurrentCanvas("case-study");
  }, []);

  const handleBookCall = useCallback(() => {
    window.open("https://calendly.com", "_blank");
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

  return (
    <div className="min-h-screen bg-gradient-animated grid-overlay relative overflow-hidden">
      {/* Ambient orbs */}
      <div className="orb-glow w-[500px] h-[500px] bg-cyan-500 -top-48 -left-48 fixed" />
      <div className="orb-glow w-[600px] h-[600px] bg-purple-500 -bottom-64 -right-64 fixed" />
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
                onClick={() => { setCurrentCanvas("initial"); setMessages([]); }}
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
                href="https://linkedin.com"
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
            /* Initial Hero State - Everything in first viewport */
            <motion.div
              key="hero"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
              transition={{ duration: 0.5 }}
              className="h-[calc(100vh-3.5rem)] flex flex-col"
            >
              {/* Hero Content */}
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

                {/* Proof Points */}
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

                {/* Chat Input - Prominent */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="w-full max-w-2xl mx-auto"
                >
                  <div className="glass-chat rounded-2xl p-1">
                    <ConversationInput
                      onSubmit={handleMessage}
                      isLoading={isLoading}
                      quickPrompts={quickPrompts}
                    />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            /* Conversation State - Split Layout */
            <motion.div
              key="conversation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="min-h-[calc(100vh-3.5rem)] flex flex-col lg:flex-row"
            >
              {/* Canvas Section */}
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
                    onServiceClick={handleServiceClick}
                    onCaseStudyClick={handleCaseStudyClick}
                    onBookCall={handleBookCall}
                    onBack={handleBack}
                  />
                </div>
              </motion.div>

              {/* Chat Section - Fixed on right */}
              <motion.div
                initial={{ opacity: 0, x: 20, filter: "blur(10px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="lg:w-2/5 lg:fixed lg:right-0 lg:top-14 lg:bottom-0 lg:border-l border-white/5 flex flex-col"
              >
                <div className="flex-1 flex flex-col h-full glass-strong">
                  {/* Chat Header */}
                  <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <h3 className="font-medium text-white/80 text-sm">Conversation</h3>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto px-4 hide-scrollbar">
                    <MessageList messages={messages} isLoading={isLoading} />
                  </div>

                  {/* Input */}
                  <div className="p-4 border-t border-white/5">
                    <ConversationInput
                      onSubmit={handleMessage}
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

      {/* Footer - Only on initial */}
      {!hasConversation && (
        <footer className="fixed bottom-0 left-0 right-0 z-40 glass border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-xs text-white/30">
                © {new Date().getFullYear()} Habib Mehmoodi
              </div>
              <div className="flex items-center gap-4">
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-white/30 hover:text-cyan-400 transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href="mailto:hello@habib.com"
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
