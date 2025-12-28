"use client";

import { motion } from "framer-motion";
import { Mic, Users, Calendar, FileText, ArrowRight, Video, MapPin } from "lucide-react";
import { speakingTopics } from "@/lib/data";
import { ExtractedContext } from "@/lib/types";
import { cn } from "@/lib/utils";

interface SpeakingCanvasProps {
  context?: ExtractedContext;
  onTopicClick?: (id: string) => void;
  onCheckAvailability?: () => void;
  onDownloadKit?: () => void;
}

const recentAppearances = [
  { event: "GITEX Global", location: "Dubai", type: "Keynote" },
  { event: "CIO Summit", location: "Singapore", type: "Panel" },
  { event: "AI Enterprise Forum", location: "London", type: "Workshop" },
];

export function SpeakingCanvas({
  context,
  onTopicClick,
  onCheckAvailability,
  onDownloadKit,
}: SpeakingCanvasProps) {
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const item = {
    hidden: { opacity: 0, y: 15, filter: "blur(10px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.4 } },
  };

  const relevantTopics = context?.audienceType
    ? speakingTopics.filter((t) =>
        t.audience.some((a) => a.toLowerCase().includes(context.audienceType!.toLowerCase()))
      )
    : speakingTopics;

  const displayTopics = relevantTopics.length > 0 ? relevantTopics : speakingTopics;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={item} className="space-y-2">
        <div className="flex items-center gap-2 text-purple-400">
          <Mic className="w-5 h-5" />
          <span className="text-sm font-medium uppercase tracking-wide">Speaking</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white">
          Speaking & Thought Leadership
        </h2>
        <p className="text-white/50">
          Engaging keynotes and panels on enterprise AI, governance, and global go-to-market
        </p>
      </motion.div>

      {/* Recent Appearances */}
      <motion.div variants={item} className="space-y-3">
        <h3 className="text-lg font-semibold text-white">Recent Appearances</h3>
        <div className="flex flex-wrap gap-3">
          {recentAppearances.map((appearance, index) => (
            <div key={index} className="glass-card px-4 py-2 rounded-lg flex items-center gap-3">
              <Video className="w-4 h-4 text-purple-400" />
              <div>
                <span className="font-medium text-white text-sm">{appearance.event}</span>
                <div className="flex items-center gap-2 text-xs text-white/40">
                  <MapPin className="w-3 h-3" />
                  {appearance.location}
                  <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">
                    {appearance.type}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Topics */}
      <motion.div variants={item} className="space-y-3">
        <h3 className="text-lg font-semibold text-white">Speaking Topics</h3>
        <div className="grid md:grid-cols-2 gap-3">
          {displayTopics.map((topic) => (
            <motion.button
              key={topic.id}
              onClick={() => onTopicClick?.(topic.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "p-4 rounded-xl text-left glass-card card-hover glow-border",
                "transition-all duration-300 group"
              )}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h4 className="font-semibold text-white group-hover:text-purple-400 transition-colors text-sm">
                    {topic.title}
                  </h4>
                  <p className="text-xs text-white/40 line-clamp-2">{topic.description}</p>
                  <div className="flex items-center gap-1 text-xs text-white/30">
                    <Users className="w-3 h-3" />
                    {topic.audience.slice(0, 2).join(", ")}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Audience Selector */}
      <motion.div variants={item} className="space-y-3">
        <h3 className="text-sm font-medium text-white/60">Your Audience Type</h3>
        <div className="flex flex-wrap gap-2">
          {["Technical Leaders", "Business Executives", "Mixed Audience"].map((audience) => (
            <button
              key={audience}
              className={cn(
                "px-4 py-2 rounded-full text-sm glass-card",
                "text-white/60 hover:text-purple-400",
                "transition-all duration-200"
              )}
            >
              {audience}
            </button>
          ))}
        </div>
      </motion.div>

      {/* CTAs */}
      <motion.div variants={item} className="flex flex-col sm:flex-row gap-3">
        <motion.button
          onClick={onCheckAvailability}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 py-3 px-6 rounded-xl font-medium btn-glow text-white flex items-center justify-center gap-2"
        >
          <Calendar className="w-5 h-5" />
          Check Availability
        </motion.button>
        <motion.button
          onClick={onDownloadKit}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "py-3 px-6 rounded-xl font-medium glass-card glow-border",
            "text-white/80 hover:text-purple-400",
            "flex items-center justify-center gap-2 transition-all duration-300"
          )}
        >
          <FileText className="w-5 h-5" />
          Speaker Kit
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
