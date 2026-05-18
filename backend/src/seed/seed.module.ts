import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { UserEntity } from '../auth/entities/user.entity';
import { OrganizationEntity } from '../entities/entities/organization.entity';
import { PositionEntity } from '../entities/entities/position.entity';
import { OrgStructureNodeEntity } from '../entities/entities/org-structure-node.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      OrganizationEntity,
      PositionEntity,
      OrgStructureNodeEntity,
    ]),
  ],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
