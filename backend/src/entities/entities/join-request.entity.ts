import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { OrganizationEntity } from './organization.entity';

@Entity('join_requests')
export class JoinRequestEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  organizationId: string;

  @ManyToOne(() => OrganizationEntity)
  @JoinColumn({ name: 'organizationId' })
  organization: OrganizationEntity;

  @Column()
  requesterId: string;

  /** Status: pending, approved, rejected, cancelled */
  @Column({ default: 'pending' })
  status: string;

  /** Free-text message from the requester */
  @Column({ type: 'text', nullable: true })
  message: string;

  /** Selected structure node IDs the user wants to join under */
  @Column({ type: 'jsonb', default: '{}' })
  selectedStructure: {
    organizational?: string; // node ID
    management?: string;
    function?: string;
    geographical?: string;
  };

  /** Optional: position they are requesting */
  @Column({ nullable: true })
  requestedPositionId: string;

  /** Admin notes (filled when approved/rejected) */
  @Column({ type: 'text', nullable: true })
  adminNotes: string;

  @Column({ nullable: true })
  reviewedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  reviewedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
