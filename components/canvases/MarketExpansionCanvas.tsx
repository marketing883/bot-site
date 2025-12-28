"use client";

import { motion } from "framer-motion";
import {
  Globe,
  Map,
  Users,
  Shield,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { caseStudies } from "@/lib/data";
import { ExtractedContext } from "@/lib/types";
import { cn } from "@/lib/utils";

interface MarketExpansionCanvasProps {
  context?: ExtractedContext;
  onCaseStudyClick?: (id: string) => void;
  onBookCall?: () => void;
}

const regions = [
  {
    id: "eu",
    name: "European Union",
    highlights: ["GDPR expertise", "Partner networks", "Localization"],
  },
  {
    id: "mena",
    name: "Middle East & North Africa",
    highlights: ["Dubai hub", "Government relations", "Arabic markets"],
  },
  {
    id: "apac",
    name: "Asia Pacific",
    highlights: ["Singapore base", "Channel strategy", "Market entry"],
  },
  {
    id: "africa",
    name: "Africa",
    highlights: ["South Africa success", "Fintech focus", "Partnership model"],
  },
];

export function MarketExpansionCanvas({
  context,
  onCaseStudyClick,
  onBookCall,
}: MarketExpansionCanvasProps) {
  const regtechCase = caseStudies.find((c) => c.id === "regtech")!;

  const approachSteps = [
    {
      icon: Map,
      title: "Market Assessment",
      description: "Evaluate market potential, competitive landscape, and entry barriers",
    },
    {
      icon: Shield,
      title: "Regulatory Navigation",
      description: "Build compliance frameworks for target markets (GDPR, local regulations)",
    },
    {
      icon: Users,
      title: "Channel Strategy",
      description: "Identify and develop local partners and distribution channels",
    },
    {
      icon: Globe,
      title: "Go-to-Market Execution",
      description: "Localized positioning, marketing, and sales enablement",
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
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
          <Globe className="w-5 h-5" />
          <span className="text-sm font-medium uppercase tracking-wide">
            Market Expansion
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
          Global Market Expansion
        </h2>
        <p className="text-slate-600 dark:text-slate-300">
          Scale across regions with localized strategies that navigate regulatory
          complexity
        </p>
      </motion.div>

      {/* Region Cards */}
      <motion.div variants={item} className="space-y-3">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Regional Expertise
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {regions.map((region) => (
            <div
              key={region.id}
              className={cn(
                "p-4 rounded-xl",
                "bg-white dark:bg-slate-800",
                "border border-slate-200 dark:border-slate-700",
                "hover:border-emerald-300 dark:hover:border-emerald-600",
                "transition-all duration-200"
              )}
            >
              <h4 className="font-medium text-slate-900 dark:text-white text-sm mb-2">
                {region.name}
              </h4>
              <div className="space-y-1">
                {region.highlights.map((highlight, i) => (
                  <div
                    key={i}
                    className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    {highlight}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Approach */}
      <motion.div variants={item} className="space-y-3">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Expansion Approach
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
              <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                <step.icon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
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
          Expansion Success Story
        </h3>
        <button
          onClick={() => onCaseStudyClick?.("regtech")}
          className={cn(
            "w-full p-5 rounded-xl text-left",
            "bg-white dark:bg-slate-800",
            "border border-slate-200 dark:border-slate-700",
            "hover:border-emerald-300 dark:hover:border-emerald-600",
            "hover:shadow-lg",
            "transition-all duration-200 group"
          )}
        >
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                  130% Growth
                </span>
                <span className="text-xs text-slate-500">
                  {regtechCase.industry}
                </span>
              </div>
              <h4 className="font-semibold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {regtechCase.title}
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
                {regtechCase.challenge}
              </p>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                {regtechCase.results.slice(0, 2).map((result, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-green-500" />
                    <span className="text-slate-600 dark:text-slate-300">
                      {result}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
          </div>
        </button>
      </motion.div>

      {/* CTA */}
      <motion.div variants={item} className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onBookCall}
          className={cn(
            "flex-1 py-3 px-6 rounded-xl font-medium",
            "bg-gradient-to-r from-emerald-500 to-teal-500",
            "text-white shadow-lg",
            "hover:shadow-xl hover:scale-[1.02]",
            "transition-all duration-200"
          )}
        >
          Plan My Expansion
        </button>
        <button
          onClick={() => onCaseStudyClick?.("regtech")}
          className={cn(
            "py-3 px-6 rounded-xl font-medium",
            "bg-white dark:bg-slate-800",
            "border border-slate-200 dark:border-slate-700",
            "text-slate-700 dark:text-slate-200",
            "hover:border-emerald-300 dark:hover:border-emerald-600",
            "transition-all duration-200"
          )}
        >
          View Full Case Study
        </button>
      </motion.div>
    </motion.div>
  );
}
