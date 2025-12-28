"use client";

import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Bot } from "lucide-react";
import { Message } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (messages.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col space-y-4 py-4">
      <AnimatePresence mode="popLayout">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10, filter: "blur(5px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, filter: "blur(5px)" }}
            transition={{ duration: 0.3 }}
            className={cn(
              "flex gap-3",
              message.role === "user" ? "flex-row-reverse" : "flex-row"
            )}
          >
            <div
              className={cn(
                "flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center",
                message.role === "user"
                  ? "bg-gradient-to-br from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/20"
                  : "bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-purple-400 border border-purple-500/20"
              )}
            >
              {message.role === "user" ? (
                <User className="w-3.5 h-3.5" />
              ) : (
                <Bot className="w-3.5 h-3.5" />
              )}
            </div>
            <div
              className={cn(
                "flex flex-col max-w-[85%]",
                message.role === "user" ? "items-end" : "items-start"
              )}
            >
              <div
                className={cn(
                  "px-4 py-2.5 rounded-2xl text-sm",
                  message.role === "user"
                    ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-white border border-cyan-500/20 rounded-br-md"
                    : "glass-card text-white/90 rounded-bl-md"
                )}
              >
                <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
              </div>
              <span className="text-[10px] text-white/30 mt-1 px-1">
                {formatDate(new Date(message.timestamp))}
              </span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-3"
        >
          <div className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-purple-400 border border-purple-500/20">
            <Bot className="w-3.5 h-3.5" />
          </div>
          <div className="px-4 py-3 rounded-2xl glass-card rounded-bl-md">
            <div className="typing-indicator flex gap-1">
              <span />
              <span />
              <span />
            </div>
          </div>
        </motion.div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
