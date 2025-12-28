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

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={canvas + (context.caseStudyId || "")}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        {renderCanvas()}
      </motion.div>
    </AnimatePresence>
  );
}
