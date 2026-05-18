import { Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SeedService } from './seed.service';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
  constructor(private seedService: SeedService) {}

  @Post()
  @ApiOperation({ summary: 'Seed demo data' })
  async seed() {
    return this.seedService.seed();
  }
}
