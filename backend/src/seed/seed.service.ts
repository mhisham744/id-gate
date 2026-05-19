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
    const existingOrg = await this.orgRepo.findOne({ where: { idCode: 'IDG-ORG-GEZIRA01' } });
    if (existingOrg) return { message: 'Already seeded' };

    const passwordHash = await bcrypt.hash('Password123!', 12);

    // ═══════════════════════════════════════
    // USERS (Natural Characters)
    // ═══════════════════════════════════════
    const users = await this.userRepo.save([
      this.userRepo.create({
        phoneNumber: '+201001234567',
        email: 'ahmed.mohamed@idgate.app',
        firstName: 'Ahmed',
        lastName: 'Mohamed',
        fullName: 'Ahmed Mohamed',
        gender: 'male',
        dateOfBirth: '1975-03-20',
        nationality1: 'Egyptian',
        residenceCountry: 'Egypt',
        city: 'Cairo',
        address1: '15 Zamalek Street, Zamalek',
        idCode: 'IDG-NAT-00000001',
        passwordHash,
        accountType: 'organization',
        status: 'active',
        isPhoneVerified: true,
        isEmailVerified: true,
        motherTongue: 'Arabic',
        language1: 'English:Fluent',
        language2: 'French:Intermediate',
        profession: 'Executive Management',
        title: 'Chairman',
        industry: 'Sports & Recreation',
        university: 'Cairo University - Business Administration',
        privacyPersonalInfo: 'contacts',
        privacyContactInfo: 'contacts',
        privacyEducation: 'public',
        privacyCareer: 'public',
      }),
      this.userRepo.create({
        phoneNumber: '+201002345678',
        email: 'hassan.ali@idgate.app',
        firstName: 'Hassan',
        lastName: 'Ali',
        fullName: 'Hassan Ali',
        gender: 'male',
        dateOfBirth: '1980-07-10',
        nationality1: 'Egyptian',
        residenceCountry: 'Egypt',
        city: 'Cairo',
        idCode: 'IDG-NAT-00000002',
        passwordHash,
        accountType: 'organization',
        status: 'active',
        isPhoneVerified: true,
        isEmailVerified: true,
        motherTongue: 'Arabic',
        language1: 'English:Fluent',
        profession: 'Finance',
        title: 'CFO',
        industry: 'Manufacturing',
        university: 'American University in Cairo - Finance',
      }),
      this.userRepo.create({
        phoneNumber: '+201003456789',
        email: 'mona.ibrahim@idgate.app',
        firstName: 'Mona',
        lastName: 'Ibrahim',
        fullName: 'Mona Ibrahim',
        gender: 'female',
        dateOfBirth: '1985-11-25',
        nationality1: 'Egyptian',
        residenceCountry: 'Egypt',
        city: 'Cairo',
        idCode: 'IDG-NAT-00000003',
        passwordHash,
        accountType: 'personal',
        status: 'active',
        isPhoneVerified: true,
        isEmailVerified: true,
        motherTongue: 'Arabic',
        language1: 'English:Fluent',
        language2: 'German:Intermediate',
        profession: 'Education',
        title: 'University Dean',
        university: 'Ain Shams University - PhD Education',
        phd: 'PhD in Educational Leadership - London University',
      }),
      this.userRepo.create({
        phoneNumber: '+201004567890',
        email: 'khaled.omar@idgate.app',
        firstName: 'Khaled',
        lastName: 'Omar',
        fullName: 'Khaled Omar',
        gender: 'male',
        dateOfBirth: '1978-05-05',
        nationality1: 'Egyptian',
        nationality2: 'British',
        residenceCountry: 'Egypt',
        city: 'New Cairo',
        idCode: 'IDG-NAT-00000004',
        passwordHash,
        accountType: 'organization',
        status: 'active',
        isPhoneVerified: true,
        isEmailVerified: true,
        motherTongue: 'Arabic',
        language1: 'English:Native',
        profession: 'Tourism & Hospitality',
        title: 'CEO',
        industry: 'Tourism',
        university: 'Cornell University - Hotel Administration',
      }),
      this.userRepo.create({
        phoneNumber: '+201005678901',
        email: 'tarek.saad@idgate.app',
        firstName: 'Tarek',
        lastName: 'Saad',
        fullName: 'Tarek Saad',
        gender: 'male',
        dateOfBirth: '1970-01-15',
        nationality1: 'Egyptian',
        residenceCountry: 'Egypt',
        city: 'Cairo',
        idCode: 'IDG-NAT-00000005',
        passwordHash,
        accountType: 'organization',
        status: 'active',
        isPhoneVerified: true,
        isEmailVerified: true,
        motherTongue: 'Arabic',
        language1: 'English:Fluent',
        profession: 'Industrial Engineering',
        title: 'Managing Director',
        industry: 'Manufacturing',
        university: 'Cairo University - Engineering',
      }),
    ]);

    const [ahmed, hassan, mona, khaled, tarek] = users;

    // ═══════════════════════════════════════
    // ORGANIZATION 1: Gezira Sporting Club
    // Type: Sports Club (نادى رياضى)
    // ═══════════════════════════════════════
    const gezira = await this.orgRepo.save(this.orgRepo.create({
      idCode: 'IDG-ORG-GEZIRA01',
      formalName: 'Gezira Sporting Club',
      commercialName: 'Gezira Club',
      searchName: 'gezira sporting club nadi',
      name1: 'نادى الجزيرة الرياضى',
      orgLevel: 'individual',
      orgType: 'Sports Club',
      legalEntityType: 'Joint Stock Company',
      dateOfOperation: '1882-01-01',
      mainIndustry: 'Sports & Recreation',
      subsidiaryIndustries: ['Swimming', 'Tennis', 'Football', 'Basketball', 'Equestrian'],
      countryOfRegistration: 'Egypt',
      cityOfRegistration: 'Cairo',
      registrationAddress: 'Zamalek, Cairo',
      headquarterAddress: 'Gezira Island, Zamalek, Cairo, Egypt',
      operationAddress: 'Gezira Island, Zamalek',
      operationCountry: 'Egypt',
      operationLanguage: 'Arabic',
      secondLanguage: 'English',
      timeZone: 'Africa/Cairo',
      email: 'info@geziraclub.com',
      website: 'https://geziraclub.com',
      phoneNumber: '+20227351000',
      mobileNumber: '+201200000001',
      adminIds: [ahmed.id],
      ceoUserId: ahmed.id,
      status: 'active',
      privacyCorporateInfo: 'public',
      privacyContactInfo: 'public',
      privacyFieldOfOperation: 'public',
      privacyStructureInfo: 'contacts',
    }));

    // Gezira Positions
    const geziraPositions = await this.posRepo.save([
      this.posRepo.create({
        idCode: 'IDG-POS-GEZ00001',
        positionName: 'Chairman of the Board',
        positionName1: 'رئيس مجلس الإدارة',
        positionDescription: 'Chairman and President of Gezira Sporting Club',
        organizationId: gezira.id,
        linkedNaturalId: ahmed.id,
        linkStatus: 'active',
        linkedAt: new Date(),
        emailAddress: 'chairman@geziraclub.com',
        telephoneNumber: '+20227351001',
        canDelegateOthers: true,
        delegationSubjects: ['Full Authority', 'Financial Approvals', 'Membership Approvals', 'Staff Hiring'],
        positionProfile: ['admin', 'finance', 'hr', 'operations', 'membership'],
      }),
      this.posRepo.create({
        idCode: 'IDG-POS-GEZ00002',
        positionName: 'General Manager',
        positionName1: 'المدير العام',
        positionDescription: 'General Manager responsible for daily operations',
        organizationId: gezira.id,
        linkStatus: 'vacant',
        emailAddress: 'gm@geziraclub.com',
        telephoneNumber: '+20227351002',
        canDelegateOthers: true,
        delegationSubjects: ['Operational Approvals', 'Staff Management', 'Event Management'],
        positionProfile: ['operations', 'hr', 'events'],
      }),
      this.posRepo.create({
        idCode: 'IDG-POS-GEZ00003',
        positionName: 'Football Department Director',
        positionName1: 'مدير إدارة كرة القدم',
        positionDescription: 'Director of Football Operations and Teams',
        organizationId: gezira.id,
        linkStatus: 'vacant',
        emailAddress: 'football@geziraclub.com',
        positionProfile: ['football_ops', 'coaching', 'events'],
      }),
      this.posRepo.create({
        idCode: 'IDG-POS-GEZ00004',
        positionName: 'Finance Director',
        positionName1: 'المدير المالى',
        positionDescription: 'Head of Finance and Accounting',
        organizationId: gezira.id,
        linkedNaturalId: hassan.id,
        linkStatus: 'active',
        linkedAt: new Date(),
        emailAddress: 'finance@geziraclub.com',
        positionProfile: ['finance', 'accounting', 'budgeting'],
        delegationSubjects: ['Payment Approvals', 'Budget Allocation'],
        delegationLimits: [{ subject: 'Payment Approvals', limit: 500000, currency: 'EGP' }],
      }),
      this.posRepo.create({
        idCode: 'IDG-POS-GEZ00005',
        positionName: 'Membership Manager',
        positionName1: 'مدير العضويات',
        organizationId: gezira.id,
        linkStatus: 'vacant',
        positionProfile: ['membership', 'crm'],
      }),
    ]);

    // Gezira Structure - Organizational (Shareholders/Board)
    const gezOrgL1Members = await this.nodeRepo.save(this.nodeRepo.create({
      organizationId: gezira.id, structureType: 'organizational', name: 'Members', description: 'Club Members (الأعضاء)', level: 1, code: 'GEZ-ORG-MEM', sortOrder: 1, positionIds: [],
    }));
    const gezOrgL1Staff = await this.nodeRepo.save(this.nodeRepo.create({
      organizationId: gezira.id, structureType: 'organizational', name: 'Staff', description: 'Club Employees (العاملين)', level: 1, code: 'GEZ-ORG-STF', sortOrder: 2, positionIds: [],
    }));
    await this.nodeRepo.save([
      this.nodeRepo.create({ organizationId: gezira.id, structureType: 'organizational', name: 'Working Members', description: 'أعضاء العاملين', level: 2, code: 'GEZ-ORG-MEM-WRK', sortOrder: 1, positionIds: [], parent: gezOrgL1Members }),
      this.nodeRepo.create({ organizationId: gezira.id, structureType: 'organizational', name: 'Dependent Members', description: 'أعضاء تابعين', level: 2, code: 'GEZ-ORG-MEM-DEP', sortOrder: 2, positionIds: [], parent: gezOrgL1Members }),
      this.nodeRepo.create({ organizationId: gezira.id, structureType: 'organizational', name: 'Affiliated Members', description: 'أعضاء منتسبين', level: 2, code: 'GEZ-ORG-MEM-AFF', sortOrder: 3, positionIds: [], parent: gezOrgL1Members }),
      this.nodeRepo.create({ organizationId: gezira.id, structureType: 'organizational', name: 'Sports Membership', description: 'عضوية رياضية', level: 2, code: 'GEZ-ORG-MEM-SPT', sortOrder: 4, positionIds: [], parent: gezOrgL1Members }),
    ]);

    // Gezira Structure - Management (HQ/Regions)
    const gezMgmtHQ = await this.nodeRepo.save(this.nodeRepo.create({
      organizationId: gezira.id, structureType: 'management', name: 'Headquarters', description: 'Main Club Complex', level: 1, code: 'GEZ-MGT-HQ', sortOrder: 1, positionIds: [geziraPositions[0].id, geziraPositions[1].id],
    }));
    await this.nodeRepo.save(this.nodeRepo.create({
      organizationId: gezira.id, structureType: 'management', name: 'Football Department', description: 'إدارة كرة القدم', level: 1, code: 'GEZ-MGT-FBL', sortOrder: 2, positionIds: [geziraPositions[2].id],
    }));

    // Gezira Structure - Function (Departments)
    const gezFnFinance = await this.nodeRepo.save(this.nodeRepo.create({
      organizationId: gezira.id, structureType: 'function', name: 'Finance Department', description: 'الإدارة المالية', level: 1, code: 'GEZ-FUN-FIN', sortOrder: 1, positionIds: [geziraPositions[3].id],
    }));
    await this.nodeRepo.save([
      this.nodeRepo.create({ organizationId: gezira.id, structureType: 'function', name: 'General Accounts', description: 'قسم الحسابات العامة', level: 2, code: 'GEZ-FUN-FIN-GA', sortOrder: 1, positionIds: [], parent: gezFnFinance }),
      this.nodeRepo.create({ organizationId: gezira.id, structureType: 'function', name: 'Vendor Accounts', description: 'قسم حسابات الموردين', level: 2, code: 'GEZ-FUN-FIN-VA', sortOrder: 2, positionIds: [], parent: gezFnFinance }),
    ]);
    await this.nodeRepo.save(this.nodeRepo.create({
      organizationId: gezira.id, structureType: 'function', name: 'Membership Department', description: 'إدارة العضويات', level: 1, code: 'GEZ-FUN-MBR', sortOrder: 2, positionIds: [geziraPositions[4].id],
    }));

    // Gezira Structure - Geographical
    const gezGeoEgypt = await this.nodeRepo.save(this.nodeRepo.create({
      organizationId: gezira.id, structureType: 'geographical', name: 'Egypt', description: 'مصر', level: 1, code: 'GEZ-GEO-EG', sortOrder: 1, positionIds: [],
    }));
    const gezGeoCairo = await this.nodeRepo.save(this.nodeRepo.create({
      organizationId: gezira.id, structureType: 'geographical', name: 'Cairo', description: 'القاهرة', level: 2, code: 'GEZ-GEO-EG-CAI', sortOrder: 1, positionIds: [], parent: gezGeoEgypt,
    }));
    await this.nodeRepo.save(this.nodeRepo.create({
      organizationId: gezira.id, structureType: 'geographical', name: 'Gezira Island', description: 'الجزيرة', level: 3, code: 'GEZ-GEO-EG-CAI-GEZ', sortOrder: 1, positionIds: [], parent: gezGeoCairo,
    }));

    // ═══════════════════════════════════════
    // ORGANIZATION 2: Al Ahly Sporting Club
    // Type: Sports Club
    // ═══════════════════════════════════════
    const alAhly = await this.orgRepo.save(this.orgRepo.create({
      idCode: 'IDG-ORG-ALAHLY01',
      formalName: 'Al Ahly Sporting Club',
      commercialName: 'Al Ahly',
      searchName: 'al ahly club',
      name1: 'النادى الأهلى',
      orgLevel: 'individual',
      orgType: 'Sports Club',
      legalEntityType: 'Joint Stock Company',
      dateOfOperation: '1907-04-24',
      mainIndustry: 'Sports & Recreation',
      subsidiaryIndustries: ['Football', 'Basketball', 'Volleyball', 'Swimming', 'Handball'],
      countryOfRegistration: 'Egypt',
      cityOfRegistration: 'Cairo',
      headquarterAddress: 'Gezira, Cairo, Egypt',
      operationCountry: 'Egypt',
      operationLanguage: 'Arabic',
      email: 'info@alahly.com',
      website: 'https://alahly.com',
      phoneNumber: '+20227940000',
      adminIds: [ahmed.id],
      status: 'active',
    }));

    // ═══════════════════════════════════════
    // ORGANIZATION 3: Cairo University
    // Type: University (مدرسة / جامعة)
    // ═══════════════════════════════════════
    const cairoUni = await this.orgRepo.save(this.orgRepo.create({
      idCode: 'IDG-ORG-CAIROU01',
      formalName: 'Cairo University',
      commercialName: 'Cairo University',
      searchName: 'cairo university giza',
      name1: 'جامعة القاهرة',
      orgLevel: 'individual',
      orgType: 'University',
      legalEntityType: 'Government Entity',
      dateOfOperation: '1908-12-21',
      mainIndustry: 'Education',
      subsidiaryIndustries: ['Research', 'Higher Education', 'Medical', 'Engineering'],
      countryOfRegistration: 'Egypt',
      cityOfRegistration: 'Giza',
      headquarterAddress: 'Gamaa Street, Giza, Egypt',
      operationAddress: 'Gamaa Street, Giza',
      operationCountry: 'Egypt',
      operationLanguage: 'Arabic',
      secondLanguage: 'English',
      timeZone: 'Africa/Cairo',
      email: 'info@cu.edu.eg',
      website: 'https://cu.edu.eg',
      phoneNumber: '+20235676105',
      adminIds: [mona.id],
      ceoUserId: mona.id,
      status: 'active',
    }));

    // Cairo University Positions
    await this.posRepo.save([
      this.posRepo.create({
        idCode: 'IDG-POS-CU000001',
        positionName: 'University President',
        positionName1: 'رئيس الجامعة',
        organizationId: cairoUni.id,
        linkedNaturalId: mona.id,
        linkStatus: 'active',
        linkedAt: new Date(),
        positionProfile: ['admin', 'academic', 'finance', 'hr'],
        canDelegateOthers: true,
        delegationSubjects: ['Academic Appointments', 'Budget Approval', 'Research Grants'],
      }),
      this.posRepo.create({
        idCode: 'IDG-POS-CU000002',
        positionName: 'Dean of Engineering',
        positionName1: 'عميد كلية الهندسة',
        organizationId: cairoUni.id,
        linkStatus: 'vacant',
        positionProfile: ['academic', 'faculty_management'],
      }),
      this.posRepo.create({
        idCode: 'IDG-POS-CU000003',
        positionName: 'Dean of Medicine',
        positionName1: 'عميد كلية الطب',
        organizationId: cairoUni.id,
        linkStatus: 'vacant',
        positionProfile: ['academic', 'medical', 'research'],
      }),
    ]);

    // Cairo Uni Structure - Organizational
    await this.nodeRepo.save([
      this.nodeRepo.create({ organizationId: cairoUni.id, structureType: 'organizational', name: 'Faculty', description: 'أساتذة', level: 1, code: 'CU-ORG-FAC', sortOrder: 1, positionIds: [] }),
      this.nodeRepo.create({ organizationId: cairoUni.id, structureType: 'organizational', name: 'Students', description: 'طلبة', level: 1, code: 'CU-ORG-STD', sortOrder: 2, positionIds: [] }),
    ]);

    // Cairo Uni Structure - Function (Faculties)
    await this.nodeRepo.save([
      this.nodeRepo.create({ organizationId: cairoUni.id, structureType: 'function', name: 'Faculty of Engineering', description: 'كلية الهندسة', level: 1, code: 'CU-FUN-ENG', sortOrder: 1, positionIds: [] }),
      this.nodeRepo.create({ organizationId: cairoUni.id, structureType: 'function', name: 'Faculty of Medicine', description: 'كلية الطب', level: 1, code: 'CU-FUN-MED', sortOrder: 2, positionIds: [] }),
      this.nodeRepo.create({ organizationId: cairoUni.id, structureType: 'function', name: 'Faculty of Commerce', description: 'كلية التجارة', level: 1, code: 'CU-FUN-COM', sortOrder: 3, positionIds: [] }),
      this.nodeRepo.create({ organizationId: cairoUni.id, structureType: 'function', name: 'Faculty of Law', description: 'كلية الحقوق', level: 1, code: 'CU-FUN-LAW', sortOrder: 4, positionIds: [] }),
    ]);

    // ═══════════════════════════════════════
    // ORGANIZATION 4: Marassi Resort (Residential/Tourism)
    // Type: Residential Community (مجتمع سكنى / قرية سياحية)
    // ═══════════════════════════════════════
    const marassi = await this.orgRepo.save(this.orgRepo.create({
      idCode: 'IDG-ORG-MARASI01',
      formalName: 'Emaar Misr for Development S.A.E.',
      commercialName: 'Marassi',
      searchName: 'marassi emaar north coast',
      name1: 'مراسى',
      orgLevel: 'branch',
      orgType: 'Real Estate Development',
      legalEntityType: 'Joint Stock Company',
      mainIndustry: 'Real Estate',
      subsidiaryIndustries: ['Tourism', 'Hospitality', 'Property Management'],
      brands: ['Marassi', 'Emaar Misr'],
      countryOfRegistration: 'Egypt',
      cityOfRegistration: 'Cairo',
      headquarterAddress: 'Building 2, Emaar Square, New Cairo',
      operationAddress: 'Sidi Abdel Rahman, North Coast',
      operationCountry: 'Egypt',
      email: 'info@marassi.com',
      website: 'https://marassi.com',
      phoneNumber: '+20216112',
      adminIds: [khaled.id],
      ceoUserId: khaled.id,
      status: 'active',
    }));

    // Marassi Positions
    await this.posRepo.save([
      this.posRepo.create({
        idCode: 'IDG-POS-MAR00001',
        positionName: 'Resort General Manager',
        positionName1: 'المدير العام للمنتجع',
        organizationId: marassi.id,
        linkedNaturalId: khaled.id,
        linkStatus: 'active',
        linkedAt: new Date(),
        positionProfile: ['admin', 'operations', 'finance'],
        canDelegateOthers: true,
      }),
      this.posRepo.create({
        idCode: 'IDG-POS-MAR00002',
        positionName: 'Facilities Manager',
        positionName1: 'مدير المرافق',
        organizationId: marassi.id,
        linkStatus: 'vacant',
        positionProfile: ['facilities', 'maintenance'],
      }),
    ]);

    // Marassi Structure - Geographical
    const marassiEgypt = await this.nodeRepo.save(this.nodeRepo.create({
      organizationId: marassi.id, structureType: 'geographical', name: 'Egypt', level: 1, code: 'MAR-GEO-EG', sortOrder: 1, positionIds: [],
    }));
    await this.nodeRepo.save([
      this.nodeRepo.create({ organizationId: marassi.id, structureType: 'geographical', name: 'North Coast', description: 'الساحل الشمالى', level: 2, code: 'MAR-GEO-NC', sortOrder: 1, positionIds: [], parent: marassiEgypt }),
      this.nodeRepo.create({ organizationId: marassi.id, structureType: 'geographical', name: 'New Cairo Office', level: 2, code: 'MAR-GEO-NCR', sortOrder: 2, positionIds: [], parent: marassiEgypt }),
    ]);

    // ═══════════════════════════════════════
    // ORGANIZATION 5: Egyptian Steel (Factory)
    // Type: Factory (مصنع)
    // ═══════════════════════════════════════
    const egyptSteel = await this.orgRepo.save(this.orgRepo.create({
      idCode: 'IDG-ORG-ESTEEL01',
      formalName: 'Egyptian Steel Group S.A.E.',
      commercialName: 'Egyptian Steel',
      searchName: 'egyptian steel group',
      name1: 'مجموعة حديد المصريين',
      orgLevel: 'holding',
      orgType: 'Industrial',
      legalEntityType: 'Joint Stock Company',
      mainIndustry: 'Manufacturing',
      subsidiaryIndustries: ['Steel Production', 'Iron Ore Processing', 'Construction Materials'],
      brands: ['Egyptian Steel', 'ES Rebar'],
      products: ['Steel Rebar', 'Wire Rod', 'Billet', 'Structural Steel'],
      countryOfRegistration: 'Egypt',
      cityOfRegistration: 'Cairo',
      headquarterAddress: 'Smart Village, 6th of October City',
      operationAddress: 'Ain Sokhna Industrial Zone',
      operationCountry: 'Egypt',
      operationRegion: 'Suez',
      email: 'info@egyptiansteel.com',
      website: 'https://egyptiansteel.com',
      phoneNumber: '+20238273000',
      adminIds: [tarek.id],
      ceoUserId: tarek.id,
      status: 'active',
    }));

    // Egyptian Steel Positions
    await this.posRepo.save([
      this.posRepo.create({
        idCode: 'IDG-POS-ES000001',
        positionName: 'Managing Director',
        positionName1: 'العضو المنتدب',
        organizationId: egyptSteel.id,
        linkedNaturalId: tarek.id,
        linkStatus: 'active',
        linkedAt: new Date(),
        positionProfile: ['admin', 'finance', 'hr', 'operations', 'production'],
        canDelegateOthers: true,
        delegationSubjects: ['Full Authority', 'Investment Decisions', 'Hiring'],
      }),
      this.posRepo.create({
        idCode: 'IDG-POS-ES000002',
        positionName: 'Plant Director - Ain Sokhna',
        positionName1: 'مدير مصنع العين السخنة',
        organizationId: egyptSteel.id,
        linkStatus: 'vacant',
        positionProfile: ['production', 'quality', 'safety', 'maintenance'],
        delegationSubjects: ['Production Decisions', 'Safety Protocols'],
      }),
      this.posRepo.create({
        idCode: 'IDG-POS-ES000003',
        positionName: 'Head of Quality Control',
        positionName1: 'رئيس مراقبة الجودة',
        organizationId: egyptSteel.id,
        linkStatus: 'vacant',
        positionProfile: ['quality', 'lab', 'standards'],
      }),
    ]);

    // Egyptian Steel Structure - Management
    const esHQ = await this.nodeRepo.save(this.nodeRepo.create({
      organizationId: egyptSteel.id, structureType: 'management', name: 'Headquarters (Smart Village)', level: 1, code: 'ES-MGT-HQ', sortOrder: 1, positionIds: [],
    }));
    const esRegSuez = await this.nodeRepo.save(this.nodeRepo.create({
      organizationId: egyptSteel.id, structureType: 'management', name: 'Suez Region', level: 2, code: 'ES-MGT-SUEZ', sortOrder: 1, positionIds: [], parent: esHQ,
    }));
    await this.nodeRepo.save(this.nodeRepo.create({
      organizationId: egyptSteel.id, structureType: 'management', name: 'Ain Sokhna Plant', level: 3, code: 'ES-MGT-SUEZ-ASP', sortOrder: 1, positionIds: [], parent: esRegSuez,
    }));

    // Egyptian Steel Structure - Function
    const esProd = await this.nodeRepo.save(this.nodeRepo.create({
      organizationId: egyptSteel.id, structureType: 'function', name: 'Production Division', description: 'قطاع الإنتاج', level: 1, code: 'ES-FUN-PROD', sortOrder: 1, positionIds: [],
    }));
    await this.nodeRepo.save([
      this.nodeRepo.create({ organizationId: egyptSteel.id, structureType: 'function', name: 'Steel Melting', description: 'قسم الصهر', level: 2, code: 'ES-FUN-PROD-MLT', sortOrder: 1, positionIds: [], parent: esProd }),
      this.nodeRepo.create({ organizationId: egyptSteel.id, structureType: 'function', name: 'Rolling Mill', description: 'قسم الدرفلة', level: 2, code: 'ES-FUN-PROD-RLL', sortOrder: 2, positionIds: [], parent: esProd }),
    ]);
    await this.nodeRepo.save(this.nodeRepo.create({
      organizationId: egyptSteel.id, structureType: 'function', name: 'Quality Department', description: 'إدارة الجودة', level: 1, code: 'ES-FUN-QA', sortOrder: 2, positionIds: [],
    }));

    // ═══════════════════════════════════════
    // ORGANIZATION 6: Travco Tourism (Travel Company)
    // Type: Tourism Company (شركة سياحية)
    // ═══════════════════════════════════════
    const travco = await this.orgRepo.save(this.orgRepo.create({
      idCode: 'IDG-ORG-TRAVCO01',
      formalName: 'Travco Group for Tourism S.A.E.',
      commercialName: 'Travco',
      searchName: 'travco tourism travel',
      name1: 'مجموعة ترافكو للسياحة',
      orgLevel: 'holding',
      orgType: 'Tourism & Travel',
      legalEntityType: 'Joint Stock Company',
      mainIndustry: 'Tourism',
      subsidiaryIndustries: ['Hotels', 'Travel Agency', 'Nile Cruises', 'Transportation'],
      brands: ['Travco', 'Hilton Hotels Egypt (partner)', 'Travco Tours'],
      countryOfRegistration: 'Egypt',
      cityOfRegistration: 'Cairo',
      headquarterAddress: 'Corniche El Nil, Maadi, Cairo',
      operationCountry: 'Egypt',
      operationLanguage: 'Arabic',
      secondLanguage: 'English',
      email: 'info@travcogroup.com',
      website: 'https://travcogroup.com',
      phoneNumber: '+20225281000',
      adminIds: [khaled.id],
      status: 'active',
    }));

    // Travco Positions
    await this.posRepo.save([
      this.posRepo.create({
        idCode: 'IDG-POS-TRV00001',
        positionName: 'CEO',
        positionName1: 'الرئيس التنفيذى',
        organizationId: travco.id,
        linkedNaturalId: khaled.id,
        linkStatus: 'active',
        linkedAt: new Date(),
        positionProfile: ['admin', 'finance', 'operations', 'sales'],
        canDelegateOthers: true,
      }),
      this.posRepo.create({
        idCode: 'IDG-POS-TRV00002',
        positionName: 'Director of Hotel Operations',
        positionName1: 'مدير عمليات الفنادق',
        organizationId: travco.id,
        linkStatus: 'vacant',
        positionProfile: ['hotel_ops', 'guest_services'],
      }),
    ]);

    // Travco Structure - Management (multi-region)
    const trvHQ = await this.nodeRepo.save(this.nodeRepo.create({
      organizationId: travco.id, structureType: 'management', name: 'Headquarters Cairo', level: 1, code: 'TRV-MGT-HQ', sortOrder: 1, positionIds: [],
    }));
    await this.nodeRepo.save([
      this.nodeRepo.create({ organizationId: travco.id, structureType: 'management', name: 'Red Sea Region', description: 'البحر الأحمر', level: 2, code: 'TRV-MGT-RS', sortOrder: 1, positionIds: [], parent: trvHQ }),
      this.nodeRepo.create({ organizationId: travco.id, structureType: 'management', name: 'Upper Egypt Region', description: 'صعيد مصر', level: 2, code: 'TRV-MGT-UE', sortOrder: 2, positionIds: [], parent: trvHQ }),
      this.nodeRepo.create({ organizationId: travco.id, structureType: 'management', name: 'North Coast Region', description: 'الساحل الشمالى', level: 2, code: 'TRV-MGT-NC', sortOrder: 3, positionIds: [], parent: trvHQ }),
    ]);

    // Travco Structure - Geographical
    const trvGeoEgypt = await this.nodeRepo.save(this.nodeRepo.create({
      organizationId: travco.id, structureType: 'geographical', name: 'Egypt', level: 1, code: 'TRV-GEO-EG', sortOrder: 1, positionIds: [],
    }));
    await this.nodeRepo.save([
      this.nodeRepo.create({ organizationId: travco.id, structureType: 'geographical', name: 'Cairo & Giza', level: 2, code: 'TRV-GEO-CAI', sortOrder: 1, positionIds: [], parent: trvGeoEgypt }),
      this.nodeRepo.create({ organizationId: travco.id, structureType: 'geographical', name: 'Hurghada', level: 2, code: 'TRV-GEO-HRG', sortOrder: 2, positionIds: [], parent: trvGeoEgypt }),
      this.nodeRepo.create({ organizationId: travco.id, structureType: 'geographical', name: 'Luxor & Aswan', level: 2, code: 'TRV-GEO-LXR', sortOrder: 3, positionIds: [], parent: trvGeoEgypt }),
      this.nodeRepo.create({ organizationId: travco.id, structureType: 'geographical', name: 'Sharm El Sheikh', level: 2, code: 'TRV-GEO-SSH', sortOrder: 4, positionIds: [], parent: trvGeoEgypt }),
    ]);

    // ═══════════════════════════════════════
    // ORGANIZATION 7: Ministry of Electricity
    // Type: Government Entity (هيئة حكومية خدمية)
    // ═══════════════════════════════════════
    const moElectricity = await this.orgRepo.save(this.orgRepo.create({
      idCode: 'IDG-ORG-MOELEC01',
      formalName: 'Ministry of Electricity and Renewable Energy',
      commercialName: 'Ministry of Electricity',
      searchName: 'ministry electricity egypt',
      name1: 'وزارة الكهرباء والطاقة المتجددة',
      orgLevel: 'individual',
      orgType: 'Government',
      legalEntityType: 'Government Entity',
      mainIndustry: 'Public Utilities',
      subsidiaryIndustries: ['Electricity Generation', 'Renewable Energy', 'Power Distribution'],
      countryOfRegistration: 'Egypt',
      cityOfRegistration: 'Cairo',
      headquarterAddress: 'Ramses Street, Abbasiya, Cairo',
      operationCountry: 'Egypt',
      operationLanguage: 'Arabic',
      email: 'info@moee.gov.eg',
      website: 'https://moee.gov.eg',
      phoneNumber: '+20226814100',
      adminIds: [ahmed.id],
      status: 'active',
    }));

    // Ministry Structure - Function
    await this.nodeRepo.save([
      this.nodeRepo.create({ organizationId: moElectricity.id, structureType: 'function', name: 'Power Generation', description: 'قطاع انتاج الكهرباء', level: 1, code: 'MOE-FUN-GEN', sortOrder: 1, positionIds: [] }),
      this.nodeRepo.create({ organizationId: moElectricity.id, structureType: 'function', name: 'Power Distribution', description: 'قطاع توزيع الكهرباء', level: 1, code: 'MOE-FUN-DST', sortOrder: 2, positionIds: [] }),
      this.nodeRepo.create({ organizationId: moElectricity.id, structureType: 'function', name: 'Renewable Energy', description: 'قطاع الطاقة المتجددة', level: 1, code: 'MOE-FUN-REN', sortOrder: 3, positionIds: [] }),
      this.nodeRepo.create({ organizationId: moElectricity.id, structureType: 'function', name: 'Customer Service', description: 'خدمة المواطنين', level: 1, code: 'MOE-FUN-CS', sortOrder: 4, positionIds: [] }),
    ]);

    // Ministry Structure - Geographical
    const moeGeoEgypt = await this.nodeRepo.save(this.nodeRepo.create({
      organizationId: moElectricity.id, structureType: 'geographical', name: 'Egypt', level: 1, code: 'MOE-GEO-EG', sortOrder: 1, positionIds: [],
    }));
    await this.nodeRepo.save([
      this.nodeRepo.create({ organizationId: moElectricity.id, structureType: 'geographical', name: 'Cairo Electricity', description: 'كهرباء القاهرة', level: 2, code: 'MOE-GEO-CAI', sortOrder: 1, positionIds: [], parent: moeGeoEgypt }),
      this.nodeRepo.create({ organizationId: moElectricity.id, structureType: 'geographical', name: 'Alexandria Electricity', description: 'كهرباء الإسكندرية', level: 2, code: 'MOE-GEO-ALX', sortOrder: 2, positionIds: [], parent: moeGeoEgypt }),
      this.nodeRepo.create({ organizationId: moElectricity.id, structureType: 'geographical', name: 'Upper Egypt Electricity', description: 'كهرباء الصعيد', level: 2, code: 'MOE-GEO-UPR', sortOrder: 3, positionIds: [], parent: moeGeoEgypt }),
    ]);

    return {
      message: 'Master data seeded successfully',
      summary: {
        users: users.length,
        organizations: 7,
        positions: 'Multiple per org',
        structureNodes: 'Full 4-type hierarchy',
      },
      credentials: {
        phone: '+201001234567',
        password: 'Password123!',
        note: 'All 5 users share the same password for testing',
      },
      organizations: [
        { name: 'Gezira Sporting Club', code: 'IDG-ORG-GEZIRA01', type: 'Sports Club' },
        { name: 'Al Ahly Sporting Club', code: 'IDG-ORG-ALAHLY01', type: 'Sports Club' },
        { name: 'Cairo University', code: 'IDG-ORG-CAIROU01', type: 'University' },
        { name: 'Marassi (Emaar Misr)', code: 'IDG-ORG-MARASI01', type: 'Residential/Tourism' },
        { name: 'Egyptian Steel Group', code: 'IDG-ORG-ESTEEL01', type: 'Factory' },
        { name: 'Travco Group', code: 'IDG-ORG-TRAVCO01', type: 'Tourism Company' },
        { name: 'Ministry of Electricity', code: 'IDG-ORG-MOELEC01', type: 'Government Entity' },
      ],
    };
  }
}
