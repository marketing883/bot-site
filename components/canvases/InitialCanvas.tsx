"use client";

import { motion } from "framer-motion";
import { Brain, Rocket, Globe, Mic } from "lucide-react";
import { serviceAreas } from "@/lib/data";
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
    hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.5 }
    },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Service Cards */}
      <motion.div variants={item} className="space-y-4">
        <h2 className="text-lg font-semibold text-white/80 text-center">
          How I Can Help
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {serviceAreas.map((service) => {
            const Icon = iconMap[service.icon] || Brain;
            return (
              <motion.button
                key={service.id}
                onClick={() => onServiceClick?.(service.id)}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "p-5 rounded-xl text-left",
                  "glass-card card-hover glow-border",
                  "transition-all duration-300 group"
                )}
              >
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-white/10">
                    <Icon className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="font-semibold text-white group-hover:text-cyan-400 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-sm text-white/50">
                      {service.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {service.highlights.slice(0, 2).map((highlight, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 text-xs rounded-full bg-white/5 border border-white/10 text-white/60"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* CTA hint */}
      <motion.div variants={item} className="text-center">
        <p className="text-xs text-white/30">
          Click a service card or describe your challenge to get started
        </p>
      </motion.div>
    </motion.div>
  );
}
