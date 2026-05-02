import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ContactsService } from './contacts.service';

@ApiTags('Contacts')
@Controller('contacts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ContactsController {
  constructor(private contactsService: ContactsService) {}

  @Get()
  @ApiOperation({ summary: 'Get my contacts (address book)' })
  async getContacts(@Request() req: any) {
    const data = await this.contactsService.getContacts(req.user.id);
    return { success: true, data };
  }

  @Get('pending')
  @ApiOperation({ summary: 'Get pending contact requests received' })
  async getPending(@Request() req: any) {
    const data = await this.contactsService.getPendingRequests(req.user.id);
    return { success: true, data };
  }

  @Get('sent')
  @ApiOperation({ summary: 'Get my sent contact requests' })
  async getSent(@Request() req: any) {
    const data = await this.contactsService.getSentRequests(req.user.id);
    return { success: true, data };
  }

  @Post('request')
  @ApiOperation({ summary: 'Send a contact request' })
  async requestContact(
    @Request() req: any,
    @Body() body: { contactId: string; contactType: string },
  ) {
    const data = await this.contactsService.requestContact(
      req.user.id,
      body.contactId,
      body.contactType,
    );
    return { success: true, data };
  }

  @Post(':contactId/respond')
  @ApiOperation({ summary: 'Accept or decline a contact request' })
  async respond(
    @Request() req: any,
    @Param('contactId') contactId: string,
    @Body() body: { action: 'accept' | 'decline' },
  ) {
    const data = await this.contactsService.respondToRequest(
      req.user.id,
      contactId,
      body.action,
    );
    return { success: true, data };
  }

  @Delete(':contactId')
  @ApiOperation({ summary: 'Remove a contact' })
  async removeContact(@Request() req: any, @Param('contactId') contactId: string) {
    await this.contactsService.removeContact(req.user.id, contactId);
    return { success: true };
  }

  @Post(':contactId/block')
  @ApiOperation({ summary: 'Block a contact' })
  async blockContact(@Request() req: any, @Param('contactId') contactId: string) {
    await this.contactsService.blockContact(req.user.id, contactId);
    return { success: true };
  }
}
