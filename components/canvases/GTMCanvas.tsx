"use client";

import { motion } from "framer-motion";
import { Rocket, Target, TrendingUp, Users, Megaphone, ArrowRight, CheckCircle2 } from "lucide-react";
import { caseStudies } from "@/lib/data";
import { ExtractedContext } from "@/lib/types";
import { cn } from "@/lib/utils";

interface GTMCanvasProps {
  context?: ExtractedContext;
  onCaseStudyClick?: (id: string) => void;
  onBookCall?: () => void;
}

export function GTMCanvas({ context, onCaseStudyClick, onBookCall }: GTMCanvasProps) {
  const amlCase = caseStudies.find((c) => c.id === "aml-saas")!;

  const metrics = [
    { value: "50%", label: "Conversion Lift", description: "Average improvement" },
    { value: "25%", label: "Shorter Cycles", description: "Sales acceleration" },
    { value: "130%", label: "Market Growth", description: "Year-over-year" },
    { value: "3x", label: "Pipeline", description: "Qualified opportunities" },
  ];

  const capabilities = [
    { icon: Target, title: "Positioning & Messaging", description: "Transform complex tech into clear market positioning" },
    { icon: Megaphone, title: "Demand Generation", description: "Full-funnel campaigns that create qualified pipeline" },
    { icon: Users, title: "Sales Enablement", description: "Align sales and marketing for predictable revenue" },
    { icon: TrendingUp, title: "Conversion Optimization", description: "Identify and fix leaks in your revenue funnel" },
  ];

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
      {/* Header */}
      <motion.div variants={item} className="space-y-2">
        <div className="flex items-center gap-2 text-orange-400">
          <Rocket className="w-5 h-5" />
          <span className="text-sm font-medium uppercase tracking-wide">Go-to-Market</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white">Go-to-Market Strategy</h2>
        <p className="text-white/50">
          Turn complex B2B technology into clear market positioning and revenue-generating demand
        </p>
      </motion.div>

      {/* Metrics */}
      <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {metrics.map((metric, index) => (
          <div key={index} className="glass-card p-4 rounded-xl text-center">
            <div className="text-2xl font-bold gradient-text">{metric.value}</div>
            <div className="text-sm font-medium text-white">{metric.label}</div>
            <div className="text-xs text-white/40">{metric.description}</div>
          </div>
        ))}
      </motion.div>

      {/* Capabilities */}
      <motion.div variants={item} className="space-y-3">
        <h3 className="text-lg font-semibold text-white">What I Do</h3>
        <div className="grid md:grid-cols-2 gap-3">
          {capabilities.map((cap, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              className="p-4 rounded-xl glass-card flex items-start gap-3"
            >
              <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/20">
                <cap.icon className="w-4 h-4 text-orange-400" />
              </div>
              <div>
                <h4 className="font-medium text-white text-sm">{cap.title}</h4>
                <p className="text-xs text-white/40 mt-1">{cap.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Case Study Preview */}
      <motion.div variants={item} className="space-y-3">
        <h3 className="text-lg font-semibold text-white">Recent Results</h3>
        <motion.button
          onClick={() => onCaseStudyClick?.("aml-saas")}
          whileHover={{ scale: 1.01, y: -2 }}
          whileTap={{ scale: 0.99 }}
          className="w-full p-5 rounded-xl text-left glass-card card-hover glow-border transition-all duration-300 group"
        >
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/40">{amlCase.industry}</span>
              </div>
              <h4 className="font-semibold text-white group-hover:text-orange-400 transition-colors">
                {amlCase.title}
              </h4>
              <p className="text-sm text-white/50 line-clamp-2">{amlCase.challenge}</p>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                {amlCase.results.slice(0, 2).map((result, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span className="text-white/60">{result}</span>
                  </div>
                ))}
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-white/30 group-hover:text-orange-400 group-hover:translate-x-1 transition-all" />
          </div>
        </motion.button>
      </motion.div>

      {/* CTA */}
      <motion.div variants={item} className="flex flex-col sm:flex-row gap-3">
        <motion.button
          onClick={onBookCall}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 py-3 px-6 rounded-xl font-medium bg-gradient-to-r from-orange-500 to-amber-500 text-white btn-glow"
        >
          Improve My GTM
        </motion.button>
        <motion.button
          onClick={() => onCaseStudyClick?.("aml-saas")}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="py-3 px-6 rounded-xl font-medium glass-card glow-border text-white/80 hover:text-orange-400 transition-all duration-300"
        >
          View Full Case Study
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
