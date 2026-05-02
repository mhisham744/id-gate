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
import { FeedService } from './feed.service';

@ApiTags('Feed')
@Controller('feed')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FeedController {
  constructor(private feedService: FeedService) {}

  @Get()
  @ApiOperation({ summary: 'Get feed posts based on user credentials' })
  async getFeed(
    @Request() req: any,
    @Query('type') type?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    // Seed demo data on first access
    await this.feedService.seedDemoData(req.user.id, `${req.user.idCode}`);

    const data = await this.feedService.getFeed(req.user.id, {
      type,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
    });
    return { success: true, data };
  }

  @Post()
  @ApiOperation({ summary: 'Create a new feed post' })
  async createPost(@Request() req: any, @Body() body: {
    type: string;
    title: string;
    content: string;
    summary?: string;
    organizationId?: string;
    organizationName?: string;
    eventDate?: string;
    eventLocation?: string;
    imageUrl?: string;
    audience?: string[];
  }) {
    const post = await this.feedService.createPost({
      ...body,
      authorId: req.user.id,
      authorName: req.user.idCode,
      authorType: 'natural',
      audience: body.audience || ['public'],
    });
    return { success: true, data: post };
  }

  @Post(':id/like')
  @ApiOperation({ summary: 'Like a feed post' })
  async likePost(@Param('id') id: string) {
    await this.feedService.likePost(id);
    return { success: true };
  }

  @Post(':id/forward')
  @ApiOperation({ summary: 'Forward a feed post' })
  async forwardPost(@Param('id') id: string) {
    await this.feedService.forwardPost(id);
    return { success: true };
  }
}
