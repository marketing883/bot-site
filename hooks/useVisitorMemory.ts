"use client";

import { useState, useEffect, useCallback } from "react";
import { ExtractedContext, Message, CanvasType, Intent } from "@/lib/types";

// ============================================================================
// TYPES
// ============================================================================

export interface VisitorSession {
  id: string;
  startedAt: Date;
  lastActiveAt: Date;
  messages: Message[];
  context: ExtractedContext;
  currentCanvas: CanvasType;
  intent: Intent;
  engagementScore: number;
  viewedCaseStudies: string[];
  viewedServices: string[];
}

interface StoredSession {
  id: string;
  startedAt: string;
  lastActiveAt: string;
  messages: Array<{
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: string;
  }>;
  context: ExtractedContext;
  currentCanvas: CanvasType;
  intent: Intent;
  engagementScore: number;
  viewedCaseStudies: string[];
  viewedServices: string[];
}

const STORAGE_KEY = "habib-cdi-session";
const SESSION_EXPIRY_HOURS = 24;

// ============================================================================
// HELPERS
// ============================================================================

function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

function isSessionExpired(session: StoredSession): boolean {
  const lastActive = new Date(session.lastActiveAt);
  const hoursSinceActive = (Date.now() - lastActive.getTime()) / (1000 * 60 * 60);
  return hoursSinceActive > SESSION_EXPIRY_HOURS;
}

function parseStoredSession(stored: StoredSession): VisitorSession {
  return {
    ...stored,
    startedAt: new Date(stored.startedAt),
    lastActiveAt: new Date(stored.lastActiveAt),
    messages: stored.messages.map((m) => ({
      ...m,
      timestamp: new Date(m.timestamp),
    })),
  };
}

function serializeSession(session: VisitorSession): StoredSession {
  return {
    ...session,
    startedAt: session.startedAt.toISOString(),
    lastActiveAt: session.lastActiveAt.toISOString(),
    messages: session.messages.map((m) => ({
      ...m,
      timestamp: m.timestamp.toISOString(),
    })),
  };
}

function createNewSession(): VisitorSession {
  return {
    id: generateSessionId(),
    startedAt: new Date(),
    lastActiveAt: new Date(),
    messages: [],
    context: {},
    currentCanvas: "initial",
    intent: "unknown",
    engagementScore: 0,
    viewedCaseStudies: [],
    viewedServices: [],
  };
}

// ============================================================================
// HOOK
// ============================================================================

export function useVisitorMemory() {
  const [session, setSession] = useState<VisitorSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load session from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: StoredSession = JSON.parse(stored);
        if (!isSessionExpired(parsed)) {
          setSession(parseStoredSession(parsed));
        } else {
          // Session expired, create new one
          const newSession = createNewSession();
          setSession(newSession);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(serializeSession(newSession)));
        }
      } else {
        // No session, create new one
        const newSession = createNewSession();
        setSession(newSession);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(serializeSession(newSession)));
      }
    } catch (e) {
      // Handle localStorage errors gracefully
      console.warn("Failed to load session from localStorage:", e);
      setSession(createNewSession());
    }
    setIsLoading(false);
  }, []);

  // Persist session changes to localStorage
  useEffect(() => {
    if (session && !isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(serializeSession(session)));
      } catch (e) {
        console.warn("Failed to save session to localStorage:", e);
      }
    }
  }, [session, isLoading]);

  // Add a message to the session
  const addMessage = useCallback((message: Message) => {
    setSession((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        messages: [...prev.messages, message],
        lastActiveAt: new Date(),
        engagementScore: prev.engagementScore + (message.role === "user" ? 2 : 1),
      };
    });
  }, []);

  // Update context with new information
  const updateContext = useCallback((newContext: Partial<ExtractedContext>) => {
    setSession((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        context: { ...prev.context, ...newContext },
        lastActiveAt: new Date(),
      };
    });
  }, []);

  // Update current canvas and intent
  const updateCanvasAndIntent = useCallback((canvas: CanvasType, intent: Intent) => {
    setSession((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        currentCanvas: canvas,
        intent,
        lastActiveAt: new Date(),
      };
    });
  }, []);

  // Record that a case study was viewed
  const recordCaseStudyView = useCallback((caseStudyId: string) => {
    setSession((prev) => {
      if (!prev) return prev;
      if (prev.viewedCaseStudies.includes(caseStudyId)) return prev;
      return {
        ...prev,
        viewedCaseStudies: [...prev.viewedCaseStudies, caseStudyId],
        engagementScore: prev.engagementScore + 3,
        lastActiveAt: new Date(),
      };
    });
  }, []);

  // Record that a service was viewed
  const recordServiceView = useCallback((serviceId: string) => {
    setSession((prev) => {
      if (!prev) return prev;
      if (prev.viewedServices.includes(serviceId)) return prev;
      return {
        ...prev,
        viewedServices: [...prev.viewedServices, serviceId],
        engagementScore: prev.engagementScore + 2,
        lastActiveAt: new Date(),
      };
    });
  }, []);

  // Get conversation summary for API context
  const getConversationSummary = useCallback((): string => {
    if (!session) return "";

    const parts: string[] = [];

    if (session.messages.length > 0) {
      parts.push(`Previous messages: ${session.messages.length}`);
    }

    if (session.context.industry) {
      parts.push(`Industry: ${session.context.industry}`);
    }

    if (session.context.challenge) {
      parts.push(`Challenge: ${session.context.challenge}`);
    }

    if (session.context.region) {
      parts.push(`Region: ${session.context.region}`);
    }

    if (session.viewedCaseStudies.length > 0) {
      parts.push(`Viewed case studies: ${session.viewedCaseStudies.join(", ")}`);
    }

    if (session.viewedServices.length > 0) {
      parts.push(`Interested in: ${session.viewedServices.join(", ")}`);
    }

    return parts.join(". ");
  }, [session]);

  // Reset session
  const resetSession = useCallback(() => {
    const newSession = createNewSession();
    setSession(newSession);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(serializeSession(newSession)));
    } catch (e) {
      console.warn("Failed to reset session in localStorage:", e);
    }
  }, []);

  // Get engagement level
  const getEngagementLevel = useCallback((): "low" | "medium" | "high" => {
    if (!session) return "low";
    if (session.engagementScore >= 15) return "high";
    if (session.engagementScore >= 7) return "medium";
    return "low";
  }, [session]);

  // Check if visitor seems ready to book a call
  const isReadyToConvert = useCallback((): boolean => {
    if (!session) return false;
    return (
      session.engagementScore >= 10 &&
      session.viewedCaseStudies.length >= 1 &&
      session.messages.length >= 3
    );
  }, [session]);

  return {
    session,
    isLoading,
    addMessage,
    updateContext,
    updateCanvasAndIntent,
    recordCaseStudyView,
    recordServiceView,
    getConversationSummary,
    resetSession,
    getEngagementLevel,
    isReadyToConvert,
  };
}
