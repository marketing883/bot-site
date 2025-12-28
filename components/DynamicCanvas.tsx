"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CanvasType, ExtractedContext } from "@/lib/types";
import {
  InitialCanvas,
  AIStrategyCanvas,
  SpeakingCanvas,
  GTMCanvas,
  MarketExpansionCanvas,
  CaseStudyCanvas,
} from "./canvases";

interface DynamicCanvasProps {
  canvas: CanvasType;
  context: ExtractedContext;
  onServiceClick?: (serviceId: string) => void;
  onCaseStudyClick?: (id: string) => void;
  onBookCall?: () => void;
  onBack?: () => void;
}

// Sci-fi morphing transition variants
const morphVariants = {
  initial: {
    opacity: 0,
    scale: 0.95,
    filter: "blur(20px)",
    y: 30,
  },
  animate: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
      opacity: { duration: 0.4 },
      filter: { duration: 0.5 },
      scale: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] },
    },
  },
  exit: {
    opacity: 0,
    scale: 1.02,
    filter: "blur(15px)",
    y: -20,
    transition: {
      duration: 0.4,
      ease: [0.55, 0.06, 0.68, 0.19],
    },
  },
};

// Glitch effect for dramatic transitions
const glitchVariants = {
  initial: {
    opacity: 0,
    x: -20,
    skewX: -3,
    filter: "hue-rotate(90deg) blur(10px)",
  },
  animate: {
    opacity: 1,
    x: 0,
    skewX: 0,
    filter: "hue-rotate(0deg) blur(0px)",
    transition: {
      duration: 0.5,
      ease: "easeOut",
      filter: { duration: 0.6 },
    },
  },
  exit: {
    opacity: 0,
    x: 20,
    skewX: 2,
    filter: "hue-rotate(-90deg) blur(10px)",
    transition: {
      duration: 0.3,
    },
  },
};

export function DynamicCanvas({
  canvas,
  context,
  onServiceClick,
  onCaseStudyClick,
  onBookCall,
  onBack,
}: DynamicCanvasProps) {
  const renderCanvas = () => {
    switch (canvas) {
      case "initial":
        return <InitialCanvas onServiceClick={onServiceClick} />;
      case "ai-strategy":
        return (
          <AIStrategyCanvas
            context={context}
            onCaseStudyClick={onCaseStudyClick}
            onBookCall={onBookCall}
          />
        );
      case "speaking":
        return (
          <SpeakingCanvas
            context={context}
            onCheckAvailability={onBookCall}
            onDownloadKit={() => {}}
          />
        );
      case "gtm":
        return (
          <GTMCanvas
            context={context}
            onCaseStudyClick={onCaseStudyClick}
            onBookCall={onBookCall}
          />
        );
      case "market-expansion":
        return (
          <MarketExpansionCanvas
            context={context}
            onCaseStudyClick={onCaseStudyClick}
            onBookCall={onBookCall}
          />
        );
      case "case-study":
        return (
          <CaseStudyCanvas
            caseStudyId={context.caseStudyId}
            onBack={onBack}
            onBookCall={onBookCall}
            onNextCase={onCaseStudyClick}
          />
        );
      default:
        return <InitialCanvas onServiceClick={onServiceClick} />;
    }
  };

  // Use glitch for case study transitions, morph for others
  const variants = canvas === "case-study" ? glitchVariants : morphVariants;

  return (
    <div className="relative">
      {/* Transition glow effect */}
      <AnimatePresence>
        <motion.div
          key={`glow-${canvas}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute -inset-4 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-blue-500/5 rounded-3xl blur-xl pointer-events-none"
        />
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={canvas + (context.caseStudyId || "")}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="relative w-full"
        >
          {/* Scanline overlay for sci-fi effect */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl opacity-30">
            <motion.div
              initial={{ y: "-100%" }}
              animate={{ y: "200%" }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
            />
          </div>

          {renderCanvas()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
