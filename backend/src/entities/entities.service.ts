import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrganizationEntity } from './entities/organization.entity';
import { PositionEntity } from './entities/position.entity';
import { OrgLevelEntity } from './entities/org-level.entity';
import { UserEntity } from '../auth/entities/user.entity';

@Injectable()
export class EntitiesService {
  constructor(
    @InjectRepository(OrganizationEntity)
    private orgRepo: Repository<OrganizationEntity>,
    @InjectRepository(PositionEntity)
    private positionRepo: Repository<PositionEntity>,
    @InjectRepository(OrgLevelEntity)
    private orgLevelRepo: Repository<OrgLevelEntity>,
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
  ) {}

  // --- Organizations ---

  async createOrganization(userId: string, data: Partial<OrganizationEntity>) {
    const idCode = this.generateIdCode();
    const org = this.orgRepo.create({
      ...data,
      idCode,
      adminIds: [userId],
      status: 'active',
    });
    return this.orgRepo.save(org);
  }

  async getOrganization(id: string) {
    const org = await this.orgRepo.findOne({
      where: { id },
      relations: ['positions', 'orgLevels'],
    });
    if (!org) throw new NotFoundException('Organization not found');
    return org;
  }

  async getUserOrganizations(userId: string) {
    // adminIds is simple-array (comma-separated text), use LIKE
    const orgs = await this.orgRepo
      .createQueryBuilder('org')
      .where('org.adminIds LIKE :userId', { userId: `%${userId}%` })
      .getMany();
    return orgs;
  }

  // --- Positions ---

  async createPosition(userId: string, orgId: string, data: Partial<PositionEntity>) {
    const org = await this.orgRepo.findOne({ where: { id: orgId } });
    if (!org) throw new NotFoundException('Organization not found');
    if (!org.adminIds.includes(userId)) {
      throw new ForbiddenException('Only organization admins can create positions');
    }

    const idCode = this.generateIdCode();
    const position = this.positionRepo.create({
      ...data,
      idCode,
      organizationId: orgId,
      linkStatus: 'inactive',
      status: 'active',
    });
    return this.positionRepo.save(position);
  }

  async linkPositionToPerson(userId: string, positionId: string, personId: string) {
    const position = await this.positionRepo.findOne({ where: { id: positionId } });
    if (!position) throw new NotFoundException('Position not found');

    // Verify the requester is an org admin
    const org = await this.orgRepo.findOne({ where: { id: position.organizationId } });
    if (!org || !org.adminIds.includes(userId)) {
      throw new ForbiddenException('Only organization admins can link positions');
    }

    // Set link status to pending (person needs to accept)
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

    position.linkStatus = 'active';
    position.linkedAt = new Date();
    return this.positionRepo.save(position);
  }

  async unlinkPosition(userId: string, positionId: string) {
    const position = await this.positionRepo.findOne({ where: { id: positionId } });
    if (!position) throw new NotFoundException('Position not found');

    // Only org admin can unlink (as per your business rules)
    const org = await this.orgRepo.findOne({ where: { id: position.organizationId } });
    if (!org || !org.adminIds.includes(userId)) {
      throw new ForbiddenException('Only the organization admin can unlink positions');
    }

    position.linkStatus = 'unlinked';
    position.unlinkedAt = new Date();
    // Note: linkedNaturalId is preserved for audit trail
    return this.positionRepo.save(position);
  }

  async getUserPositions(userId: string) {
    return this.positionRepo.find({
      where: { linkedNaturalId: userId, linkStatus: 'active' },
      relations: ['organization'],
    });
  }

  // --- Org Structure ---

  async getOrgStructure(orgId: string) {
    return this.orgLevelRepo.find({
      where: { organizationId: orgId },
      order: { level: 'ASC', code: 'ASC' },
    });
  }

  // --- Utility ---

  private generateIdCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 10; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `IDG-${code}`;
  }
}
