import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  Unique,
} from 'typeorm';

@Entity('contacts')
@Unique(['ownerId', 'contactId'])
export class ContactEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  ownerId: string;

  @Column()
  @Index()
  contactId: string;

  @Column()
  contactType: string; // natural, virtual

  @Column({ default: 'pending_sent' })
  status: string; // pending_sent, pending_received, connected, declined, blocked

  @Column({ nullable: true })
  displayName: string;

  @CreateDateColumn()
  addedAt: Date;

  @Column({ nullable: true })
  connectedAt: Date;
}
