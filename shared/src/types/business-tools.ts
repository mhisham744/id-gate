// ============================================================
// IDGate Shared Types - Business Tools Models
// ============================================================

// --- Meetings ---

export enum MeetingStatus {
  ACTIVE = 'active',
  CLOSED = 'closed',
  ARCHIVED = 'archived',
}

export enum AttendeeResponse {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
}

export interface Meeting {
  id: string;
  reference: string;           // Auto-generated meeting reference
  subject: string;
  date: string;                // ISO date
  time: string;                // ISO time
  duration: {
    from: string;
    to: string;
  };
  adminId: string;
  attendees: MeetingAttendee[];
  message?: string;
  status: MeetingStatus;

  // Action plans created during meeting
  actionPlans: ActionPlan[];

  // Meeting transcript (text messages during meeting)
  conversationId: string;

  createdAt: string;
  updatedAt: string;
}

export interface MeetingAttendee {
  id: string;
  characterId: string;
  displayName: string;
  response: AttendeeResponse;
  respondedAt?: string;
}

export interface ActionPlan {
  id: string;
  meetingId: string;
  description: string;
  assigneeId: string;
  status: 'pending' | 'in_progress' | 'completed';
  dueDate?: string;
  completedAt?: string;
}

// --- Conference ---

export enum ConferenceStatus {
  SCHEDULED = 'scheduled',
  CLOSED = 'closed',
  ARCHIVED = 'archived',
}

export interface Conference {
  id: string;
  reference: string;
  subject: string;
  date: string;
  time: string;
  adminId: string;
  attendeeIds: string[];       // No confirmation needed
  agenda?: string;
  message?: string;
  status: ConferenceStatus;

  // Voice recording URL
  recordingUrl?: string;

  // Presentation slides
  slidesUrl?: string;

  // Text interaction during conference
  conversationId: string;

  createdAt: string;
  updatedAt: string;
}

// --- Calendar ---

export enum CalendarEventType {
  EVENT = 'event',             // Conference, exhibition
  OCCASION = 'occasion',      // Birthday, dinner
  MEETING = 'meeting',
  APPOINTMENT = 'appointment',
}

export interface CalendarEvent {
  id: string;
  reference: string;
  type: CalendarEventType;
  subject: string;
  date: string;
  time: string;
  location?: string;
  creatorId: string;
  attendeeIds: string[];
  message?: string;

  createdAt: string;
  updatedAt: string;
}

// --- Tasks ---

export enum TaskStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  WAITING = 'waiting',         // Waiting for someone else
  DEFERRED = 'deferred',
  CLOSED = 'closed',
  ARCHIVED = 'archived',
}

export enum TaskPriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
}

export interface Task {
  id: string;
  reference: string;
  subject: string;
  date: string;
  time?: string;
  ownerId: string;
  memberIds: string[];
  priority: TaskPriority;
  status: TaskStatus;
  reminder?: string;           // ISO datetime
  message?: string;

  createdAt: string;
  updatedAt: string;
}

// --- Reminder ---

export interface Reminder {
  id: string;
  subject: string;
  date: string;
  time?: string;
  frequency?: 'once' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  triggerType: 'at_time' | 'when_leave_location' | 'when_arrive_location';
  location?: {
    latitude: number;
    longitude: number;
    name?: string;
  };
  creatorId: string;

  createdAt: string;
  updatedAt: string;
}

// --- Notes ---

export interface Note {
  id: string;
  body: string;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
}

// --- Vacancy ---

export enum VacancyStatus {
  ACTIVE = 'active',
  ON_HOLD = 'hold',
  COMPLETED = 'completed',
}

export interface Vacancy {
  id: string;
  reference: string;
  legalEntityId: string;

  // Requirements
  jobTitle: string;
  careerLevel?: string;
  industry?: string;
  jobCountry?: string;
  education?: string;
  university?: string;
  graduationYear?: number;
  postgraduate?: string;
  specialties?: string[];
  languages?: string[];
  age?: { min?: number; max?: number };
  gender?: string;
  nationality?: string[];
  residenceCountry?: string[];
  requirements?: string;       // Full description
  dueDate?: string;

  // Notification targeting
  notificationCriteria?: {
    targetJobTitles?: string[];
    targetCareerLevel?: string[];
    targetIndustry?: string[];
    targetCountry?: string[];
    targetResidenceCountry?: string[];
    targetNationality?: string[];
  };

  status: VacancyStatus;
  pdfUrl?: string;

  createdAt: string;
  updatedAt: string;
}
