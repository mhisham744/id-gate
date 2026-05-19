import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntitiesController } from './entities.controller';
import { EntitiesService } from './entities.service';
import { OrganizationEntity } from './entities/organization.entity';
import { PositionEntity } from './entities/position.entity';
import { OrgStructureNodeEntity } from './entities/org-structure-node.entity';
import { JoinRequestEntity } from './entities/join-request.entity';
import { UserEntity } from '../auth/entities/user.entity';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrganizationEntity,
      PositionEntity,
      OrgStructureNodeEntity,
      JoinRequestEntity,
      UserEntity,
    ]),
    NotificationsModule,
  ],
  controllers: [EntitiesController],
  providers: [EntitiesService],
  exports: [EntitiesService],
})
export class EntitiesModule {}
