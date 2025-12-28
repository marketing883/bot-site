"use client";

import { motion } from "framer-motion";
import {
  Shield,
  Layers,
  Award,
  FileCheck,
  ArrowRight,
  CheckCircle2,
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
      description:
        "Evaluate current AI capabilities against enterprise governance requirements",
    },
    {
      icon: Layers,
      title: "Architecture Design",
      description:
        "Design semantic orchestration layer for enterprise integration",
    },
    {
      icon: FileCheck,
      title: "Use Case Prioritization",
      description:
        "Identify and prioritize AI use cases by business impact and feasibility",
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
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
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
        <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400">
          <Shield className="w-5 h-5" />
          <span className="text-sm font-medium uppercase tracking-wide">
            AI Strategy
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
          AI Strategy{context?.industry ? ` for ${context.industry}` : ""}
        </h2>
        <p className="text-slate-600 dark:text-slate-300">
          Enterprise AI that delivers value without compromising on governance
        </p>
      </motion.div>

      {/* Dynamic insight if we have context */}
      {context?.challenge && (
        <motion.div
          variants={item}
          className={cn(
            "p-4 rounded-xl",
            "bg-gradient-to-r from-primary-50 to-accent-50",
            "dark:from-primary-900/20 dark:to-accent-900/20",
            "border border-primary-200 dark:border-primary-800"
          )}
        >
          <p className="text-sm text-slate-700 dark:text-slate-200">
            <span className="font-semibold">Your challenge:</span>{" "}
            {context.challenge}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
            This is a common pattern I see in enterprises. The governance-first
            approach addresses exactly this by building compliance into the
            architecture from day one.
          </p>
        </motion.div>
      )}

      {/* Approach */}
      <motion.div variants={item} className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          My Approach
        </h3>
        <div className="grid md:grid-cols-2 gap-3">
          {approachSteps.map((step, index) => (
            <div
              key={index}
              className={cn(
                "p-4 rounded-xl",
                "bg-white dark:bg-slate-800",
                "border border-slate-200 dark:border-slate-700",
                "flex items-start gap-3"
              )}
            >
              <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30">
                <step.icon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h4 className="font-medium text-slate-900 dark:text-white text-sm">
                  {step.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Case Study Preview */}
      <motion.div variants={item} className="space-y-3">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Relevant Case Study
        </h3>
        <button
          onClick={() => onCaseStudyClick?.("arqai")}
          className={cn(
            "w-full p-5 rounded-xl text-left",
            "bg-white dark:bg-slate-800",
            "border border-slate-200 dark:border-slate-700",
            "hover:border-primary-300 dark:hover:border-primary-600",
            "hover:shadow-lg",
            "transition-all duration-200 group"
          )}
        >
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                  Award Winner
                </span>
                <span className="text-xs text-slate-500">
                  {arqaiCase.industry}
                </span>
              </div>
              <h4 className="font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {arqaiCase.title}
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
                {arqaiCase.challenge}
              </p>
              <div className="flex items-center gap-4 text-sm">
                {arqaiCase.results.slice(0, 2).map((result, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-green-500" />
                    <span className="text-slate-600 dark:text-slate-300">
                      {result}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
          </div>
        </button>
      </motion.div>

      {/* CTA */}
      <motion.div variants={item} className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onBookCall}
          className={cn(
            "flex-1 py-3 px-6 rounded-xl font-medium",
            "bg-gradient-to-r from-primary-500 to-accent-500",
            "text-white shadow-lg",
            "hover:shadow-xl hover:scale-[1.02]",
            "transition-all duration-200"
          )}
        >
          Discuss a Similar Challenge
        </button>
        <button
          onClick={() => onCaseStudyClick?.("arqai")}
          className={cn(
            "py-3 px-6 rounded-xl font-medium",
            "bg-white dark:bg-slate-800",
            "border border-slate-200 dark:border-slate-700",
            "text-slate-700 dark:text-slate-200",
            "hover:border-primary-300 dark:hover:border-primary-600",
            "transition-all duration-200"
          )}
        >
          View Full Case Study
        </button>
      </motion.div>
    </motion.div>
  );
}
