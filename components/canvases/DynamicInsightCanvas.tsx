"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Award,
  Briefcase,
  Target,
  Package,
  Wrench,
  TrendingUp,
  FileText,
  Zap,
  Shield,
  Users,
  Layers,
  Database,
  Code,
  Map,
  Search,
  BarChart,
  Calendar,
  Settings,
  Cloud,
  Cpu,
  Globe,
  Play,
  Eye,
  RefreshCw,
  GitBranch,
  Box,
  Repeat,
  Filter,
  Book,
  DollarSign,
  Heart,
  Truck,
  Flag,
  Rocket,
  Lock,
  MessageCircle,
  Layout,
  UploadCloud,
  Sliders,
  Clipboard,
  Link,
  GitMerge,
  Activity,
  CheckSquare,
} from "lucide-react";
import type { DynamicContent } from "@/lib/visualState";
import { caseStudies } from "@/lib/data";
import { cn } from "@/lib/utils";

interface DynamicInsightCanvasProps {
  content: DynamicContent;
  onServiceClick?: (serviceId: string) => void;
  onCaseStudyClick?: (id: string) => void;
  onBookCall?: () => void;
}

// Icon mapping for approach steps
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  database: Database,
  users: Users,
  layers: Layers,
  zap: Zap,
  search: Search,
  map: Map,
  code: Code,
  target: Target,
  "bar-chart": BarChart,
  "git-branch": GitBranch,
  box: Box,
  repeat: Repeat,
  calendar: Calendar,
  settings: Settings,
  clipboard: Clipboard,
  "file-text": FileText,
  "check-square": CheckSquare,
  cloud: Cloud,
  "upload-cloud": UploadCloud,
  sliders: Sliders,
  cpu: Cpu,
  play: Play,
  eye: Eye,
  "refresh-cw": RefreshCw,
  shield: Shield,
  lock: Lock,
  globe: Globe,
  flag: Flag,
  rocket: Rocket,
  heart: Heart,
  truck: Truck,
  "dollar-sign": DollarSign,
  book: Book,
  filter: Filter,
  "trending-up": TrendingUp,
  "message-circle": MessageCircle,
  layout: Layout,
  activity: Activity,
  link: Link,
  "git-merge": GitMerge,
  package: Package,
  flask: Briefcase, // No flask in lucide, use briefcase
};

// Map service names to IDs
const serviceNameToId: Record<string, string> = {
  "AI Platform Strategy": "ai-strategy",
  "Go-to-Market Strategy": "gtm",
  "Market Expansion": "market-expansion",
  "Speaking & Thought Leadership": "speaking",
};

