"use client";

import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, ArrowRight, Tag, Award } from "lucide-react";
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
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const item = {
    hidden: { opacity: 0, y: 15, filter: "blur(10px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.4 } },
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Back button */}
      {onBack && (
        <motion.button
          variants={item}
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-white/40 hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </motion.button>
      )}

      {/* Header */}
      <motion.div variants={item} className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs px-2 py-0.5 rounded-full glass-card text-white/60">
            {caseStudy.industry}
          </span>
          {caseStudy.id === "arqai" && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/20 flex items-center gap-1">
              <Award className="w-3 h-3" />
              GEC Award 2025
            </span>
          )}
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white">{caseStudy.title}</h2>
      </motion.div>

      {/* Challenge */}
      <motion.div variants={item} className="space-y-2">
        <h3 className="text-lg font-semibold text-white">The Challenge</h3>
        <p className="text-white/60">{caseStudy.challenge}</p>
      </motion.div>

      {/* Approach */}
      <motion.div variants={item} className="space-y-3">
        <h3 className="text-lg font-semibold text-white">The Approach</h3>
        <div className="space-y-2">
          {caseStudy.approach.map((step, index) => (
            <motion.div
              key={index}
              whileHover={{ x: 4 }}
              className="p-3 rounded-lg glass-card flex items-start gap-3"
            >
              <div className="flex-shrink-0 w-6 h-6 rounded-full btn-glow text-white text-xs font-medium flex items-center justify-center">
                {index + 1}
              </div>
              <p className="text-sm text-white/80">{step}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Results */}
      <motion.div variants={item} className="space-y-3">
        <h3 className="text-lg font-semibold text-white">The Results</h3>
        <div className="grid md:grid-cols-2 gap-3">
          {caseStudy.results.map((result, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              className={cn(
                "p-4 rounded-xl",
                "bg-gradient-to-br from-emerald-500/10 to-teal-500/10",
                "border border-emerald-500/20",
                "flex items-center gap-3"
              )}
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span className="text-sm font-medium text-emerald-200">{result}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Tags */}
      <motion.div variants={item} className="flex flex-wrap gap-2">
        {caseStudy.tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 rounded-full text-xs glass-card text-white/50 flex items-center gap-1"
          >
            <Tag className="w-3 h-3" />
            {tag}
          </span>
        ))}
      </motion.div>

      {/* CTAs */}
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
          onClick={() => onNextCase?.(nextCase.id)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="py-3 px-6 rounded-xl font-medium glass-card glow-border text-white/80 hover:text-cyan-400 transition-all duration-300 flex items-center justify-center gap-2"
        >
          Next: {nextCase.title.split(" - ")[0]}
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
