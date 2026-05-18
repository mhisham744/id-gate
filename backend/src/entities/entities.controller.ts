import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { EntitiesService } from './entities.service';

@ApiTags('Entities')
@Controller('entities')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class EntitiesController {
  constructor(private entitiesService: EntitiesService) {}

  // ═══════════════════════════════════════
  // USER PROFILE
  // ═══════════════════════════════════════

  @Get('profile/me')
  @ApiOperation({ summary: 'Get my full profile' })
  async getMyProfile(@Request() req: any) {
    return this.entitiesService.getProfile(req.user.id);
  }

  @Put('profile/me')
  @ApiOperation({ summary: 'Update my profile' })
  async updateMyProfile(@Request() req: any, @Body() body: any) {
    return this.entitiesService.updateProfile(req.user.id, body);
  }

  @Get('profile/:id')
  @ApiOperation({ summary: 'Get user public profile' })
  async getPublicProfile(@Param('id') id: string) {
    return this.entitiesService.getPublicProfile(id);
  }

  @Get('search/users')
  @ApiOperation({ summary: 'Search users by name, IDCode, or phone' })
  async searchUsers(@Query('q') query: string) {
    return this.entitiesService.searchUsers(query || '');
  }

  // ═══════════════════════════════════════
  // ORGANIZATIONS
  // ═══════════════════════════════════════

  @Get('organizations/me')
  @ApiOperation({ summary: 'Get my organizations' })
  async getMyOrganizations(@Request() req: any) {
    return this.entitiesService.getUserOrganizations(req.user.id);
  }

  @Post('organizations')
  @ApiOperation({ summary: 'Create a new organization (Corporate Account)' })
  async createOrganization(@Request() req: any, @Body() body: any) {
    return this.entitiesService.createOrganization(req.user.id, body);
  }

  @Get('organizations/search')
  @ApiOperation({ summary: 'Search organizations' })
  async searchOrganizations(@Query('q') query: string) {
    return this.entitiesService.searchOrganizations(query || '');
  }

  @Get('organizations/:id')
  @ApiOperation({ summary: 'Get organization details' })
  async getOrganization(@Param('id') id: string) {
    return this.entitiesService.getOrganization(id);
  }

  @Put('organizations/:id')
  @ApiOperation({ summary: 'Update organization' })
  async updateOrganization(@Request() req: any, @Param('id') id: string, @Body() body: any) {
    return this.entitiesService.updateOrganization(req.user.id, id, body);
  }

  // ═══════════════════════════════════════
  // POSITIONS (Virtual Characters)
  // ═══════════════════════════════════════

  @Get('positions/me')
  @ApiOperation({ summary: 'Get my active positions' })
  async getMyPositions(@Request() req: any) {
    return this.entitiesService.getUserPositions(req.user.id);
  }

  @Get('positions/pending')
  @ApiOperation({ summary: 'Get pending position link requests for me' })
  async getPendingPositionLinks(@Request() req: any) {
    return this.entitiesService.getPendingPositionLinks(req.user.id);
  }

  @Post('organizations/:orgId/positions')
  @ApiOperation({ summary: 'Create a position in an organization' })
  async createPosition(
    @Request() req: any,
    @Param('orgId') orgId: string,
    @Body() body: any,
  ) {
    return this.entitiesService.createPosition(req.user.id, orgId, body);
  }

  @Get('organizations/:orgId/positions')
  @ApiOperation({ summary: 'Get all positions in an organization' })
  async getOrgPositions(@Param('orgId') orgId: string) {
    return this.entitiesService.getOrgPositions(orgId);
  }

  @Get('positions/:id')
  @ApiOperation({ summary: 'Get position details' })
  async getPosition(@Param('id') id: string) {
    return this.entitiesService.getPosition(id);
  }

  @Put('positions/:id')
  @ApiOperation({ summary: 'Update position' })
  async updatePosition(@Request() req: any, @Param('id') id: string, @Body() body: any) {
    return this.entitiesService.updatePosition(req.user.id, id, body);
  }

  @Post('positions/:id/link')
  @ApiOperation({ summary: 'Link position to a person (send link request)' })
  async linkPosition(
    @Request() req: any,
    @Param('id') id: string,
    @Body() body: { personId: string },
  ) {
    return this.entitiesService.linkPositionToPerson(req.user.id, id, body.personId);
  }

  @Post('positions/:id/accept-link')
  @ApiOperation({ summary: 'Accept position link request' })
  async acceptLink(@Request() req: any, @Param('id') id: string) {
    return this.entitiesService.acceptPositionLink(req.user.id, id);
  }

  @Post('positions/:id/decline-link')
  @ApiOperation({ summary: 'Decline position link request' })
  async declineLink(@Request() req: any, @Param('id') id: string) {
    return this.entitiesService.declinePositionLink(req.user.id, id);
  }

  @Post('positions/:id/unlink')
  @ApiOperation({ summary: 'Unlink position from person' })
  async unlinkPosition(@Request() req: any, @Param('id') id: string) {
    return this.entitiesService.unlinkPosition(req.user.id, id);
  }

  // ═══════════════════════════════════════
  // STRUCTURE MANAGEMENT
  // ═══════════════════════════════════════

  @Get('organizations/:orgId/structure')
  @ApiOperation({ summary: 'Get all structure nodes for an organization' })
  async getOrgStructure(
    @Param('orgId') orgId: string,
    @Query('type') structureType?: string,
  ) {
    return this.entitiesService.getOrgStructure(orgId, structureType);
  }

  @Post('organizations/:orgId/structure')
  @ApiOperation({ summary: 'Create a structure node' })
  async createStructureNode(
    @Request() req: any,
    @Param('orgId') orgId: string,
    @Body() body: any,
  ) {
    return this.entitiesService.createStructureNode(req.user.id, orgId, body);
  }

  @Put('structure/:nodeId')
  @ApiOperation({ summary: 'Update a structure node' })
  async updateStructureNode(
    @Request() req: any,
    @Param('nodeId') nodeId: string,
    @Body() body: any,
  ) {
    return this.entitiesService.updateStructureNode(req.user.id, nodeId, body);
  }

  @Delete('structure/:nodeId')
  @ApiOperation({ summary: 'Delete a structure node' })
  async deleteStructureNode(@Request() req: any, @Param('nodeId') nodeId: string) {
    await this.entitiesService.deleteStructureNode(req.user.id, nodeId);
    return { success: true };
  }
}
