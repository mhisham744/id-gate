// ============================================================
// IDGate Shared Types - Authentication & API Models
// ============================================================

// --- Auth ---

export interface RegisterRequest {
  phoneNumber: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  nationality: string;
  country: string;
  password: string;
}

export interface VerifyOtpRequest {
  phoneNumber: string;
  otp: string;
}

export interface LoginRequest {
  phoneNumber: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    idCode: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    profilePhotoUrl?: string;
  };
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// --- ID Code Generation ---
// Format: IDG-XXXXXXXXXX (10 alphanumeric chars)
// Each entity (natural, virtual, legal) gets a unique code

export interface IdCodeInfo {
  code: string;
  entityType: 'natural' | 'virtual' | 'legal';
  createdAt: string;
}

// --- API Response Wrappers ---

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: PaginationMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string>;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// --- Search ---

export enum SearchScope {
  PERSON = 'person',
  POSITION = 'position',
  ORG_LEVEL = 'org_level',
  ORGANIZATION = 'organization',
  TEAM = 'team',
  GROUP = 'group',
}

export interface SearchRequest {
  query: string;
  scopes: SearchScope[];
  filters?: Record<string, string>;
  pagination?: PaginationQuery;
}

export interface SearchResult {
  id: string;
  type: SearchScope;
  displayName: string;
  subtitle?: string;
  avatarUrl?: string;
  metadata?: Record<string, string>;
}

// --- Notifications ---

export enum NotificationType {
  CONTACT_REQUEST = 'contact_request',
  CONTACT_ACCEPTED = 'contact_accepted',
  POSITION_LINK_REQUEST = 'position_link_request',
  POSITION_LINKED = 'position_linked',
  POSITION_UNLINKED = 'position_unlinked',
  NEW_MESSAGE = 'new_message',
  MEETING_REQUEST = 'meeting_request',
  MEETING_UPDATED = 'meeting_updated',
  CONFERENCE_INVITATION = 'conference_invitation',
  TASK_ASSIGNED = 'task_assigned',
  TASK_UPDATED = 'task_updated',
  CALENDAR_EVENT = 'calendar_event',
  REMINDER = 'reminder',
  VACANCY_MATCH = 'vacancy_match',
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  recipientId: string;
  senderId?: string;
  referenceId?: string;        // ID of related entity
  referenceType?: string;
  isRead: boolean;
  createdAt: string;
}
