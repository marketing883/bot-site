/**
 * Output Validation Layer
 *
 * Validates LLM responses against known facts to catch hallucinations.
 * If validation fails, sanitizes the response or flags for review.
 */

import { credentials, metrics, aboutInfo } from "./knowledge";
import { caseStudies, serviceAreas } from "./data";

// ============================================================================
// KNOWN FACTS - Extracted for validation
// ============================================================================

const KNOWN_NUMBERS: Record<string, string[]> = {
  "130%": ["market growth", "growth", "south africa"],
  "50%": ["conversion", "improvement", "lift"],
  "25%": ["sales cycle", "reduction", "shorter"],
  "3x": ["pipeline", "opportunities"],
  "200%": ["enterprise pipeline", "arqai"],
  "3": ["patents", "patent-pending", "filed"],
  "2025": ["gec award", "award"],
};

const KNOWN_AWARDS = credentials
  .filter((c) => c.type === "award")
  .map((c) => c.title.toLowerCase());

const KNOWN_CASE_STUDY_IDS = caseStudies.map((c) => c.id);
const KNOWN_SERVICE_IDS = serviceAreas.map((s) => s.id);

const FORBIDDEN_CLAIMS = [
  /\$\d+[MBK]?\s*(revenue|funding|raised)/i, // Revenue claims we don't have
  /\d+\+?\s*(clients?|customers?|companies)/i, // Client count claims
  /"[^"]+"\s*-\s*[A-Z][a-z]+\s+[A-Z]/i, // Fake testimonials
  /Fortune\s+\d+/i, // Fortune 500 claims
  /Gartner|Forrester|McKinsey/i, // Analyst firm associations
];

// ============================================================================
// VALIDATION TYPES
// ============================================================================

export interface ValidationResult {
  isValid: boolean;
  confidence: number;
  issues: ValidationIssue[];
  sanitizedResponse?: string;
}

export interface ValidationIssue {
  type: "hallucination" | "exaggeration" | "forbidden_claim" | "unknown_reference";
  severity: "low" | "medium" | "high";
  description: string;
  original: string;
  suggestion?: string;
}

// ============================================================================
// VALIDATORS
// ============================================================================

/**
 * Check if a number in context matches known facts
 */
function validateNumbers(response: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // Find all percentages and numbers
  const numberPattern = /(\d+(?:\.\d+)?%?x?)/gi;
  const matches = response.matchAll(numberPattern);

  for (const match of matches) {
    const number = match[0];
    const surrounding = response
      .slice(Math.max(0, match.index! - 50), match.index! + number.length + 50)
      .toLowerCase();

    // Check if it's a known number used in correct context
    let isValid = false;
    for (const [knownNum, contexts] of Object.entries(KNOWN_NUMBERS)) {
      if (number === knownNum || number === knownNum.replace("%", "")) {
        if (contexts.some((ctx) => surrounding.includes(ctx))) {
          isValid = true;
          break;
        }
      }
    }

    // Skip small numbers that are likely just counts (1, 2, etc.)
    const numValue = parseFloat(number.replace(/[%x]/g, ""));
    if (numValue < 10 && !number.includes("%") && !number.includes("x")) {
      continue;
    }

    // Flag large percentage claims not in our data
    if (number.includes("%") && numValue > 50 && !isValid) {
      // Check if it's close to a known number
      const closeMatch = Object.keys(KNOWN_NUMBERS).find((k) => {
        const kVal = parseFloat(k.replace(/[%x]/g, ""));
        return Math.abs(kVal - numValue) <= 10;
      });

      if (!closeMatch) {
        issues.push({
          type: "exaggeration",
          severity: "medium",
          description: `Unverified metric: ${number}`,
          original: surrounding.trim(),
          suggestion: "Use verified metrics from case studies",
        });
      }
    }
  }

  return issues;
}

/**
 * Check for forbidden claims
 */
function validateForbiddenClaims(response: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  for (const pattern of FORBIDDEN_CLAIMS) {
    const match = response.match(pattern);
    if (match) {
      issues.push({
        type: "forbidden_claim",
        severity: "high",
        description: `Potentially fabricated claim: "${match[0]}"`,
        original: match[0],
        suggestion: "Remove this claim or replace with verified facts",
      });
    }
  }

  return issues;
}

/**
 * Check for unknown case study or service references
 */
function validateReferences(response: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // Check for potential company name fabrication
  // Pattern: "worked with [Company]" or "[Company] case study"
  const companyPattern = /(?:worked with|helped|for)\s+([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)?)/g;
  const companyMatches = response.matchAll(companyPattern);

  for (const match of companyMatches) {
    const company = match[1].toLowerCase();
    // Skip if it's a known case study reference
    const isKnown = KNOWN_CASE_STUDY_IDS.some(
      (id) => company.includes(id) || id.includes(company)
    );

    // Skip common words
    const commonWords = ["companies", "clients", "organizations", "enterprises", "businesses"];
    if (commonWords.some((w) => company.includes(w))) {
      continue;
    }

    if (!isKnown) {
      issues.push({
        type: "unknown_reference",
        severity: "medium",
        description: `Unknown company reference: ${match[1]}`,
        original: match[0],
        suggestion: "Reference case studies by their known titles only",
      });
    }
  }

  return issues;
}

/**
 * Check for award/credential accuracy
 */
