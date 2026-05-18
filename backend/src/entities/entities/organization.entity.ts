import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { PositionEntity } from './position.entity';
import { OrgStructureNodeEntity } from './org-structure-node.entity';

@Entity('organizations')
export class OrganizationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @Index()
  idCode: string; // IDG-ORG-XXXXXXXXXX

  // ─── Corporate Information ───
  @Column()
  formalName: string;

  @Column()
  commercialName: string;

  @Column({ nullable: true })
  searchName: string;

  @Column({ nullable: true })
  domainName: string; // The identifier linked to the legal entity

  @Column({ nullable: true })
  name1: string;

  @Column({ nullable: true })
  name2: string;

  @Column({ nullable: true })
  name3: string;

  @Column({ nullable: true })
  name4: string;

  @Column({ nullable: true })
  name5: string;

  // ─── Legal Structure ───
  @Column({ nullable: true })
  orgLevel: string; // 'holding' | 'individual' | 'branch'

  @Column({ nullable: true })
  orgType: string; // Company type (industrial, service, governmental, etc.)

  @Column({ nullable: true })
  legalEntityType: string; // Legal form (LLC, JSC, sole proprietorship, etc.)

  @Column({ nullable: true })
  dateOfOperation: string;

  // ─── Registration Location ───
  @Column({ nullable: true })
  countryOfRegistration: string;

  @Column({ nullable: true })
  cityOfRegistration: string;

  @Column({ nullable: true })
  registrationAddress: string;

  @Column({ nullable: true })
  headquarterAddress: string;

  // ─── Operation Location ───
  @Column({ nullable: true })
  operationAddress: string;

  @Column({ nullable: true })
  operationDistrict: string;

  @Column({ nullable: true })
  operationCountry: string;

  @Column({ nullable: true })
  operationRegion: string;

  @Column({ nullable: true })
  operationPostalCode: string;

  @Column({ nullable: true })
  operationLanguage: string;

  @Column({ nullable: true })
  secondLanguage: string;

  @Column({ nullable: true })
  timeZone: string;

  // ─── Additional Addresses ───
  @Column({ nullable: true })
  address1: string;

  @Column({ nullable: true })
  address2: string;

  @Column({ nullable: true })
  address3: string;

  @Column({ nullable: true })
  address4: string;

  @Column({ nullable: true })
  address5: string;

  // ─── Registration Documents ───
  @Column({ nullable: true })
  commercialRegistrationNumber: string;

  @Column({ nullable: true })
  taxCardNumber: string;

  @Column({ nullable: true })
  manufacturingRegistrationNumber: string;

  @Column({ nullable: true })
  vatRegistrationNumber: string;

  // ─── Contacts Information ───
  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  mobileNumber: string;

  @Column({ nullable: true })
  faxNumber: string;

  // ─── Field of Operation ───
  @Column({ nullable: true })
  mainIndustry: string;

  @Column({ type: 'jsonb', nullable: true })
  subsidiaryIndustries: string[];

  @Column({ type: 'jsonb', nullable: true })
  brands: string[];

  @Column({ type: 'jsonb', nullable: true })
  products: string[];

  // ─── Structure Relations ───
  @Column({ nullable: true })
  holdingCompanyId: string; // FK to another org (holding)

  @Column({ nullable: true })
  parentBranchId: string; // FK to parent org if this is a branch

  @Column({ type: 'jsonb', nullable: true })
  sisterCompanyIds: string[];

  @Column({ type: 'jsonb', nullable: true })
  affiliatedCompanyIds: string[];

  @Column({ type: 'jsonb', nullable: true })
  branchIds: string[];

  // ─── Formal Documentation ───
  @Column({ nullable: true })
  ceoUserId: string; // Link to the managing director's personal account

  @Column({ type: 'jsonb', nullable: true })
  delegationSubjects: string[]; // What the CEO/MD is authorized to do

  // ─── Privacy Settings ───
  @Column({ default: 'public' })
  privacyCorporateInfo: string; // 'public' | 'positions' | 'closed'

  @Column({ default: 'public' })
  privacyContactInfo: string; // 'public' | 'positions' | 'closed'

  @Column({ default: 'public' })
  privacyFieldOfOperation: string; // 'public' | 'positions' | 'closed'

  @Column({ default: 'public' })
  privacyStructureInfo: string; // 'public' | 'positions' | 'closed'

  // ─── Custom Attributes ───
  @Column({ nullable: true })
  attribute1: string;

  @Column({ nullable: true })
  attribute2: string;

  @Column({ nullable: true })
  attribute3: string;

  @Column({ nullable: true })
  attribute4: string;

  @Column({ nullable: true })
  attribute5: string;

  // ─── Admin & Status ───
  @Column({ type: 'jsonb', default: '[]' })
  adminIds: string[];

  @Column({ default: 'active' })
  status: string;

  // ─── Relations ───
  @OneToMany(() => PositionEntity, (p) => p.organization)
  positions: PositionEntity[];

  @OneToMany(() => OrgStructureNodeEntity, (n) => n.organization)
  structureNodes: OrgStructureNodeEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
