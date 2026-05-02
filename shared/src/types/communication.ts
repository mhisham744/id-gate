// ============================================================
// IDGate Shared Types - Communication Models
// ============================================================

export enum MessageType {
  TEXT = 'text',
  VOICE = 'voice',
  DOCUMENT = 'document',
  PHOTO = 'photo',
  VIDEO = 'video',
  REPORT = 'report',
  LOCATION = 'location',
  ACCOUNT_SHARE = 'account_share',
}

export enum ConversationType {
  DIRECT = 'direct',           // Person to person
  TEAM = 'team',               // Team conversation
  GROUP = 'group',             // Group conversation
  BROADCAST = 'broadcast',     // One-to-many, reply is one-to-one
}

export enum MessageStatus {
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  FAILED = 'failed',
}

export interface Message {
  id: string;
  conversationId: string;

  // Sender identity (can be natural or virtual character)
  senderId: string;
  senderType: 'natural' | 'virtual';
  senderDisplayName: string;

  // Content
  type: MessageType;
  content: string;             // Text content or media URL
  attachments?: Attachment[];

  // Metadata
  replyToId?: string;          // If replying to a message
  forwardedFromId?: string;    // If forwarded

  status: MessageStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Attachment {
  id: string;
  type: 'document' | 'photo' | 'video' | 'report' | 'location';
  url: string;
  fileName?: string;
  mimeType?: string;
  size?: number;
}

export interface Conversation {
  id: string;
  type: ConversationType;
  name?: string;               // For teams/groups
  description?: string;

  // Participants
  participantIds: string[];    // IDs (can be natural or virtual)
  adminIds: string[];          // IDs of admins

  // Last activity
  lastMessageId?: string;
  lastMessageAt?: string;
  lastMessagePreview?: string;

  // Settings
  isMuted?: boolean;
  isPinned?: boolean;

  createdAt: string;
  updatedAt: string;
}

// --- Address Book ---

export enum ContactStatus {
  PENDING_SENT = 'pending_sent',         // I sent request, waiting for their approval
  PENDING_RECEIVED = 'pending_received', // They sent request, waiting for my approval
  CONNECTED = 'connected',
  DECLINED = 'declined',
  BLOCKED = 'blocked',
}

export interface Contact {
  id: string;
  ownerId: string;             // My ID
  contactId: string;           // Their ID
  contactType: 'natural' | 'virtual';
  status: ContactStatus;
  displayName: string;
  addedAt: string;
  connectedAt?: string;
}

// --- Teams ---

export enum TeamVisibility {
  LIMITED = 'limited',         // Private, invite-only, can have sub-admins
  CLOSED = 'closed',          // Private, invite-only, no sub-admins
  PUBLIC = 'public',          // Anyone can find and join
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  visibility: TeamVisibility;
  conversationId: string;      // Linked conversation

  creatorId: string;
  adminIds: string[];
  memberIds: string[];

  createdAt: string;
  updatedAt: string;
}

// --- Groups (Organization-level groups) ---

export interface Group {
  id: string;
  name: string;
  description?: string;
  visibility: TeamVisibility;
  groupType: 'org' | 'org_level' | 'mixed';
  conversationId: string;

  legalEntityId?: string;      // If org group
  orgLevelCode?: string;       // If org level group

  creatorId: string;
  adminIds: string[];
  memberIds: string[];         // Can be positions, persons, or other groups

  // Groups can contain other groups
  childGroupIds?: string[];

  createdAt: string;
  updatedAt: string;
}

// --- Broadcast ---

export interface BroadcastList {
  id: string;
  name: string;
  description?: string;
  creatorId: string;
  recipientIds: string[];      // Distribution list

  createdAt: string;
  updatedAt: string;
}