export function DynamicInsightCanvas({
  content,
  onServiceClick,
  onCaseStudyClick,
  onBookCall,
}: DynamicInsightCanvasProps) {
  const caseStudy = content.suggestedCaseStudy
    ? caseStudies.find((c) => c.id === content.suggestedCaseStudy)
    : null;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.06 },
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

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Header with Category Badge */}
      <motion.div variants={item} className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30">
            <Sparkles className="w-3 h-3 text-purple-400" />
            <span className="text-xs font-medium text-purple-300 uppercase tracking-wider">
              {content.category}
            </span>
          </div>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
          {content.headline}
        </h2>
        <p className="text-white/60 text-lg">
          {content.subheadline}
        </p>
      </motion.div>

      {/* Hero Stats */}
      <motion.div variants={item} className="grid grid-cols-3 gap-3">
        {content.heroStats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className={cn(
              "relative p-4 rounded-xl text-center overflow-hidden",
              "bg-gradient-to-br from-white/5 to-white/[0.02]",
              "border border-white/10 hover:border-cyan-500/30",
              "transition-all duration-300 group"
            )}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="text-2xl md:text-3xl font-bold gradient-text">
                {stat.value}
              </div>
              <div className="text-xs text-white/50 mt-1 uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Relevant Experience */}
      <motion.div variants={item} className="space-y-4">
        <div className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-semibold text-white">Relevant Experience</h3>
        </div>
        <div className="space-y-3">
          {content.relevantExperience.map((exp, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.08 }}
              className={cn(
                "p-4 rounded-xl",
                "bg-gradient-to-r from-white/[0.03] to-transparent",
                "border-l-2 border-cyan-500/50",
                "hover:border-cyan-400 hover:bg-white/[0.05]",
                "transition-all duration-300"
              )}
            >
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-medium text-white">{exp.title}</h4>
                  <p className="text-sm text-white/50 mt-1">{exp.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Approach Steps - Grid Layout */}
      <motion.div variants={item} className="space-y-4">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">My Approach</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {content.approachSteps.map((step, i) => {
            const IconComponent = iconMap[step.icon] || Target;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.08 }}
                whileHover={{ scale: 1.02 }}
                className={cn(
                  "p-4 rounded-xl glass-card",
                  "flex items-start gap-3",
                  "hover:border-purple-500/30",
                  "transition-all duration-300"
                )}
              >
                <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 shrink-0">
                  <IconComponent className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <h4 className="font-medium text-white text-sm">{step.title}</h4>
                  <p className="text-xs text-white/40 mt-1">{step.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Key Deliverables */}
      <motion.div variants={item} className="space-y-3">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-emerald-400" />
          <h3 className="text-lg font-semibold text-white">Key Deliverables</h3>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {content.keyDeliverables.map((deliverable, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.05 }}
              className="flex items-center gap-2 p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/10"
            >
              <FileText className="w-3 h-3 text-emerald-400 shrink-0" />
              <span className="text-xs text-white/70">{deliverable}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Tools & Technologies */}
      {content.toolsAndTech && content.toolsAndTech.length > 0 && (
        <motion.div variants={item} className="space-y-3">
          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-white/50" />
            <span className="text-sm text-white/50">Tools & Technologies</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {content.toolsAndTech.map((tool, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + i * 0.03 }}
                className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-white/60"
              >
                {tool}
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Case Study Preview */}
      {caseStudy && (
        <motion.div variants={item} className="space-y-3">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-semibold text-white">Relevant Case Study</h3>
          </div>
          <motion.button
            onClick={() => onCaseStudyClick?.(content.suggestedCaseStudy!)}
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
                  {caseStudy.id === "arqai" && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/20">
                      Award Winner
                    </span>
                  )}
                  <span className="text-xs text-white/40">{caseStudy.industry}</span>
                </div>
                <h4 className="font-semibold text-white group-hover:text-cyan-400 transition-colors">
                  {caseStudy.title}
                </h4>
                <p className="text-sm text-white/50 line-clamp-2">
                  {content.caseStudyTeaser || caseStudy.challenge}
                </p>
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  {caseStudy.results.slice(0, 2).map((result, i) => (
                    <div key={i} className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span className="text-white/60">{result}</span>
                    </div>
                  ))}
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-white/30 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all shrink-0 ml-4" />
            </div>
          </motion.button>
        </motion.div>
      )}

      {/* Related Services */}
      <motion.div variants={item} className="space-y-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-white/50" />
          <span className="text-sm text-white/50">Related Services</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {content.relatedServices.map((service, i) => {
            const serviceId = serviceNameToId[service];
            return (
              <motion.button
                key={i}
                onClick={() => serviceId && onServiceClick?.(serviceId)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.05 }}
                whileHover={{ scale: 1.05 }}
                className={cn(
                  "px-4 py-2 rounded-lg",
                  "bg-gradient-to-r from-white/5 to-white/[0.02]",
                  "border border-white/10 hover:border-cyan-500/30",
                  "text-sm text-white/70 hover:text-cyan-400",
                  "transition-all duration-300"
                )}
              >
                {service}
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* CTA Buttons */}
      <motion.div variants={item} className="flex flex-col sm:flex-row gap-3 pt-2">
        <motion.button
          onClick={onBookCall}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 py-3.5 px-6 rounded-xl font-medium btn-glow text-white flex items-center justify-center gap-2 group"
        >
          <TrendingUp className="w-4 h-4" />
          {content.ctaText}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </motion.button>
        {caseStudy && (
          <motion.button
            onClick={() => onCaseStudyClick?.(content.suggestedCaseStudy!)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "py-3.5 px-6 rounded-xl font-medium",
              "glass-card glow-border",
              "text-white/80 hover:text-cyan-400",
              "transition-all duration-300"
            )}
          >
            View Case Study
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  );
}
