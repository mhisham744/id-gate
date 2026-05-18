import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntitiesController } from './entities.controller';
import { EntitiesService } from './entities.service';
import { OrganizationEntity } from './entities/organization.entity';
import { PositionEntity } from './entities/position.entity';
import { OrgStructureNodeEntity } from './entities/org-structure-node.entity';
import { UserEntity } from '../auth/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrganizationEntity,
      PositionEntity,
      OrgStructureNodeEntity,
      UserEntity,
    ]),
  ],
  controllers: [EntitiesController],
  providers: [EntitiesService],
  exports: [EntitiesService],
})
export class EntitiesModule {}
