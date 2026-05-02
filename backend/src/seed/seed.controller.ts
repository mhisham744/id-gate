import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SeedService } from './seed.service';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
  constructor(private seedService: SeedService) {}

  @Post()
  @ApiOperation({ summary: 'Seed sample data (posts + messages)' })
  async seedAll() {
    const result = await this.seedService.seedBootstrap();
    return { success: true, data: result };
  }
}
