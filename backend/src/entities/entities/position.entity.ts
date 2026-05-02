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
  idCode: string; // IDG-XXXXXXXXXX

  @Column()
  positionTitle: string;

  @Column()
  positionRef: string;

  @Column({ nullable: true })
  description: string;

  // Organization this position belongs to
  @Column()
  organizationId: string;

  @ManyToOne(() => OrganizationEntity, (org) => org.positions)
  @JoinColumn({ name: 'organizationId' })
  organization: OrganizationEntity;

  // The natural person currently linked to this position
  @Column({ nullable: true })
  @Index()
  linkedNaturalId: string;

  @Column({ default: 'inactive' })
  linkStatus: string; // pending, active, unlinked, blocked

  // Where in the org structure this position sits
  @Column({ nullable: true })
  orgLevelCode: string;

  // Authorization profile (JSON)
  @Column('jsonb', { default: '{}' })
  authorizationProfile: Record<string, boolean>;

  @Column({ default: false })
  locationTrackingEnabled: boolean;

  @Column({ default: 'active' })
  status: string;

  @Column({ nullable: true })
  linkedAt: Date;

  @Column({ nullable: true })
  unlinkedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
