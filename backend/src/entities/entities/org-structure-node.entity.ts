import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';
import { OrganizationEntity } from './organization.entity';

/**
 * Represents a node in any of the 4 organizational structure types:
 * 1. Organizational Structure (Org. Struc.) - shareholder/board hierarchy
 * 2. Management Structure - HQ/regions/countries
 * 3. Function Structure - departments/sections
 * 4. Geographical Structure - countries/governorates/districts
 */
@Entity('org_structure_nodes')
@Tree('materialized-path')
export class OrgStructureNodeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  organizationId: string;

  @Column()
  structureType: string; // 'organizational' | 'management' | 'function' | 'geographical'

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: 1 })
  level: number; // 1, 2, or 3

  @Column({ nullable: true })
  code: string; // Internal reference code

  @Column({ default: 0 })
  sortOrder: number;

  @Column({ type: 'jsonb', default: '[]' })
  positionIds: string[]; // Positions assigned to this node

  @TreeChildren()
  children: OrgStructureNodeEntity[];

  @TreeParent()
  parent: OrgStructureNodeEntity;

  @ManyToOne(() => OrganizationEntity, (org) => org.structureNodes)
  @JoinColumn({ name: 'organizationId' })
  organization: OrganizationEntity;

  @CreateDateColumn()
  createdAt: Date;
}
