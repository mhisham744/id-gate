// ============================================================
// IDGate Shared Types - Identity & Entity Models
// ============================================================

// --- Enums ---

export enum EntityType {
  NATURAL = 'natural',       // الشخصية الطبيعية - Real person
  VIRTUAL = 'virtual',       // الشخصية الافتراضية - Position/role
  LEGAL = 'legal',           // الشخصية الاعتبارية - Organization
}

export enum AccountStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BLOCKED = 'blocked',
  PENDING_VERIFICATION = 'pending_verification',
}

export enum LinkStatus {
  PENDING = 'pending',       // Link request sent, awaiting approval
  ACTIVE = 'active',         // Link approved and active
  UNLINKED = 'unlinked',     // Link was removed
  BLOCKED = 'blocked',       // Link was blocked
}

export enum PositionLinkDirection {
  ORG_TO_PERSON = 'org_to_person',   // Organization requests link with person
  PERSON_ACCEPTS = 'person_accepts', // Person accepts the link
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  PREFER_NOT_TO_SAY = 'prefer_not_to_say',
}

// --- Natural Character (Real Person) ---

export interface NaturalCharacter {
  id: string;
  idCode: string;            // Unique IDGate code (IDG-XXXXXXXXXX)
  status: AccountStatus;

  // Personal Information
  firstName: string;
  lastName: string;
  gender: Gender;
  dateOfBirth: string;       // ISO date
  nationality: string;
  additionalNationalities?: string[];
  profilePhotoUrl?: string;

  // Contact
  email: string;
  phoneNumber: string;       // Primary phone (linked to identity)
  mobileNumber?: string;

  // Address
  address?: string;
  city?: string;
  country: string;
  residenceCountry?: string;

  // Education
  education?: Education[];

  // Career
  career?: CareerEntry[];

  // Skills & Languages
  specialties?: string[];
  languages?: Language[];

  // Privacy
  privacySettings: PrivacySettings;

  // CV
  cvUrl?: string;
  cvVisibility: 'open' | 'closed';

  // Vacancy notification preferences
  vacancyNotification: boolean;
  vacancyCriteria?: VacancyCriteria;

  // Linked virtual characters (positions)
  linkedPositions: string[];  // IDs of VirtualCharacter

  createdAt: string;
  updatedAt: string;
}

export interface Education {
  university: string;
  degree: string;
  graduationYear: number;
  postgraduate?: string;
  field?: string;
}

export interface CareerEntry {
  jobTitle: string;
  organizationId?: string;   // Link to LegalEntity
  organizationName: string;
  organizationLevel?: string;
  industry?: string;
  startDate: string;
  endDate?: string;          // null if current
  isCurrent: boolean;
}

export interface Language {
  name: string;
  proficiency: 'basic' | 'intermediate' | 'fluent' | 'native';
}

export interface PrivacySettings {
  profileVisibility: 'open' | 'contacts_only' | 'closed';
  showEmail: boolean;
  showPhone: boolean;
  showCareer: boolean;
  showEducation: boolean;
}

export interface VacancyCriteria {
  targetJobTitles?: string[];
  targetCareerLevel?: string[];
  targetIndustry?: string[];
  targetCountry?: string[];
  targetResidenceCountry?: string[];
}

// --- Virtual Character (Position) ---

export interface VirtualCharacter {
  id: string;
  idCode: string;            // Unique IDGate code for this position
  status: AccountStatus;

  // Position info
  positionTitle: string;
  positionRef: string;       // Organization's reference code
  description?: string;

  // Links
  legalEntityId: string;     // The organization this position belongs to
  linkedNaturalId?: string;  // The person currently holding this position
  linkStatus: LinkStatus;

  // Organization level reference
  orgLevelCode: string;      // Where in the org structure this sits

  // Authorization profile
  authorizationProfile: AuthorizationProfile;

  // Location tracking (for emergency services etc.)
  locationTrackingEnabled: boolean;

  createdAt: string;
  updatedAt: string;
  linkedAt?: string;         // When person was linked
  unlinkedAt?: string;       // When person was unlinked
}

export interface AuthorizationProfile {
  canCreateTeams: boolean;
  canCreateGroups: boolean;
  canCreateBroadcasts: boolean;
  canCreateMeetings: boolean;
  canCreateConferences: boolean;
  canCreateTasks: boolean;
  canCreateCalendarEvents: boolean;
  canCreateProjects: boolean;
  canManageMasterData: boolean;
  canManageTransactions: boolean;
  customPermissions: Record<string, boolean>;
}

// --- Legal Entity (Organization) ---

export interface LegalEntity {
  id: string;
  idCode: string;            // Unique IDGate code for this organization
  status: AccountStatus;

  // Organization info
  formalName: string;
  commercialName?: string;
  registrationNumber?: string; // e.g., commercial register number

  // Contact
  email?: string;
  website?: string;
  phoneNumber?: string;

  // Address
  address?: string;
  city?: string;
  country: string;

  // Business
  industry?: string;
  brands?: string[];
  products?: string[];

  // Structure
  orgStructure: OrgLevel[];
  positions: string[];        // IDs of VirtualCharacter

  // Admin
  adminIds: string[];         // IDs of NaturalCharacter who are admins

  // The admin has:
  // - Authority to create positions and link them to natural persons
  // - Master data management only
  // - NO communication privileges directly (must act through positions)
  // - NO team/group/meeting/conference/calendar/task participation

  createdAt: string;
  updatedAt: string;
}

export interface OrgLevel {
  id: string;
  code: string;              // e.g., BL1000
  name: string;
  parentId?: string;         // Parent org level
  level: number;             // Depth in hierarchy
  type: OrgLevelType;
  children?: OrgLevel[];
  positionIds: string[];     // Positions at this level
}

export enum OrgLevelType {
  ORGANIZATION = 'organization',
  COMPANY = 'company',
  BRANCH = 'branch',
  UNIT = 'unit',
  DEPARTMENT = 'department',
  SECTION = 'section',
  AREA = 'area',
  FUNCTION = 'function',
  GROUP = 'group',
}
