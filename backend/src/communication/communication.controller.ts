import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CommunicationService } from './communication.service';

@ApiTags('Communication')
@Controller('conversations')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CommunicationController {
  constructor(private communicationService: CommunicationService) {}

  @Get()
  @ApiOperation({ summary: 'Get all my conversations' })
  async getConversations(@Request() req: any) {
    const data = await this.communicationService.getUserConversations(req.user.id);
    return { success: true, data };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific conversation' })
  async getConversation(@Request() req: any, @Param('id') id: string) {
    const data = await this.communicationService.getConversation(req.user.id, id);
    return { success: true, data };
  }

  @Get(':id/messages')
  @ApiOperation({ summary: 'Get messages in a conversation' })
  async getMessages(
    @Request() req: any,
    @Param('id') id: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const data = await this.communicationService.getMessages(
      req.user.id,
      id,
      page || 1,
      limit || 50,
    );
    return { success: true, data };
  }

  @Post(':id/messages')
  @ApiOperation({ summary: 'Send a message in a conversation' })
  async sendMessage(
    @Request() req: any,
    @Param('id') id: string,
    @Body() body: { type: string; content: string; attachments?: any[]; replyToId?: string },
  ) {
    const data = await this.communicationService.sendMessage(req.user.id, id, {
      ...body,
      senderType: 'natural', // TODO: support virtual identity switching
      senderDisplayName: `${req.user.idCode}`, // TODO: resolve from user entity
    });
    return { success: true, data };
  }

  @Post('direct')
  @ApiOperation({ summary: 'Create or get a direct conversation' })
  async createDirect(@Request() req: any, @Body() body: { targetId: string }) {
    const data = await this.communicationService.createDirectConversation(
      req.user.id,
      body.targetId,
    );
    return { success: true, data };
  }

  @Post('group')
  @ApiOperation({ summary: 'Create a group conversation' })
  async createGroup(
    @Request() req: any,
    @Body() body: { name: string; participantIds: string[]; type?: 'team' | 'group' },
  ) {
    const data = await this.communicationService.createGroupConversation(
      req.user.id,
      body.name,
      body.participantIds,
      body.type,
    );
    return { success: true, data };
  }
}
