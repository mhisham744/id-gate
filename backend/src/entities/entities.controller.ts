import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { EntitiesService } from './entities.service';

@ApiTags('Entities')
@Controller('entities')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class EntitiesController {
  constructor(private entitiesService: EntitiesService) {}

  // --- My profile positions ---

  @Get('me/positions')
  @ApiOperation({ summary: 'Get my linked positions (virtual characters)' })
  async getMyPositions(@Request() req: any) {
    const data = await this.entitiesService.getUserPositions(req.user.id);
    return { success: true, data };
  }

  @Get('me/organizations')
  @ApiOperation({ summary: 'Get organizations I admin or belong to' })
  async getMyOrganizations(@Request() req: any) {
    const data = await this.entitiesService.getUserOrganizations(req.user.id);
    return { success: true, data };
  }

  // --- Organizations ---

  @Post('organizations')
  @ApiOperation({ summary: 'Create a new organization (legal entity)' })
  async createOrganization(@Request() req: any, @Body() body: any) {
    const data = await this.entitiesService.createOrganization(req.user.id, body);
    return { success: true, data };
  }

  @Get('organizations/:id')
  @ApiOperation({ summary: 'Get organization details' })
  async getOrganization(@Param('id') id: string) {
    const data = await this.entitiesService.getOrganization(id);
    return { success: true, data };
  }

  @Get('organizations/:id/structure')
  @ApiOperation({ summary: 'Get organization structure' })
  async getOrgStructure(@Param('id') id: string) {
    const data = await this.entitiesService.getOrgStructure(id);
    return { success: true, data };
  }

  // --- Positions ---

  @Post('organizations/:orgId/positions')
  @ApiOperation({ summary: 'Create a position in an organization' })
  async createPosition(
    @Request() req: any,
    @Param('orgId') orgId: string,
    @Body() body: any,
  ) {
    const data = await this.entitiesService.createPosition(req.user.id, orgId, body);
    return { success: true, data };
  }

  @Post('positions/:id/link')
  @ApiOperation({ summary: 'Request to link a position to a natural person' })
  async linkPosition(
    @Request() req: any,
    @Param('id') id: string,
    @Body() body: { personId: string },
  ) {
    const data = await this.entitiesService.linkPositionToPerson(
      req.user.id,
      id,
      body.personId,
    );
    return { success: true, data };
  }

  @Post('positions/:id/accept-link')
  @ApiOperation({ summary: 'Accept a position link request' })
  async acceptLink(@Request() req: any, @Param('id') id: string) {
    const data = await this.entitiesService.acceptPositionLink(req.user.id, id);
    return { success: true, data };
  }

  @Post('positions/:id/unlink')
  @ApiOperation({ summary: 'Unlink a position from a person (admin only)' })
  async unlinkPosition(@Request() req: any, @Param('id') id: string) {
    const data = await this.entitiesService.unlinkPosition(req.user.id, id);
    return { success: true, data };
  }
}
