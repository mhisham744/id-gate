import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { OrganizationEntity } from './organization.entity';

@Entity('positions')
export class PositionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @Index()
  idCode: string; // IDG-POS-XXXXXXXXXX

  // ─── Position Information ───
  @Column()
  positionName: string;

  @Column({ nullable: true })
  positionName1: string;

  @Column({ nullable: true })
  positionName2: string;

  @Column({ nullable: true })
  positionName3: string;

  @Column({ nullable: true })
  positionDescription: string;

  @Column({ nullable: true })
  positionCode: string; // Internal code (e.g. employee ID in ERP)

  // ─── Languages ───
  @Column({ nullable: true })
  language1: string;

  @Column({ nullable: true })
  language2: string;

  @Column({ nullable: true })
  language3: string;

  @Column({ nullable: true })
  language4: string;

  // ─── Contact Information ───
  @Column({ nullable: true })
  mobileNumber: string;

  @Column({ nullable: true })
  telephoneNumber: string;

  @Column({ nullable: true })
  emailAddress: string;

  // ─── Structure Assignment (where this position sits) ───
  @Column()
  organizationId: string;

  @Column({ nullable: true })
  orgStructureNodeId: string; // Organizational structure (Org. Struc.)

  @Column({ nullable: true })
  managementStructureNodeId: string; // Management structure node

  @Column({ nullable: true })
  functionStructureNodeId: string; // Function/department structure node

  @Column({ nullable: true })
  geographicalStructureNodeId: string; // Geographical structure node

  // ─── Authorization & Delegation ───
  @Column({ type: 'jsonb', nullable: true })
  positionProfile: string[]; // Array of profile/permission names

  @Column({ type: 'jsonb', nullable: true })
  delegationSubjects: string[]; // What this position is authorized to do

  @Column({ type: 'jsonb', nullable: true })
  delegationLimits: object[]; // { subject, limit, currency }

  @Column({ default: false })
  canDelegateOthers: boolean; // Can grant permissions to others

  @Column({ nullable: true })
  delegationDuration: string; // 'open' | 'limited'

  @Column({ nullable: true })
  delegationStartDate: string;

  @Column({ nullable: true })
  delegationEndDate: string;

  @Column({ default: false })
  displayHistory: boolean; // Can linked person see old messages

  @Column({ default: 'closed' })
  locationPrivacy: string; // 'public' | 'contacts' | 'closed'

  @Column({ default: false })
  locationTrackingEnabled: boolean;

  // ─── Linking ───
  @Column({ nullable: true })
  linkedNaturalId: string; // The natural person linked to this position

  @Column({ default: 'vacant' })
  linkStatus: string; // 'vacant' | 'pending' | 'active' | 'unlinked' | 'blocked'

  @Column({ nullable: true })
  linkedAt: Date;

  @Column({ nullable: true })
  unlinkedAt: Date;

  // ─── System ───
  @Column({ default: 'active' })
  status: string; // 'active' | 'blocked' | 'archived'

  @ManyToOne(() => OrganizationEntity, (org) => org.positions)
  @JoinColumn({ name: 'organizationId' })
  organization: OrganizationEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
