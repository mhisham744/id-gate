import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrganizationEntity } from './entities/organization.entity';
import { PositionEntity } from './entities/position.entity';
import { OrgStructureNodeEntity } from './entities/org-structure-node.entity';
import { UserEntity } from '../auth/entities/user.entity';

@Injectable()
export class EntitiesService {
  constructor(
    @InjectRepository(OrganizationEntity)
    private orgRepo: Repository<OrganizationEntity>,
    @InjectRepository(PositionEntity)
    private positionRepo: Repository<PositionEntity>,
    @InjectRepository(OrgStructureNodeEntity)
    private structureNodeRepo: Repository<OrgStructureNodeEntity>,
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
  ) {}

  // ═══════════════════════════════════════
  // ORGANIZATIONS
  // ═══════════════════════════════════════

  async createOrganization(userId: string, data: Partial<OrganizationEntity>) {
    const idCode = this.generateOrgIdCode();
    const org = this.orgRepo.create({
      ...data,
      idCode,
      adminIds: [userId],
      ceoUserId: userId,
      status: 'active',
    });
    return this.orgRepo.save(org);
  }

  async getOrganization(id: string) {
    const org = await this.orgRepo.findOne({
      where: { id },
      relations: ['positions', 'structureNodes'],
    });
    if (!org) throw new NotFoundException('Organization not found');
    return org;
  }

  async getUserOrganizations(userId: string) {
    // Use jsonb contains to find orgs where user is admin
    return this.orgRepo
      .createQueryBuilder('org')
      .where("org.adminIds @> :userId", { userId: JSON.stringify([userId]) })
      .getMany();
  }

  async updateOrganization(userId: string, orgId: string, data: Partial<OrganizationEntity>) {
    const org = await this.orgRepo.findOne({ where: { id: orgId } });
    if (!org) throw new NotFoundException('Organization not found');
    if (!org.adminIds.includes(userId)) {
      throw new ForbiddenException('Only organization admins can update');
    }
    Object.assign(org, data);
    return this.orgRepo.save(org);
  }

  async searchOrganizations(query: string) {
    return this.orgRepo
      .createQueryBuilder('org')
      .where('LOWER(org.formalName) LIKE LOWER(:q)', { q: `%${query}%` })
      .orWhere('LOWER(org.commercialName) LIKE LOWER(:q)', { q: `%${query}%` })
      .orWhere('LOWER(org.searchName) LIKE LOWER(:q)', { q: `%${query}%` })
      .orWhere('org.idCode = :code', { code: query })
      .take(20)
      .getMany();
  }

  // ═══════════════════════════════════════
  // POSITIONS (Virtual Characters)
  // ═══════════════════════════════════════

  async createPosition(userId: string, orgId: string, data: Partial<PositionEntity>) {
    const org = await this.orgRepo.findOne({ where: { id: orgId } });
    if (!org) throw new NotFoundException('Organization not found');
    if (!org.adminIds.includes(userId)) {
      throw new ForbiddenException('Only organization admins can create positions');
    }

    const idCode = this.generatePosIdCode();
    const position = this.positionRepo.create({
      ...data,
      idCode,
      organizationId: orgId,
      linkStatus: 'vacant',
      status: 'active',
    });
    return this.positionRepo.save(position);
  }

  async getPosition(id: string) {
    const position = await this.positionRepo.findOne({
      where: { id },
      relations: ['organization'],
    });
    if (!position) throw new NotFoundException('Position not found');
    return position;
  }

  async getOrgPositions(orgId: string) {
    return this.positionRepo.find({
      where: { organizationId: orgId },
      order: { createdAt: 'ASC' },
    });
  }

  async getUserPositions(userId: string) {
    return this.positionRepo.find({
      where: { linkedNaturalId: userId, linkStatus: 'active' },
      relations: ['organization'],
    });
  }

  async getPendingPositionLinks(userId: string) {
    return this.positionRepo.find({
      where: { linkedNaturalId: userId, linkStatus: 'pending' },
      relations: ['organization'],
    });
  }

  async linkPositionToPerson(userId: string, positionId: string, personId: string) {
    const position = await this.positionRepo.findOne({ where: { id: positionId } });
    if (!position) throw new NotFoundException('Position not found');

    const org = await this.orgRepo.findOne({ where: { id: position.organizationId } });
    if (!org || !org.adminIds.includes(userId)) {
      throw new ForbiddenException('Only organization admins can link positions');
    }

    if (position.linkStatus === 'active') {
      throw new ForbiddenException('Position is already linked to someone');
    }

    position.linkedNaturalId = personId;
    position.linkStatus = 'pending';
    return this.positionRepo.save(position);
  }

  async acceptPositionLink(userId: string, positionId: string) {
    const position = await this.positionRepo.findOne({ where: { id: positionId } });
    if (!position) throw new NotFoundException('Position not found');
    if (position.linkedNaturalId !== userId) {
      throw new ForbiddenException('This link request is not for you');
    }
    if (position.linkStatus !== 'pending') {
      throw new ForbiddenException('No pending link request');
    }

    position.linkStatus = 'active';
    position.linkedAt = new Date();
    return this.positionRepo.save(position);
  }

  async declinePositionLink(userId: string, positionId: string) {
    const position = await this.positionRepo.findOne({ where: { id: positionId } });
    if (!position) throw new NotFoundException('Position not found');
    if (position.linkedNaturalId !== userId) {
      throw new ForbiddenException('This link request is not for you');
    }

    position.linkedNaturalId = null as any;
    position.linkStatus = 'vacant';
    return this.positionRepo.save(position);
  }

