"use client";

import { motion } from "framer-motion";
import {
  Shield,
  Layers,
  Award,
  FileCheck,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { caseStudies } from "@/lib/data";
import { ExtractedContext } from "@/lib/types";
import { cn } from "@/lib/utils";

interface AIStrategyCanvasProps {
  context?: ExtractedContext;
  onCaseStudyClick?: (id: string) => void;
  onBookCall?: () => void;
}

export function AIStrategyCanvas({
  context,
  onCaseStudyClick,
  onBookCall,
}: AIStrategyCanvasProps) {
  const arqaiCase = caseStudies.find((c) => c.id === "arqai")!;

  const approachSteps = [
    {
      icon: Shield,
      title: "Governance-First Assessment",
      description: "Evaluate current AI capabilities against enterprise governance requirements",
    },
    {
      icon: Layers,
      title: "Architecture Design",
      description: "Design semantic orchestration layer for enterprise integration",
    },
    {
      icon: FileCheck,
      title: "Use Case Prioritization",
      description: "Identify and prioritize AI use cases by business impact and feasibility",
    },
    {
      icon: Award,
      title: "Implementation Roadmap",
      description: "Create phased plan with quick wins and long-term value",
    },
  ];

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
      transition: { duration: 0.4 }
    },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={item} className="space-y-2">
        <div className="flex items-center gap-2 text-cyan-400">
          <Shield className="w-5 h-5" />
          <span className="text-sm font-medium uppercase tracking-wide">
            AI Strategy
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white">
          AI Strategy{context?.industry ? ` for ${context.industry}` : ""}
        </h2>
        <p className="text-white/50">
          Enterprise AI that delivers value without compromising on governance
        </p>
      </motion.div>

      {/* Dynamic insight if we have context */}
      {context?.challenge && (
        <motion.div
          variants={item}
          className={cn(
            "p-4 rounded-xl",
            "bg-gradient-to-r from-cyan-500/10 to-purple-500/10",
            "border border-cyan-500/20"
          )}
        >
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-white/80">
                <span className="font-semibold text-cyan-400">Your challenge:</span>{" "}
                {context.challenge}
              </p>
              <p className="text-sm text-white/50 mt-2">
                This is a common pattern I see in enterprises. The governance-first
                approach addresses exactly this by building compliance into the
                architecture from day one.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Approach */}
      <motion.div variants={item} className="space-y-4">
        <h3 className="text-lg font-semibold text-white">My Approach</h3>
        <div className="grid md:grid-cols-2 gap-3">
          {approachSteps.map((step, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              className={cn(
                "p-4 rounded-xl glass-card",
                "flex items-start gap-3"
              )}
            >
              <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                <step.icon className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <h4 className="font-medium text-white text-sm">{step.title}</h4>
                <p className="text-xs text-white/40 mt-1">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Case Study Preview */}
      <motion.div variants={item} className="space-y-3">
        <h3 className="text-lg font-semibold text-white">Relevant Case Study</h3>
        <motion.button
          onClick={() => onCaseStudyClick?.("arqai")}
          whileHover={{ scale: 1.01, y: -2 }}
          whileTap={{ scale: 0.99 }}
          className={cn(
            "w-full p-5 rounded-xl text-left",
            "glass-card card-hover glow-border",
            "transition-all duration-300 group"
          )}
        >
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/20">
                  Award Winner
                </span>
                <span className="text-xs text-white/40">{arqaiCase.industry}</span>
              </div>
              <h4 className="font-semibold text-white group-hover:text-cyan-400 transition-colors">
                {arqaiCase.title}
              </h4>
              <p className="text-sm text-white/50 line-clamp-2">{arqaiCase.challenge}</p>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                {arqaiCase.results.slice(0, 2).map((result, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span className="text-white/60">{result}</span>
                  </div>
                ))}
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-white/30 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
          </div>
        </motion.button>
      </motion.div>

      {/* CTA */}
      <motion.div variants={item} className="flex flex-col sm:flex-row gap-3">
        <motion.button
          onClick={onBookCall}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 py-3 px-6 rounded-xl font-medium btn-glow text-white"
        >
          Discuss a Similar Challenge
        </motion.button>
        <motion.button
          onClick={() => onCaseStudyClick?.("arqai")}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "py-3 px-6 rounded-xl font-medium",
            "glass-card glow-border",
            "text-white/80 hover:text-cyan-400",
            "transition-all duration-300"
          )}
        >
          View Full Case Study
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
