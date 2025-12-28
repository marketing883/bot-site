"use client";

import { motion } from "framer-motion";
import {
  Rocket,
  Target,
  TrendingUp,
  Users,
  Megaphone,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { caseStudies } from "@/lib/data";
import { ExtractedContext } from "@/lib/types";
import { cn } from "@/lib/utils";

interface GTMCanvasProps {
  context?: ExtractedContext;
  onCaseStudyClick?: (id: string) => void;
  onBookCall?: () => void;
}

export function GTMCanvas({
  context,
  onCaseStudyClick,
  onBookCall,
}: GTMCanvasProps) {
  const amlCase = caseStudies.find((c) => c.id === "aml-saas")!;

  const metrics = [
    { value: "50%", label: "Conversion Lift", description: "Average improvement" },
    { value: "25%", label: "Shorter Cycles", description: "Sales acceleration" },
    { value: "130%", label: "Market Growth", description: "Year-over-year" },
    { value: "3x", label: "Pipeline", description: "Qualified opportunities" },
  ];

  const capabilities = [
    {
      icon: Target,
      title: "Positioning & Messaging",
      description: "Transform complex tech into clear market positioning",
    },
    {
      icon: Megaphone,
      title: "Demand Generation",
      description: "Full-funnel campaigns that create qualified pipeline",
    },
    {
      icon: Users,
      title: "Sales Enablement",
      description: "Align sales and marketing for predictable revenue",
    },
    {
      icon: TrendingUp,
      title: "Conversion Optimization",
      description: "Identify and fix leaks in your revenue funnel",
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
        <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
          <Rocket className="w-5 h-5" />
          <span className="text-sm font-medium uppercase tracking-wide">
            Go-to-Market
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
          Go-to-Market Strategy
        </h2>
        <p className="text-slate-600 dark:text-slate-300">
          Turn complex B2B technology into clear market positioning and
          revenue-generating demand
        </p>
      </motion.div>

      {/* Metrics */}
      <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className={cn(
              "p-4 rounded-xl text-center",
              "bg-white dark:bg-slate-800",
              "border border-slate-200 dark:border-slate-700"
            )}
          >
            <div className="text-2xl font-bold gradient-text">{metric.value}</div>
            <div className="text-sm font-medium text-slate-900 dark:text-white">
              {metric.label}
            </div>
            <div className="text-xs text-slate-500">{metric.description}</div>
          </div>
        ))}
      </motion.div>

      {/* Capabilities */}
      <motion.div variants={item} className="space-y-3">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          What I Do
        </h3>
        <div className="grid md:grid-cols-2 gap-3">
          {capabilities.map((cap, index) => (
            <div
              key={index}
              className={cn(
                "p-4 rounded-xl",
                "bg-white dark:bg-slate-800",
                "border border-slate-200 dark:border-slate-700",
                "flex items-start gap-3"
              )}
            >
              <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                <cap.icon className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h4 className="font-medium text-slate-900 dark:text-white text-sm">
                  {cap.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {cap.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Case Study Preview */}
      <motion.div variants={item} className="space-y-3">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Recent Results
        </h3>
        <button
          onClick={() => onCaseStudyClick?.("aml-saas")}
          className={cn(
            "w-full p-5 rounded-xl text-left",
            "bg-white dark:bg-slate-800",
            "border border-slate-200 dark:border-slate-700",
            "hover:border-orange-300 dark:hover:border-orange-600",
            "hover:shadow-lg",
            "transition-all duration-200 group"
          )}
        >
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">{amlCase.industry}</span>
              </div>
              <h4 className="font-semibold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                {amlCase.title}
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
                {amlCase.challenge}
              </p>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                {amlCase.results.slice(0, 2).map((result, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-green-500" />
                    <span className="text-slate-600 dark:text-slate-300">
                      {result}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
          </div>
        </button>
      </motion.div>

      {/* CTA */}
      <motion.div variants={item} className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onBookCall}
          className={cn(
            "flex-1 py-3 px-6 rounded-xl font-medium",
            "bg-gradient-to-r from-orange-500 to-amber-500",
            "text-white shadow-lg",
            "hover:shadow-xl hover:scale-[1.02]",
            "transition-all duration-200"
          )}
        >
          Improve My GTM
        </button>
        <button
          onClick={() => onCaseStudyClick?.("aml-saas")}
          className={cn(
            "py-3 px-6 rounded-xl font-medium",
            "bg-white dark:bg-slate-800",
            "border border-slate-200 dark:border-slate-700",
            "text-slate-700 dark:text-slate-200",
            "hover:border-orange-300 dark:hover:border-orange-600",
            "transition-all duration-200"
          )}
        >
          View Full Case Study
        </button>
      </motion.div>
    </motion.div>
  );
}
