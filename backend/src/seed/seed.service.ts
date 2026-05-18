import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../auth/entities/user.entity';
import { OrganizationEntity } from '../entities/entities/organization.entity';
import { PositionEntity } from '../entities/entities/position.entity';
import { OrgStructureNodeEntity } from '../entities/entities/org-structure-node.entity';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    @InjectRepository(OrganizationEntity) private orgRepo: Repository<OrganizationEntity>,
    @InjectRepository(PositionEntity) private posRepo: Repository<PositionEntity>,
    @InjectRepository(OrgStructureNodeEntity) private nodeRepo: Repository<OrgStructureNodeEntity>,
  ) {}

  async seed() {
    const existingUser = await this.userRepo.findOne({ where: { phoneNumber: '+201001234567' } });
    if (existingUser) return { message: 'Already seeded' };

    const passwordHash = await bcrypt.hash('Password123!', 12);

    // Create demo user
    const user = await this.userRepo.save(this.userRepo.create({
      phoneNumber: '+201001234567',
      email: 'demo@idgate.app',
      firstName: 'Ahmed',
      lastName: 'Mohamed',
      fullName: 'Ahmed Mohamed',
      gender: 'male',
      dateOfBirth: '1990-01-15',
      nationality1: 'Egyptian',
      residenceCountry: 'Egypt',
      city: 'Cairo',
      idCode: 'IDG-NAT-00000001',
      passwordHash,
      accountType: 'personal',
      status: 'active',
      isPhoneVerified: true,
      isEmailVerified: true,
    }));

    // Create demo organization
    const org = await this.orgRepo.save(this.orgRepo.create({
      idCode: 'IDG-ORG-00000001',
      formalName: 'IDGate Demo Corp',
      commercialName: 'IDGate',
      searchName: 'idgate demo',
      orgLevel: 'individual',
      orgType: 'private',
      legalEntityType: 'llc',
      countryOfRegistration: 'Egypt',
      cityOfRegistration: 'Cairo',
      mainIndustry: 'Technology',
      email: 'info@idgate.app',
      website: 'https://idgate.app',
      phoneNumber: '+20221234567',
      adminIds: [user.id],
      ceoUserId: user.id,
      status: 'active',
    }));

    // Create a position
    const position = await this.posRepo.save(this.posRepo.create({
      idCode: 'IDG-POS-00000001',
      positionName: 'CEO',
      positionDescription: 'Chief Executive Officer',
      organizationId: org.id,
      linkedNaturalId: user.id,
      linkStatus: 'active',
      linkedAt: new Date(),
    }));

    // Create org structure node
    await this.nodeRepo.save(this.nodeRepo.create({
      organizationId: org.id,
      structureType: 'organizational',
      name: 'Executive Management',
      level: 1,
      code: 'EXEC',
      positionIds: [position.id],
    }));

    return { message: 'Seeded successfully', userId: user.id, orgId: org.id };
  }
}
