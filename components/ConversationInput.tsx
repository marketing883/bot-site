"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConversationInputProps {
  onSubmit: (message: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  quickPrompts?: string[];
  compact?: boolean;
}

export function ConversationInput({
  onSubmit,
  isLoading = false,
  placeholder = "Tell me what challenge you're facing, and I'll show you if I can help.",
  quickPrompts = [],
  compact = false,
}: ConversationInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        150
      )}px`;
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSubmit(input.trim());
      setInput("");
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    if (!isLoading) {
      onSubmit(prompt);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className={cn("w-full", compact ? "space-y-2" : "space-y-4")}>
      <form onSubmit={handleSubmit} className="relative">
        <div
          className={cn(
            "relative flex items-end rounded-2xl border border-slate-200 dark:border-slate-700",
            "bg-white dark:bg-slate-800 shadow-lg",
            "focus-within:ring-2 focus-within:ring-primary-500/50 focus-within:border-primary-500",
            "transition-all duration-200"
          )}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={isLoading}
            rows={1}
            className={cn(
              "flex-1 resize-none bg-transparent",
              compact ? "px-4 py-3 text-sm" : "px-5 py-4 text-base",
              "placeholder:text-slate-400 dark:placeholder:text-slate-500",
              "focus:outline-none",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={cn(
              compact ? "m-2 p-2" : "m-3 p-3",
              "rounded-xl bg-gradient-to-r from-primary-500 to-accent-500",
              "text-white shadow-md",
              "hover:shadow-lg hover:scale-105",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
              "transition-all duration-200"
            )}
          >
            {isLoading ? (
              <Loader2
                className={cn("animate-spin", compact ? "w-4 h-4" : "w-5 h-5")}
              />
            ) : (
              <Send className={cn(compact ? "w-4 h-4" : "w-5 h-5")} />
            )}
          </button>
        </div>
      </form>

      {quickPrompts.length > 0 && !compact && (
        <div className="flex flex-wrap gap-2 justify-center">
          {quickPrompts.map((prompt, index) => (
            <button
              key={index}
              onClick={() => handleQuickPrompt(prompt)}
              disabled={isLoading}
              className={cn(
                "px-4 py-2 rounded-full text-sm",
                "bg-white dark:bg-slate-800",
                "border border-slate-200 dark:border-slate-700",
                "text-slate-600 dark:text-slate-300",
                "hover:border-primary-300 hover:text-primary-600",
                "dark:hover:border-primary-600 dark:hover:text-primary-400",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "transition-all duration-200"
              )}
            >
              {prompt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
