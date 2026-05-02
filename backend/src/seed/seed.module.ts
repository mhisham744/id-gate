import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';
import { FeedPostEntity } from '../feed/entities/feed-post.entity';
import { ConversationEntity } from '../communication/entities/conversation.entity';
import { MessageEntity } from '../communication/entities/message.entity';
import { OrganizationEntity } from '../entities/entities/organization.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FeedPostEntity, ConversationEntity, MessageEntity, OrganizationEntity])],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
