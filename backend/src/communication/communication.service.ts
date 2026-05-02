import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConversationEntity } from './entities/conversation.entity';
import { MessageEntity } from './entities/message.entity';

@Injectable()
export class CommunicationService {
  constructor(
    @InjectRepository(ConversationEntity)
    private conversationRepo: Repository<ConversationEntity>,
    @InjectRepository(MessageEntity)
    private messageRepo: Repository<MessageEntity>,
  ) {}

  async getUserConversations(userId: string) {
    // participantIds is stored as comma-separated text (simple-array), not a Postgres array
    const conversations = await this.conversationRepo
      .createQueryBuilder('conv')
      .where('conv.participantIds LIKE :userId', { userId: `%${userId}%` })
      .orderBy('conv.lastMessageAt', 'DESC', 'NULLS LAST')
      .getMany();
    return conversations;
  }

  async getConversation(userId: string, conversationId: string) {
    const conv = await this.conversationRepo.findOne({ where: { id: conversationId } });
    if (!conv) throw new NotFoundException('Conversation not found');
    if (!conv.participantIds.includes(userId)) {
      throw new ForbiddenException('You are not a participant in this conversation');
    }
    return conv;
  }

  async getMessages(userId: string, conversationId: string, page = 1, limit = 50) {
    // Verify access
    await this.getConversation(userId, conversationId);

    return this.messageRepo.find({
      where: { conversationId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async sendMessage(
    userId: string,
    conversationId: string,
    data: {
      type: string;
      content: string;
      senderType: string;
      senderDisplayName: string;
      attachments?: any[];
      replyToId?: string;
    },
  ) {
    // Verify access
    const conv = await this.getConversation(userId, conversationId);

    const message = this.messageRepo.create({
      conversationId,
      senderId: userId,
      senderType: data.senderType,
      senderDisplayName: data.senderDisplayName,
      type: data.type,
      content: data.content,
      attachments: data.attachments,
      replyToId: data.replyToId,
      status: 'sent',
    });

    const saved = await this.messageRepo.save(message);

    // Update conversation last message
    conv.lastMessagePreview =
      data.type === 'text' ? data.content.slice(0, 100) : `[${data.type}]`;
    conv.lastMessageAt = new Date();
    await this.conversationRepo.save(conv);

    return saved;
  }

  async createDirectConversation(userId: string, targetId: string) {
    // Check if direct conversation already exists
    const existing = await this.conversationRepo
      .createQueryBuilder('conv')
      .where('conv.type = :type', { type: 'direct' })
      .andWhere(':userId = ANY(conv.participantIds)', { userId })
      .andWhere(':targetId = ANY(conv.participantIds)', { targetId })
      .getOne();

    if (existing) return existing;

    const conv = this.conversationRepo.create({
      type: 'direct',
      participantIds: [userId, targetId],
      adminIds: [userId, targetId],
    });

    return this.conversationRepo.save(conv);
  }

  async createGroupConversation(
    userId: string,
    name: string,
    participantIds: string[],
    type: 'team' | 'group' = 'group',
  ) {
    const allParticipants = [...new Set([userId, ...participantIds])];
    const conv = this.conversationRepo.create({
      type,
      name,
      participantIds: allParticipants,
      adminIds: [userId],
    });

    return this.conversationRepo.save(conv);
  }
}
