// ============================================================
// IDGate Shared Types - Identity & Entity Models
// ============================================================

export enum AccountStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BLOCKED = 'blocked',
  PENDING_VERIFICATION = 'pending_verification',
}

export enum LinkStatus {
  VACANT = 'vacant',
  PENDING = 'pending',
  ACTIVE = 'active',
  UNLINKED = 'unlinked',
  BLOCKED = 'blocked',
}

export enum PrivacyLevel {
  PUBLIC = 'public',
  CONTACTS = 'contacts',
  CLOSED = 'closed',
}

export enum OrgStructureType {
  ORGANIZATIONAL = 'organizational',
  MANAGEMENT = 'management',
  FUNCTION = 'function',
  GEOGRAPHICAL = 'geographical',
}

// --- Natural Character (Real Person / User) ---

export interface NaturalCharacter {
  id: string;
  idCode: string;
  accountType: string;
  status: AccountStatus;

  // Personal
  firstName: string;
  lastName: string;
  fullName: string;
  gender?: string;
  dateOfBirth?: string;
  nationality1?: string;
  nationality2?: string;
  nationality3?: string;
  nationality4?: string;
  residenceCountry?: string;
  city?: string;
  address1?: string;
  address2?: string;
  address3?: string;
  profilePhotoUrl?: string;

  // Documents
  nationalId?: string;
  passport1?: string;
  passport2?: string;
  passport3?: string;
  passport4?: string;
  drivingLicense?: string;

  // Contact
  email: string;
  phoneNumber: string;
  landlineNumber?: string;
  linkedIn?: string;
  facebook?: string;
  whatsApp?: string;

  // Languages
  motherTongue?: string;
  language1?: string;
  language1Proficiency?: string;
  language2?: string;
  language2Proficiency?: string;
  language3?: string;
  language3Proficiency?: string;
  language4?: string;
  language4Proficiency?: string;

  // Education
  school?: string;
  university?: string;
  postgraduate?: string;
  phd?: string;
  trainingAndCourses?: any[];
  specialtiesAndSkills?: any[];

  // Career
  careerHistory?: any[];
  profession?: string;
  title?: string;
  field?: string;
  industry?: string;
  careerCountry?: string;

  // Vacancy
  vacancyNotificationEnabled?: boolean;
  vacancyCriteria?: any;

  // Privacy
  privacyPersonalInfo?: PrivacyLevel;
  privacyContactInfo?: PrivacyLevel;
  privacyEducation?: PrivacyLevel;
  privacyCareer?: PrivacyLevel;

  // Attributes
  attribute1?: string;
  attribute2?: string;
  attribute3?: string;
  attribute4?: string;
  attribute5?: string;

  isPhoneVerified: boolean;
  isEmailVerified: boolean;

  createdAt: string;
  updatedAt: string;
}

// --- Virtual Character (Position) ---

export interface VirtualCharacter {
  id: string;
  idCode: string;

  positionName: string;
  positionName1?: string;
  positionName2?: string;
  positionName3?: string;
  positionDescription?: string;
  positionCode?: string;

  // Languages
  language1?: string;
  language2?: string;
  language3?: string;
  language4?: string;

  // Contact
  mobileNumber?: string;
  telephoneNumber?: string;
  emailAddress?: string;

  // Structure
  organizationId: string;
  orgStructureNodeId?: string;
  managementStructureNodeId?: string;
  functionStructureNodeId?: string;
  geographicalStructureNodeId?: string;

  // Authorization
  positionProfile?: any;
  delegationSubjects?: any[];
  delegationLimits?: any[];
  canDelegateOthers?: boolean;
  delegationDuration?: number;
  delegationStartDate?: string;
  delegationEndDate?: string;
  displayHistory?: boolean;
  locationPrivacy?: PrivacyLevel;
  locationTrackingEnabled?: boolean;

  // Linking
  linkedNaturalId?: string;
  linkStatus: LinkStatus;
  linkedAt?: string;
  unlinkedAt?: string;

  createdAt: string;
  updatedAt: string;
}

// --- Legal Entity (Organization) ---

export interface LegalEntity {
  id: string;
  idCode: string;
  status: AccountStatus;

  // Names
  formalName: string;
  commercialName?: string;
  searchName?: string;
  domainName?: string;
  name1?: string;
  name2?: string;
  name3?: string;
  name4?: string;
  name5?: string;

  // Legal
  orgLevel?: string;
  orgType?: string;
  legalEntityType?: string;
  dateOfOperation?: string;

  // Registration
  countryOfRegistration?: string;
  cityOfRegistration?: string;
  registrationAddress?: string;
  headquarterAddress?: string;

  // Operation
  operationAddress?: string;
  operationDistrict?: string;
  operationCountry?: string;
  operationRegion?: string;
  operationPostalCode?: string;
  operationLanguage?: string;
  secondLanguage?: string;
  timeZone?: string;
  address1?: string;
  address2?: string;
  address3?: string;
  address4?: string;
  address5?: string;

  // Registration docs
  commercialRegistrationNumber?: string;
  taxCardNumber?: string;
  manufacturingRegistrationNumber?: string;
  vatRegistrationNumber?: string;

  // Contacts
  email?: string;
  website?: string;
  phoneNumber?: string;
  mobileNumber?: string;
  faxNumber?: string;

  // Field
  mainIndustry?: string;
  subsidiaryIndustries?: string[];
  brands?: string[];
  products?: string[];

  // Structure
  holdingCompanyId?: string;
  parentBranchId?: string;
  sisterCompanyIds?: string[];
  affiliatedCompanyIds?: string[];
  branchIds?: string[];
  adminIds: string[];

  // Formal
  ceoUserId?: string;
  delegationSubjects?: any[];

  // Privacy
  privacyCorporateInfo?: PrivacyLevel;
  privacyContactInfo?: PrivacyLevel;
  privacyFieldOfOperation?: PrivacyLevel;
  privacyStructureInfo?: PrivacyLevel;

  createdAt: string;
  updatedAt: string;
}

// --- Org Structure Node ---

export interface OrgStructureNode {
  id: string;
  organizationId: string;
  structureType: OrgStructureType;
  name: string;
  description?: string;
  level: number;
  code?: string;
  sortOrder?: number;
  positionIds?: string[];
  parentId?: string;
  children?: OrgStructureNode[];
  createdAt: string;
  updatedAt: string;
}

// --- Notification ---

export interface Notification {
  id: string;
  recipientId: string;
  recipientType: 'natural' | 'virtual';
  type: string;
  title: string;
  body?: string;
  data?: any;
  senderId?: string;
  senderName?: string;
  senderType?: string;
  isRead: boolean;
  isActioned: boolean;
  actionResult?: string;
  createdAt: string;
}
