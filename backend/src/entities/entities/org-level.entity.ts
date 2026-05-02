import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';
import { OrganizationEntity } from './organization.entity';

@Entity('org_levels')
@Tree('materialized-path')
export class OrgLevelEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string; // e.g., BL1000

  @Column()
  name: string;

  @Column()
  level: number; // Depth in hierarchy

  @Column()
  type: string; // organization, company, branch, unit, department, section, area, function, group

  @Column()
  organizationId: string;

  @ManyToOne(() => OrganizationEntity, (org) => org.orgLevels)
  @JoinColumn({ name: 'organizationId' })
  organization: OrganizationEntity;

  @TreeParent()
  parent: OrgLevelEntity;

  @TreeChildren()
  children: OrgLevelEntity[];

  @Column('simple-array', { nullable: true })
  positionIds: string[];

  @CreateDateColumn()
  createdAt: Date;
}
