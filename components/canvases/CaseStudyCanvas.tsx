"use client";

import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, ArrowRight, Tag } from "lucide-react";
import { caseStudies } from "@/lib/data";
import { cn } from "@/lib/utils";

interface CaseStudyCanvasProps {
  caseStudyId?: string;
  onBack?: () => void;
  onBookCall?: () => void;
  onNextCase?: (id: string) => void;
}

export function CaseStudyCanvas({
  caseStudyId = "arqai",
  onBack,
  onBookCall,
  onNextCase,
}: CaseStudyCanvasProps) {
  const caseStudy = caseStudies.find((c) => c.id === caseStudyId) || caseStudies[0];
  const currentIndex = caseStudies.findIndex((c) => c.id === caseStudyId);
  const nextCase = caseStudies[(currentIndex + 1) % caseStudies.length];

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
      {/* Back button */}
      {onBack && (
        <motion.button
          variants={item}
          onClick={onBack}
          className={cn(
            "flex items-center gap-2 text-sm",
            "text-slate-600 dark:text-slate-400",
            "hover:text-primary-600 dark:hover:text-primary-400",
            "transition-colors"
          )}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </motion.button>
      )}

      {/* Header */}
      <motion.div variants={item} className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {caseStudy.industry}
          </span>
          {caseStudy.id === "arqai" && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
              GEC Award 2025
            </span>
          )}
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
          {caseStudy.title}
        </h2>
      </motion.div>

      {/* Challenge */}
      <motion.div variants={item} className="space-y-2">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          The Challenge
        </h3>
        <p className="text-slate-600 dark:text-slate-300">{caseStudy.challenge}</p>
      </motion.div>

      {/* Approach */}
      <motion.div variants={item} className="space-y-3">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          The Approach
        </h3>
        <div className="space-y-2">
          {caseStudy.approach.map((step, index) => (
            <div
              key={index}
              className={cn(
                "p-3 rounded-lg",
                "bg-white dark:bg-slate-800",
                "border border-slate-200 dark:border-slate-700",
                "flex items-start gap-3"
              )}
            >
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 text-white text-xs font-medium flex items-center justify-center">
                {index + 1}
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-200">{step}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Results */}
      <motion.div variants={item} className="space-y-3">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          The Results
        </h3>
        <div className="grid md:grid-cols-2 gap-3">
          {caseStudy.results.map((result, index) => (
            <div
              key={index}
              className={cn(
                "p-4 rounded-xl",
                "bg-gradient-to-br from-green-50 to-emerald-50",
                "dark:from-green-900/20 dark:to-emerald-900/20",
                "border border-green-200 dark:border-green-800",
                "flex items-center gap-3"
              )}
            >
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
              <span className="text-sm font-medium text-green-800 dark:text-green-200">
                {result}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Tags */}
      <motion.div variants={item} className="flex flex-wrap gap-2">
        {caseStudy.tags.map((tag) => (
          <span
            key={tag}
            className={cn(
              "px-3 py-1 rounded-full text-xs",
              "bg-slate-100 dark:bg-slate-800",
              "text-slate-600 dark:text-slate-300",
              "flex items-center gap-1"
            )}
          >
            <Tag className="w-3 h-3" />
            {tag}
          </span>
        ))}
      </motion.div>

      {/* CTAs */}
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
          onClick={() => onNextCase?.(nextCase.id)}
          className={cn(
            "py-3 px-6 rounded-xl font-medium",
            "bg-white dark:bg-slate-800",
            "border border-slate-200 dark:border-slate-700",
            "text-slate-700 dark:text-slate-200",
            "hover:border-primary-300 dark:hover:border-primary-600",
            "transition-all duration-200",
            "flex items-center justify-center gap-2"
          )}
        >
          Next: {nextCase.title.split(" - ")[0]}
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
    </motion.div>
  );
}
