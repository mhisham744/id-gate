import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { MessageEntity } from './message.entity';

@Entity('conversations')
export class ConversationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  type: string; // direct, team, group, broadcast

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column('simple-array')
  participantIds: string[];

  @Column('simple-array', { nullable: true })
  adminIds: string[];

  @Column({ nullable: true })
  lastMessagePreview: string;

  @Column({ nullable: true })
  lastMessageAt: Date;

  @OneToMany(() => MessageEntity, (msg) => msg.conversation)
  messages: MessageEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
