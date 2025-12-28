"use client";

import { motion } from "framer-motion";
import {
  Lightbulb,
  Target,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Briefcase,
  TrendingUp,
} from "lucide-react";
import type { DynamicContent } from "@/lib/visualState";

interface DynamicInsightCanvasProps {
  content: DynamicContent;
  onServiceClick?: (serviceId: string) => void;
  onCaseStudyClick?: (id: string) => void;
  onBookCall?: () => void;
}

export function DynamicInsightCanvas({
  content,
  onServiceClick,
  onCaseStudyClick,
  onBookCall,
}: DynamicInsightCanvasProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 15, filter: "blur(10px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.4 },
    },
  };

  // Map service names to IDs
  const serviceNameToId: Record<string, string> = {
    "AI Platform Strategy": "ai-strategy",
    "Go-to-Market Strategy": "gtm",
    "Market Expansion": "market-expansion",
    "Speaking & Thought Leadership": "speaking",
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Dynamic Header */}
      <motion.div variants={item} className="space-y-2">
        <div className="flex items-center gap-2 text-purple-400">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium uppercase tracking-wider">
            Tailored for Your Challenge
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white">
          {content.headline}
        </h2>
        <p className="text-white/60">
          Based on our conversation, here&apos;s how I can help with{" "}
          <span className="text-purple-400">{content.topic}</span>
        </p>
      </motion.div>

      {/* Relevant Experience */}
      <motion.div variants={item} className="glass-card rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Briefcase className="w-5 h-5 text-cyan-400" />
          <h3 className="font-semibold text-white">Relevant Experience</h3>
        </div>
        <div className="space-y-3">
          {content.relevantExperience.map((exp, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="flex items-start gap-3"
            >
              <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
              <span className="text-white/80 text-sm">{exp}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Approach */}
      <motion.div variants={item} className="glass-card rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-purple-400" />
          <h3 className="font-semibold text-white">My Approach</h3>
        </div>
        <div className="grid gap-3">
          {content.approachPoints.map((point, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="flex items-center gap-3 bg-white/5 rounded-lg p-3"
            >
              <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-xs font-bold">
                {i + 1}
              </div>
              <span className="text-white/80 text-sm">{point}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Related Services */}
      <motion.div variants={item}>
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="w-4 h-4 text-white/60" />
          <span className="text-sm text-white/60">Related Services</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {content.relatedServices.map((service) => {
            const serviceId = serviceNameToId[service];
            return (
              <button
                key={service}
                onClick={() => serviceId && onServiceClick?.(serviceId)}
                className="px-3 py-1.5 rounded-full glass text-sm text-white/70 hover:text-cyan-400 hover:border-cyan-400/30 transition-all border border-white/10"
              >
                {service}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Suggested Case Study */}
      {content.suggestedCaseStudy && (
        <motion.div variants={item}>
          <button
            onClick={() => onCaseStudyClick?.(content.suggestedCaseStudy!)}
            className="w-full glass-card rounded-xl p-4 text-left hover:border-cyan-500/30 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-white/50 uppercase tracking-wider">
                  Relevant Case Study
                </span>
                <div className="text-white font-medium group-hover:text-cyan-400 transition-colors">
                  See how I&apos;ve solved similar challenges →
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-white/30 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
            </div>
          </button>
        </motion.div>
      )}

      {/* CTA */}
      <motion.div variants={item} className="flex gap-3">
        <button
          onClick={onBookCall}
          className="flex-1 btn-glow py-3 px-4 rounded-xl font-medium text-white flex items-center justify-center gap-2 group"
        >
          <TrendingUp className="w-4 h-4" />
          Discuss Your Challenge
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>
    </motion.div>
  );
}
