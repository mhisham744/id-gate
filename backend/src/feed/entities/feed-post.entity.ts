import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('feed_posts')
export class FeedPostEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  type: string; // news, event, report

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ nullable: true })
  summary: string;

  @Column()
  authorId: string; // userId or orgId that posted

  @Column()
  authorName: string;

  @Column({ nullable: true })
  authorType: string; // natural, virtual, organization

  @Column({ nullable: true })
  organizationId: string;

  @Column({ nullable: true })
  organizationName: string;

  @Column({ nullable: true })
  imageUrl: string;

  // Target audience (JSON array of org IDs, position IDs, or "public")
  @Column({ type: 'jsonb', default: '["public"]' })
  audience: string[];

  // Event-specific fields
  @Column({ nullable: true })
  eventDate: string;

  @Column({ nullable: true })
  eventLocation: string;

  // Report-specific fields
  @Column({ nullable: true })
  attachmentUrl: string;

  @Column({ default: 0 })
  likesCount: number;

  @Column({ default: 0 })
  forwardsCount: number;

  @Column({ default: 0 })
  commentsCount: number;

  @CreateDateColumn()
  @Index()
  createdAt: Date;
}
