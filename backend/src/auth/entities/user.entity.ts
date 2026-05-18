import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @Index()
  idCode: string; // IDG-XXXXXXXXXX

  @Column({ unique: true })
  @Index()
  phoneNumber: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column({ default: 'personal' })
  accountType: string; // 'personal' | 'organization'

  // ─── Personal Information ───
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  fullName: string;

  @Column({ nullable: true })
  gender: string; // male | female

  @Column({ nullable: true })
  dateOfBirth: string;

  @Column({ nullable: true })
  nationality1: string;

  @Column({ nullable: true })
  nationality2: string;

  @Column({ nullable: true })
  nationality3: string;

  @Column({ nullable: true })
  nationality4: string;

  @Column({ nullable: true })
  residenceCountry: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  address1: string;

  @Column({ nullable: true })
  address2: string;

  @Column({ nullable: true })
  address3: string;

  // ─── Identification Documents ───
  @Column({ nullable: true })
  nationalId: string;

  @Column({ nullable: true })
  passport1: string;

  @Column({ nullable: true })
  passport2: string;

  @Column({ nullable: true })
  passport3: string;

  @Column({ nullable: true })
  passport4: string;

  @Column({ nullable: true })
  drivingLicense: string;

  // ─── Languages ───
  @Column({ nullable: true })
  motherTongue: string;

  @Column({ nullable: true })
  language1: string; // format: "language:proficiency" e.g. "English:Fluent"

  @Column({ nullable: true })
  language2: string;

  @Column({ nullable: true })
  language3: string;

  @Column({ nullable: true })
  language4: string;

  // ─── Contacts Information ───
  @Column({ nullable: true })
  landlineNumber: string;

  @Column({ nullable: true })
  linkedIn: string;

  @Column({ nullable: true })
  facebook: string;

  @Column({ nullable: true })
  whatsApp: string;

  // ─── Education ───
  @Column({ nullable: true })
  school: string;

  @Column({ nullable: true })
  university: string;

  @Column({ nullable: true })
  postgraduate: string;

  @Column({ nullable: true })
  phd: string;

  @Column({ type: 'jsonb', nullable: true })
  trainingAndCourses: string[];

  @Column({ type: 'jsonb', nullable: true })
  specialtiesAndSkills: string[];

  // ─── Career ───
  @Column({ type: 'jsonb', nullable: true })
  careerHistory: object[];

  @Column({ nullable: true })
  profession: string;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  field: string;

  @Column({ nullable: true })
  industry: string;

  @Column({ nullable: true })
  careerCountry: string;

  // ─── Vacancy Notification ───
  @Column({ default: false })
  vacancyNotificationEnabled: boolean;

  @Column({ type: 'jsonb', nullable: true })
  vacancyCriteria: object;

  // ─── Privacy Settings ───
  @Column({ default: 'public' })
  privacyPersonalInfo: string; // 'public' | 'contacts' | 'closed'

  @Column({ default: 'public' })
  privacyContactInfo: string; // 'public' | 'contacts' | 'closed'

  @Column({ default: 'public' })
  privacyEducation: string; // 'public' | 'contacts' | 'closed'

  @Column({ default: 'public' })
  privacyCareer: string; // 'public' | 'contacts' | 'closed'

  // ─── Custom Attributes ───
  @Column({ nullable: true })
  attribute1: string;

  @Column({ nullable: true })
  attribute2: string;

  @Column({ nullable: true })
  attribute3: string;

  @Column({ nullable: true })
  attribute4: string;

  @Column({ nullable: true })
  attribute5: string;

  // ─── System Fields ───
  @Column({ nullable: true })
  profilePhotoUrl: string;

  @Column({ default: 'active' })
  status: string;

  @Column({ default: true })
  isPhoneVerified: boolean;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ nullable: true })
  refreshToken: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