function validateCredentials(response: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const responseLower = response.toLowerCase();

  // Check for award mentions
  const awardPattern = /(?:won|received|awarded|earned)\s+(?:the\s+)?([^,.]+(?:award|prize|recognition))/gi;
  const awardMatches = response.matchAll(awardPattern);

  for (const match of awardMatches) {
    const award = match[1].toLowerCase().trim();
    const isKnown = KNOWN_AWARDS.some((a) => award.includes(a) || a.includes(award));

    if (!isKnown && !award.includes("gec")) {
      issues.push({
        type: "hallucination",
        severity: "high",
        description: `Unknown award reference: ${match[1]}`,
        original: match[0],
        suggestion: 'Only reference "GEC Award 2025 for Innovation"',
      });
    }
  }

  return issues;
}

// ============================================================================
// MAIN VALIDATION FUNCTION
// ============================================================================

/**
 * Validate an LLM response against known facts
 */
export function validateResponse(response: string): ValidationResult {
  const issues: ValidationIssue[] = [
    ...validateNumbers(response),
    ...validateForbiddenClaims(response),
    ...validateReferences(response),
    ...validateCredentials(response),
  ];

  // Calculate confidence based on issues
  let confidence = 1.0;
  for (const issue of issues) {
    switch (issue.severity) {
      case "high":
        confidence -= 0.3;
        break;
      case "medium":
        confidence -= 0.15;
        break;
      case "low":
        confidence -= 0.05;
        break;
    }
  }
  confidence = Math.max(0, confidence);

  // Determine if valid (no high severity issues)
  const hasHighSeverity = issues.some((i) => i.severity === "high");
  const isValid = !hasHighSeverity && confidence >= 0.5;

  return {
    isValid,
    confidence,
    issues,
    sanitizedResponse: isValid ? response : sanitizeResponse(response, issues),
  };
}

/**
 * Sanitize a response by removing problematic claims
 */
function sanitizeResponse(response: string, issues: ValidationIssue[]): string {
  let sanitized = response;

  // Remove forbidden claims
  for (const issue of issues.filter((i) => i.type === "forbidden_claim")) {
    sanitized = sanitized.replace(issue.original, "[specific details available on request]");
  }

  // Replace hallucinated credentials
  for (const issue of issues.filter((i) => i.type === "hallucination")) {
    if (issue.suggestion) {
      sanitized = sanitized.replace(issue.original, "recognized industry expertise");
    }
  }

  return sanitized;
}

// ============================================================================
// INTENT VALIDATION
// ============================================================================

export type ValidIntent =
  | "ai-strategy"
  | "speaking"
  | "gtm"
  | "market-expansion"
  | "case-study"
  | "about"
  | "contact"
  | "general";

/**
 * Validate and normalize intent
 */
export function validateIntent(intent: string): ValidIntent {
  const normalized = intent.toLowerCase().trim();

  const intentMap: Record<string, ValidIntent> = {
    "ai-strategy": "ai-strategy",
    "ai strategy": "ai-strategy",
    "ai": "ai-strategy",
    "governance": "ai-strategy",
    speaking: "speaking",
    speaker: "speaking",
    keynote: "speaking",
    gtm: "gtm",
    "go-to-market": "gtm",
    "go to market": "gtm",
    marketing: "gtm",
    sales: "gtm",
    "market-expansion": "market-expansion",
    expansion: "market-expansion",
    global: "market-expansion",
    international: "market-expansion",
    "case-study": "case-study",
    "case study": "case-study",
    example: "case-study",
    about: "about",
    who: "about",
    background: "about",
    contact: "contact",
    book: "contact",
    call: "contact",
    meeting: "contact",
  };

  return intentMap[normalized] || "general";
}

// ============================================================================
// CONTEXT EXTRACTION VALIDATION
// ============================================================================

export interface ValidatedContext {
  industry?: string;
  challenge?: string;
  companySize?: string;
  region?: string;
  audienceType?: string;
  isComplete: boolean;
  missingFields: string[];
}

const VALID_INDUSTRIES = [
  "fintech",
  "regtech",
  "saas",
  "enterprise software",
  "ai",
  "healthcare",
  "finance",
  "technology",
  "manufacturing",
  "retail",
  "education",
];

const VALID_REGIONS = ["eu", "europe", "mena", "middle east", "apac", "asia", "africa", "usa", "americas"];

const VALID_COMPANY_SIZES = ["startup", "scaleup", "enterprise", "smb", "mid-market"];

/**
 * Validate extracted context from conversation
 */
export function validateContext(context: Record<string, unknown>): ValidatedContext {
  const validated: ValidatedContext = {
    isComplete: false,
    missingFields: [],
  };

  // Validate industry
  if (context.industry && typeof context.industry === "string") {
    const industryLower = context.industry.toLowerCase();
    if (VALID_INDUSTRIES.some((i) => industryLower.includes(i))) {
      validated.industry = context.industry;
    }
  }

  // Validate region
  if (context.region && typeof context.region === "string") {
    const regionLower = context.region.toLowerCase();
    if (VALID_REGIONS.some((r) => regionLower.includes(r))) {
      validated.region = context.region;
    }
  }

  // Validate company size
  if (context.companySize && typeof context.companySize === "string") {
    const sizeLower = context.companySize.toLowerCase();
    if (VALID_COMPANY_SIZES.some((s) => sizeLower.includes(s))) {
      validated.companySize = context.companySize;
    }
  }

  // Challenge and audience are free-form but sanitized
  if (context.challenge && typeof context.challenge === "string") {
    validated.challenge = context.challenge.slice(0, 500); // Limit length
  }

  if (context.audienceType && typeof context.audienceType === "string") {
    validated.audienceType = context.audienceType.slice(0, 100);
  }

  // Determine completeness
  const importantFields = ["industry", "challenge"];
  validated.missingFields = importantFields.filter(
    (f) => !validated[f as keyof ValidatedContext]
  );
  validated.isComplete = validated.missingFields.length === 0;

  return validated;
}
