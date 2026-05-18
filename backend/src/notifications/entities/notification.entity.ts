import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('notifications')
export class NotificationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  recipientId: string; // User ID or Position ID

  @Column()
  recipientType: string; // 'natural' | 'virtual'

  @Column()
  type: string; // 'contact_request' | 'position_link_request' | 'position_link_accepted' |
  // 'meeting_request' | 'task_assignment' | 'delegation_request' | 'message' | 'system'

  @Column()
  title: string;

  @Column({ nullable: true })
  body: string;

  @Column({ type: 'jsonb', nullable: true })
  data: object; // Additional context (e.g. { contactId, positionId, meetingId })

  @Column({ nullable: true })
  senderId: string;

  @Column({ nullable: true })
  senderName: string;

  @Column({ nullable: true })
  senderType: string; // 'natural' | 'virtual' | 'system'

  @Column({ default: false })
  isRead: boolean;

  @Column({ default: false })
  isActioned: boolean; // For actionable notifications (accept/reject)

  @Column({ nullable: true })
  actionResult: string; // 'accepted' | 'rejected' | 'clarified'

  @CreateDateColumn()
  createdAt: Date;
}
