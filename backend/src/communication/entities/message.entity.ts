import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { ConversationEntity } from './conversation.entity';

@Entity('messages')
export class MessageEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  conversationId: string;

  @ManyToOne(() => ConversationEntity, (conv) => conv.messages)
  @JoinColumn({ name: 'conversationId' })
  conversation: ConversationEntity;

  @Column()
  senderId: string;

  @Column()
  senderType: string; // natural, virtual

  @Column()
  senderDisplayName: string;

  @Column()
  type: string; // text, voice, document, photo, video, report, location, account_share

  @Column('text')
  content: string;

  @Column('jsonb', { nullable: true })
  attachments: any[];

  @Column({ nullable: true })
  replyToId: string;

  @Column({ nullable: true })
  forwardedFromId: string;

  @Column({ default: 'sent' })
  status: string; // sent, delivered, read, failed

  @CreateDateColumn()
  createdAt: Date;
}
