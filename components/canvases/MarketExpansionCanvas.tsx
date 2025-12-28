"use client";

import { motion } from "framer-motion";
import { Globe, Map, Users, Shield, ArrowRight, CheckCircle2 } from "lucide-react";
import { caseStudies } from "@/lib/data";
import { ExtractedContext } from "@/lib/types";
import { cn } from "@/lib/utils";

interface MarketExpansionCanvasProps {
  context?: ExtractedContext;
  onCaseStudyClick?: (id: string) => void;
  onBookCall?: () => void;
}

const regions = [
  { id: "eu", name: "European Union", highlights: ["GDPR expertise", "Partner networks", "Localization"] },
  { id: "mena", name: "Middle East & Africa", highlights: ["Dubai hub", "Government relations", "Arabic markets"] },
  { id: "apac", name: "Asia Pacific", highlights: ["Singapore base", "Channel strategy", "Market entry"] },
  { id: "africa", name: "Africa", highlights: ["South Africa success", "Fintech focus", "Partnership model"] },
];

export function MarketExpansionCanvas({ context, onCaseStudyClick, onBookCall }: MarketExpansionCanvasProps) {
  const regtechCase = caseStudies.find((c) => c.id === "regtech")!;

  const approachSteps = [
    { icon: Map, title: "Market Assessment", description: "Evaluate market potential, competitive landscape, and entry barriers" },
    { icon: Shield, title: "Regulatory Navigation", description: "Build compliance frameworks for target markets (GDPR, local regulations)" },
    { icon: Users, title: "Channel Strategy", description: "Identify and develop local partners and distribution channels" },
    { icon: Globe, title: "Go-to-Market Execution", description: "Localized positioning, marketing, and sales enablement" },
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
        <div className="flex items-center gap-2 text-emerald-400">
          <Globe className="w-5 h-5" />
          <span className="text-sm font-medium uppercase tracking-wide">Market Expansion</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white">Global Market Expansion</h2>
        <p className="text-white/50">Scale across regions with localized strategies that navigate regulatory complexity</p>
      </motion.div>

      {/* Region Cards */}
      <motion.div variants={item} className="space-y-3">
        <h3 className="text-lg font-semibold text-white">Regional Expertise</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {regions.map((region) => (
            <motion.div
              key={region.id}
              whileHover={{ scale: 1.03 }}
              className="p-4 rounded-xl glass-card card-hover"
            >
              <h4 className="font-medium text-white text-sm mb-2">{region.name}</h4>
              <div className="space-y-1">
                {region.highlights.map((highlight, i) => (
                  <div key={i} className="text-xs text-white/40 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    {highlight}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Approach */}
      <motion.div variants={item} className="space-y-3">
        <h3 className="text-lg font-semibold text-white">Expansion Approach</h3>
        <div className="grid md:grid-cols-2 gap-3">
          {approachSteps.map((step, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              className="p-4 rounded-xl glass-card flex items-start gap-3"
            >
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <step.icon className="w-4 h-4 text-emerald-400" />
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
        <h3 className="text-lg font-semibold text-white">Expansion Success Story</h3>
        <motion.button
          onClick={() => onCaseStudyClick?.("regtech")}
          whileHover={{ scale: 1.01, y: -2 }}
          whileTap={{ scale: 0.99 }}
          className="w-full p-5 rounded-xl text-left glass-card card-hover glow-border transition-all duration-300 group"
        >
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/20">
                  130% Growth
                </span>
                <span className="text-xs text-white/40">{regtechCase.industry}</span>
              </div>
              <h4 className="font-semibold text-white group-hover:text-emerald-400 transition-colors">
                {regtechCase.title}
              </h4>
              <p className="text-sm text-white/50 line-clamp-2">{regtechCase.challenge}</p>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                {regtechCase.results.slice(0, 2).map((result, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span className="text-white/60">{result}</span>
                  </div>
                ))}
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-white/30 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
          </div>
        </motion.button>
      </motion.div>

      {/* CTA */}
      <motion.div variants={item} className="flex flex-col sm:flex-row gap-3">
        <motion.button
          onClick={onBookCall}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 py-3 px-6 rounded-xl font-medium bg-gradient-to-r from-emerald-500 to-teal-500 text-white btn-glow"
        >
          Plan My Expansion
        </motion.button>
        <motion.button
          onClick={() => onCaseStudyClick?.("regtech")}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="py-3 px-6 rounded-xl font-medium glass-card glow-border text-white/80 hover:text-emerald-400 transition-all duration-300"
        >
          View Full Case Study
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
