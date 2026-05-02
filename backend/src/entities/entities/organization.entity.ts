import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { PositionEntity } from './position.entity';
import { OrgLevelEntity } from './org-level.entity';

@Entity('organizations')
export class OrganizationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @Index()
  idCode: string; // IDG-XXXXXXXXXX

  @Column()
  formalName: string;

  @Column({ nullable: true })
  commercialName: string;

  @Column({ nullable: true })
  registrationNumber: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  city: string;

  @Column()
  country: string;

  @Column({ nullable: true })
  industry: string;

  @Column('simple-array', { nullable: true })
  brands: string[];

  @Column('simple-array', { nullable: true })
  products: string[];

  // Admin user IDs (natural characters who manage this org)
  @Column('simple-array')
  adminIds: string[];

  @Column({ default: 'active' })
  status: string;

  @OneToMany(() => PositionEntity, (position) => position.organization)
  positions: PositionEntity[];

  @OneToMany(() => OrgLevelEntity, (level) => level.organization)
  orgLevels: OrgLevelEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
