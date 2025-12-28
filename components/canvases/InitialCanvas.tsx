"use client";

import { motion } from "framer-motion";
import { Award, TrendingUp, FileText, Zap, Brain, Rocket, Globe, Mic } from "lucide-react";
import { serviceAreas, proofPoints } from "@/lib/data";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  brain: Brain,
  rocket: Rocket,
  globe: Globe,
  mic: Mic,
};

interface InitialCanvasProps {
  onServiceClick?: (serviceId: string) => void;
}

export function InitialCanvas({ onServiceClick }: InitialCanvasProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
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
      className="space-y-8"
    >
      {/* Hero Section */}
      <motion.div variants={item} className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white leading-tight">
          Turn complex AI innovation into{" "}
          <span className="gradient-text">revenue-generating outcomes</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          Combining deep technical strategy with market development expertise to
          scale emerging technology across global markets.
        </p>
      </motion.div>

      {/* Proof Points */}
      <motion.div
        variants={item}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {proofPoints.map((proof, index) => (
          <div
            key={index}
            className={cn(
              "p-4 rounded-xl text-center",
              "bg-white dark:bg-slate-800",
              "border border-slate-200 dark:border-slate-700",
              "hover:border-primary-300 dark:hover:border-primary-600",
              "transition-all duration-200"
            )}
          >
            <div className="text-2xl md:text-3xl font-bold gradient-text">
              {proof.value}
            </div>
            <div className="text-sm font-medium text-slate-900 dark:text-white">
              {proof.label}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {proof.description}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Service Cards */}
      <motion.div variants={item} className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white text-center">
          How I Can Help
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {serviceAreas.map((service) => {
            const Icon = iconMap[service.icon] || Brain;
            return (
              <button
                key={service.id}
                onClick={() => onServiceClick?.(service.id)}
                className={cn(
                  "p-5 rounded-xl text-left",
                  "bg-white dark:bg-slate-800",
                  "border border-slate-200 dark:border-slate-700",
                  "hover:border-primary-300 dark:hover:border-primary-600",
                  "hover:shadow-lg",
                  "transition-all duration-200 group"
                )}
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/30 dark:to-accent-900/30">
                    <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {service.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {service.highlights.slice(0, 2).map((highlight, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 text-xs rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* CTA hint */}
      <motion.div variants={item} className="text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Click a service card or describe your challenge below to get started
        </p>
      </motion.div>
    </motion.div>
  );
}
