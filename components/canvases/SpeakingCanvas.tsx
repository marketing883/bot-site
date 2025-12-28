"use client";

import { motion } from "framer-motion";
import {
  Mic,
  Users,
  Calendar,
  FileText,
  ArrowRight,
  Video,
  MapPin,
} from "lucide-react";
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
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  // Filter topics based on audience type if provided
  const relevantTopics = context?.audienceType
    ? speakingTopics.filter((t) =>
        t.audience.some((a) =>
          a.toLowerCase().includes(context.audienceType!.toLowerCase())
        )
      )
    : speakingTopics;

  const displayTopics =
    relevantTopics.length > 0 ? relevantTopics : speakingTopics;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={item} className="space-y-2">
        <div className="flex items-center gap-2 text-accent-600 dark:text-accent-400">
          <Mic className="w-5 h-5" />
          <span className="text-sm font-medium uppercase tracking-wide">
            Speaking
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
          Speaking & Thought Leadership
        </h2>
        <p className="text-slate-600 dark:text-slate-300">
          Engaging keynotes and panels on enterprise AI, governance, and global
          go-to-market
        </p>
      </motion.div>

      {/* Recent Appearances */}
      <motion.div variants={item} className="space-y-3">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Recent Appearances
        </h3>
        <div className="flex flex-wrap gap-3">
          {recentAppearances.map((appearance, index) => (
            <div
              key={index}
              className={cn(
                "px-4 py-2 rounded-lg",
                "bg-white dark:bg-slate-800",
                "border border-slate-200 dark:border-slate-700",
                "flex items-center gap-3"
              )}
            >
              <Video className="w-4 h-4 text-accent-500" />
              <div>
                <span className="font-medium text-slate-900 dark:text-white text-sm">
                  {appearance.event}
                </span>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <MapPin className="w-3 h-3" />
                  {appearance.location}
                  <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700">
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
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Speaking Topics
        </h3>
        <div className="grid md:grid-cols-2 gap-3">
          {displayTopics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => onTopicClick?.(topic.id)}
              className={cn(
                "p-4 rounded-xl text-left",
                "bg-white dark:bg-slate-800",
                "border border-slate-200 dark:border-slate-700",
                "hover:border-accent-300 dark:hover:border-accent-600",
                "hover:shadow-md",
                "transition-all duration-200 group"
              )}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h4 className="font-semibold text-slate-900 dark:text-white group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors text-sm">
                    {topic.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                    {topic.description}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Users className="w-3 h-3" />
                    {topic.audience.slice(0, 2).join(", ")}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-accent-500 group-hover:translate-x-1 transition-all" />
              </div>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Audience Selector */}
      <motion.div variants={item} className="space-y-3">
        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Your Audience Type
        </h3>
        <div className="flex flex-wrap gap-2">
          {["Technical Leaders", "Business Executives", "Mixed Audience"].map(
            (audience) => (
              <button
                key={audience}
                className={cn(
                  "px-4 py-2 rounded-full text-sm",
                  "bg-white dark:bg-slate-800",
                  "border border-slate-200 dark:border-slate-700",
                  "hover:border-accent-300 dark:hover:border-accent-600",
                  "transition-all duration-200"
                )}
              >
                {audience}
              </button>
            )
          )}
        </div>
      </motion.div>

      {/* CTAs */}
      <motion.div variants={item} className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onCheckAvailability}
          className={cn(
            "flex-1 py-3 px-6 rounded-xl font-medium",
            "bg-gradient-to-r from-accent-500 to-primary-500",
            "text-white shadow-lg",
            "hover:shadow-xl hover:scale-[1.02]",
            "transition-all duration-200",
            "flex items-center justify-center gap-2"
          )}
        >
          <Calendar className="w-5 h-5" />
          Check Availability
        </button>
        <button
          onClick={onDownloadKit}
          className={cn(
            "py-3 px-6 rounded-xl font-medium",
            "bg-white dark:bg-slate-800",
            "border border-slate-200 dark:border-slate-700",
            "text-slate-700 dark:text-slate-200",
            "hover:border-accent-300 dark:hover:border-accent-600",
            "transition-all duration-200",
            "flex items-center justify-center gap-2"
          )}
        >
          <FileText className="w-5 h-5" />
          Speaker Kit
        </button>
      </motion.div>
    </motion.div>
  );
}
