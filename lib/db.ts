// Simple JSON file-based storage for leads and conversations
// Can be migrated to Prisma/PostgreSQL later

import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const LEADS_FILE = path.join(DATA_DIR, "leads.json");
const CONVERSATIONS_FILE = path.join(DATA_DIR, "conversations.json");

// Types
export interface Lead {
  id: string;
  createdAt: string;
  updatedAt: string;

  // Contact info
  name?: string;
  email?: string;
  company?: string;
  phone?: string;
  location?: string;

  // Lead qualification
  challenge?: string;
  serviceArea?: string;
  urgency?: string;

  // Meeting scheduling
  preferredTimes?: string[];
  meetingBooked: boolean;
  meetingDate?: string;

  // Tracking
  conversationId?: string;
  status: "new" | "qualified" | "contacted" | "converted";
  notes?: string;
}

export interface Message {
  id: string;
  createdAt: string;
  role: "user" | "assistant";
  content: string;
  agentMode?: string;
}

export interface Conversation {
  id: string;
  createdAt: string;
  sessionId: string;
  agentMode: "qualifier" | "educator" | "scheduler" | "objection_handler";
  leadId?: string;
  leadCaptured: boolean;
  messages: Message[];
  collectedInfo: Partial<Lead>;
}

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Read JSON file
function readJsonFile<T>(filePath: string, defaultValue: T): T {
  ensureDataDir();
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2));
    return defaultValue;
  }
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
}

// Write JSON file
function writeJsonFile<T>(filePath: string, data: T): void {
  ensureDataDir();
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Generate unique ID
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// ============================================================================
// LEAD OPERATIONS
// ============================================================================

export function getLeads(): Lead[] {
  return readJsonFile<Lead[]>(LEADS_FILE, []);
}

export function getLead(id: string): Lead | undefined {
  const leads = getLeads();
  return leads.find((l) => l.id === id);
}

export function createLead(data: Partial<Lead>): Lead {
  const leads = getLeads();
  const now = new Date().toISOString();

  const lead: Lead = {
    id: generateId(),
    createdAt: now,
    updatedAt: now,
    meetingBooked: false,
    status: "new",
    ...data,
  };

  leads.push(lead);
  writeJsonFile(LEADS_FILE, leads);
  return lead;
}

export function updateLead(id: string, data: Partial<Lead>): Lead | undefined {
  const leads = getLeads();
  const index = leads.findIndex((l) => l.id === id);

  if (index === -1) return undefined;

  leads[index] = {
    ...leads[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };

  writeJsonFile(LEADS_FILE, leads);
  return leads[index];
}

// ============================================================================
// CONVERSATION OPERATIONS
// ============================================================================

export function getConversations(): Conversation[] {
  return readJsonFile<Conversation[]>(CONVERSATIONS_FILE, []);
}

export function getConversation(sessionId: string): Conversation | undefined {
  const conversations = getConversations();
  return conversations.find((c) => c.sessionId === sessionId);
}

export function createConversation(sessionId: string): Conversation {
  const conversations = getConversations();

  const conversation: Conversation = {
    id: generateId(),
    createdAt: new Date().toISOString(),
    sessionId,
    agentMode: "qualifier",
    leadCaptured: false,
    messages: [],
    collectedInfo: {},
  };

  conversations.push(conversation);
  writeJsonFile(CONVERSATIONS_FILE, conversations);
  return conversation;
}

export function updateConversation(
  sessionId: string,
  data: Partial<Conversation>
): Conversation | undefined {
  const conversations = getConversations();
  const index = conversations.findIndex((c) => c.sessionId === sessionId);

  if (index === -1) return undefined;

  conversations[index] = {
    ...conversations[index],
    ...data,
  };

  writeJsonFile(CONVERSATIONS_FILE, conversations);
  return conversations[index];
}

export function addMessage(
  sessionId: string,
  message: Omit<Message, "id" | "createdAt">
): Message {
  const conversations = getConversations();
  const index = conversations.findIndex((c) => c.sessionId === sessionId);

  const newMessage: Message = {
    id: generateId(),
    createdAt: new Date().toISOString(),
    ...message,
  };

  if (index === -1) {
    // Create new conversation
    const conversation = createConversation(sessionId);
    conversation.messages.push(newMessage);
    updateConversation(sessionId, { messages: conversation.messages });
  } else {
    conversations[index].messages.push(newMessage);
    writeJsonFile(CONVERSATIONS_FILE, conversations);
  }

  return newMessage;
}

export function getOrCreateConversation(sessionId: string): Conversation {
  let conversation = getConversation(sessionId);
  if (!conversation) {
    conversation = createConversation(sessionId);
  }
  return conversation;
}

// Save lead from collected info
export function saveLeadFromConversation(sessionId: string): Lead | undefined {
  const conversation = getConversation(sessionId);
  if (!conversation || !conversation.collectedInfo) return undefined;

  const lead = createLead({
    ...conversation.collectedInfo,
    conversationId: conversation.id,
    status: "qualified",
  });

  updateConversation(sessionId, {
    leadId: lead.id,
    leadCaptured: true,
  });

  return lead;
}