  async unlinkPosition(userId: string, positionId: string) {
    const position = await this.positionRepo.findOne({ where: { id: positionId } });
    if (!position) throw new NotFoundException('Position not found');

    // Admin or the linked person can request unlink
    const org = await this.orgRepo.findOne({ where: { id: position.organizationId } });
    const isAdmin = org && org.adminIds.includes(userId);
    const isLinkedPerson = position.linkedNaturalId === userId;

    if (!isAdmin && !isLinkedPerson) {
      throw new ForbiddenException('Not authorized to unlink');
    }

    position.linkStatus = 'unlinked';
    position.unlinkedAt = new Date();
    return this.positionRepo.save(position);
  }

  async updatePosition(userId: string, positionId: string, data: Partial<PositionEntity>) {
    const position = await this.positionRepo.findOne({ where: { id: positionId } });
    if (!position) throw new NotFoundException('Position not found');

    const org = await this.orgRepo.findOne({ where: { id: position.organizationId } });
    if (!org || !org.adminIds.includes(userId)) {
      throw new ForbiddenException('Only organization admins can update positions');
    }

    Object.assign(position, data);
    return this.positionRepo.save(position);
  }

  // ═══════════════════════════════════════
  // STRUCTURE NODES
  // ═══════════════════════════════════════

  async createStructureNode(userId: string, orgId: string, data: Partial<OrgStructureNodeEntity>) {
    const org = await this.orgRepo.findOne({ where: { id: orgId } });
    if (!org) throw new NotFoundException('Organization not found');
    if (!org.adminIds.includes(userId)) {
      throw new ForbiddenException('Only admins can manage structure');
    }

    const node = this.structureNodeRepo.create({
      ...data,
      organizationId: orgId,
    });
    return this.structureNodeRepo.save(node);
  }

  async getOrgStructure(orgId: string, structureType?: string) {
    const where: any = { organizationId: orgId };
    if (structureType) where.structureType = structureType;

    return this.structureNodeRepo.find({
      where,
      order: { structureType: 'ASC', level: 'ASC', sortOrder: 'ASC' },
    });
  }

  async updateStructureNode(userId: string, nodeId: string, data: Partial<OrgStructureNodeEntity>) {
    const node = await this.structureNodeRepo.findOne({ where: { id: nodeId } });
    if (!node) throw new NotFoundException('Structure node not found');

    const org = await this.orgRepo.findOne({ where: { id: node.organizationId } });
    if (!org || !org.adminIds.includes(userId)) {
      throw new ForbiddenException('Only admins can manage structure');
    }

    Object.assign(node, data);
    return this.structureNodeRepo.save(node);
  }

  async deleteStructureNode(userId: string, nodeId: string) {
    const node = await this.structureNodeRepo.findOne({ where: { id: nodeId } });
    if (!node) throw new NotFoundException('Structure node not found');

    const org = await this.orgRepo.findOne({ where: { id: node.organizationId } });
    if (!org || !org.adminIds.includes(userId)) {
      throw new ForbiddenException('Only admins can manage structure');
    }

    await this.structureNodeRepo.remove(node);
  }

  // ═══════════════════════════════════════
  // USER PROFILE
  // ═══════════════════════════════════════

  async getProfile(userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    const { passwordHash, refreshToken, ...profile } = user;
    return profile;
  }

  async getPublicProfile(targetId: string) {
    const user = await this.userRepo.findOne({ where: { id: targetId } });
    if (!user) throw new NotFoundException('User not found');
    // Return based on privacy settings
    return this.filterProfileByPrivacy(user);
  }

  async updateProfile(userId: string, data: Partial<UserEntity>) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    // Don't allow updating sensitive fields
    delete (data as any).id;
    delete (data as any).idCode;
    delete (data as any).passwordHash;
    delete (data as any).refreshToken;
    delete (data as any).phoneNumber;
    delete (data as any).email;

    Object.assign(user, data);
    if (data.firstName || data.lastName) {
      user.fullName = `${user.firstName} ${user.lastName}`.trim();
    }
    return this.userRepo.save(user);
  }

  async searchUsers(query: string) {
    return this.userRepo
      .createQueryBuilder('u')
      .select(['u.id', 'u.idCode', 'u.firstName', 'u.lastName', 'u.fullName', 'u.profilePhotoUrl'])
      .where('LOWER(u.fullName) LIKE LOWER(:q)', { q: `%${query}%` })
      .orWhere('LOWER(u.firstName) LIKE LOWER(:q)', { q: `%${query}%` })
      .orWhere('LOWER(u.lastName) LIKE LOWER(:q)', { q: `%${query}%` })
      .orWhere('u.idCode = :code', { code: query })
      .orWhere('u.phoneNumber = :phone', { phone: query })
      .take(20)
      .getMany();
  }

  // ═══════════════════════════════════════
  // HELPERS
  // ═══════════════════════════════════════

  private filterProfileByPrivacy(user: UserEntity) {
    const result: any = {
      id: user.id,
      idCode: user.idCode,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      profilePhotoUrl: user.profilePhotoUrl,
    };

    if (user.privacyPersonalInfo === 'public') {
      result.gender = user.gender;
      result.dateOfBirth = user.dateOfBirth;
      result.nationality1 = user.nationality1;
      result.residenceCountry = user.residenceCountry;
      result.city = user.city;
    }

    if (user.privacyContactInfo === 'public') {
      result.phoneNumber = user.phoneNumber;
      result.email = user.email;
      result.linkedIn = user.linkedIn;
    }

    if (user.privacyEducation === 'public') {
      result.university = user.university;
      result.specialtiesAndSkills = user.specialtiesAndSkills;
    }

    if (user.privacyCareer === 'public') {
      result.profession = user.profession;
      result.title = user.title;
      result.industry = user.industry;
    }

    return result;
  }

  private generateOrgIdCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `IDG-ORG-${code}`;
  }

  private generatePosIdCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `IDG-POS-${code}`;
  }
}
