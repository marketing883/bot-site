"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X, Linkedin, Mail, Calendar } from "lucide-react";
import { ConversationInput } from "@/components/ConversationInput";
import { MessageList } from "@/components/MessageList";
import { DynamicCanvas } from "@/components/DynamicCanvas";
import { Message, CanvasType, ExtractedContext, ApiResponse } from "@/lib/types";
import { quickPrompts } from "@/lib/data";
import { generateId, cn } from "@/lib/utils";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentCanvas, setCurrentCanvas] = useState<CanvasType>("initial");
  const [context, setContext] = useState<ExtractedContext>({});
  const [isLoading, setIsLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showConversation, setShowConversation] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Scroll to canvas when it changes
  useEffect(() => {
    if (currentCanvas !== "initial" && canvasRef.current) {
      canvasRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [currentCanvas]);

  const handleMessage = useCallback(async (message: string) => {
    setShowConversation(true);
    setIsLoading(true);

    // Add user message
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

      // Add assistant message
      const assistantMessage: Message = {
        id: generateId(),
        role: "assistant",
        content: data.message,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);

      // Update canvas and context
      setCurrentCanvas(data.canvas);
      setContext(data.context);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage: Message = {
        id: generateId(),
        role: "assistant",
        content:
          "I apologize, but I encountered an error. Please try again or reach out directly via LinkedIn or email.",
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
    const message = serviceMessages[serviceId] || "Tell me more about your services";
    handleMessage(message);
  }, [handleMessage]);

  const handleCaseStudyClick = useCallback((id: string) => {
    setContext((prev) => ({ ...prev, caseStudyId: id }));
    setCurrentCanvas("case-study");
  }, []);

  const handleBookCall = useCallback(() => {
    // In production, this would open a calendar booking widget
    window.open("https://calendly.com", "_blank");
  }, []);

  const handleBack = useCallback(() => {
    // Go back to the previous relevant canvas based on context
    if (context.caseStudyId) {
      // Determine which canvas to return to based on the case study
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

  const hasConversation = messages.length > 0 || showConversation;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-sm">
                H
              </div>
              <span className="font-semibold text-slate-900 dark:text-white">
                Habib Mehmoodi
              </span>
            </div>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-6">
              <button
                onClick={() => setCurrentCanvas("initial")}
                className="text-sm text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => handleServiceClick("ai-strategy")}
                className="text-sm text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                AI Strategy
              </button>
              <button
                onClick={() => handleServiceClick("speaking")}
                className="text-sm text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                Speaking
              </button>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 dark:text-slate-300"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
          >
            <nav className="px-4 py-4 space-y-2">
              <button
                onClick={() => {
                  setCurrentCanvas("initial");
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              >
                Home
              </button>
              <button
                onClick={() => {
                  handleServiceClick("ai-strategy");
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              >
                AI Strategy
              </button>
              <button
                onClick={() => {
                  handleServiceClick("speaking");
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              >
                Speaking
              </button>
            </nav>
          </motion.div>
        )}
      </header>

      {/* Main content - Split layout */}
      <main className="flex-1">
        <div
          className={cn(
            "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8",
            hasConversation ? "lg:grid lg:grid-cols-5 lg:gap-8" : ""
          )}
        >
          {/* Canvas Section - Takes more space */}
          <div
            ref={canvasRef}
            className={cn(
              "transition-all duration-500",
              hasConversation ? "lg:col-span-3" : "max-w-4xl mx-auto"
            )}
          >
            <DynamicCanvas
              canvas={currentCanvas}
              context={context}
              onServiceClick={handleServiceClick}
              onCaseStudyClick={handleCaseStudyClick}
              onBookCall={handleBookCall}
              onBack={handleBack}
            />
          </div>

          {/* Conversation Section - Appears when user engages */}
          {hasConversation && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="lg:col-span-2 mt-8 lg:mt-0"
            >
              <div className="sticky top-24">
                <div
                  className={cn(
                    "rounded-2xl",
                    "bg-slate-50 dark:bg-slate-800/50",
                    "border border-slate-200 dark:border-slate-700",
                    "overflow-hidden"
                  )}
                >
                  {/* Conversation header */}
                  <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                    <h3 className="font-medium text-slate-900 dark:text-white text-sm">
                      Conversation
                    </h3>
                  </div>

                  {/* Messages */}
                  <div className="h-[300px] lg:h-[400px] overflow-y-auto px-4">
                    <MessageList messages={messages} isLoading={isLoading} />
                  </div>

                  {/* Input */}
                  <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                    <ConversationInput
                      onSubmit={handleMessage}
                      isLoading={isLoading}
                      placeholder="Ask a follow-up question..."
                      compact
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Initial Input Section - Only shows on initial canvas */}
        {!hasConversation && (
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            <ConversationInput
              onSubmit={handleMessage}
              isLoading={isLoading}
              quickPrompts={quickPrompts}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-slate-500 dark:text-slate-400">
              © {new Date().getFullYear()} Habib Mehmoodi. All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="mailto:hello@habib.com"
                className="p-2 text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
              <button
                onClick={handleBookCall}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-primary-500 to-accent-500 text-white text-sm font-medium hover:shadow-lg transition-all"
              >
                <Calendar className="w-4 h-4" />
                Book a Call
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
