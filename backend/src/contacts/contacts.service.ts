import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactEntity } from './entities/contact.entity';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(ContactEntity)
    private contactRepo: Repository<ContactEntity>,
  ) {}

  async getContacts(userId: string) {
    return this.contactRepo.find({
      where: { ownerId: userId, status: 'connected' },
    });
  }

  async requestContact(userId: string, contactId: string, contactType: string) {
    // Check if already exists
    const existing = await this.contactRepo.findOne({
      where: { ownerId: userId, contactId },
    });
    if (existing) throw new ConflictException('Contact request already exists');

    // Create bidirectional entries
    const senderEntry = this.contactRepo.create({
      ownerId: userId,
      contactId,
      contactType,
      status: 'pending_sent',
    });

    const receiverEntry = this.contactRepo.create({
      ownerId: contactId,
      contactId: userId,
      contactType: 'natural', // The sender is always a natural person
      status: 'pending_received',
    });

    await this.contactRepo.save([senderEntry, receiverEntry]);
    return senderEntry;
  }

  async respondToRequest(userId: string, contactId: string, action: 'accept' | 'decline') {
    const myEntry = await this.contactRepo.findOne({
      where: { ownerId: userId, contactId, status: 'pending_received' },
    });
    if (!myEntry) throw new NotFoundException('Contact request not found');

    const theirEntry = await this.contactRepo.findOne({
      where: { ownerId: contactId, contactId: userId },
    });

    if (action === 'accept') {
      myEntry.status = 'connected';
      myEntry.connectedAt = new Date();
      if (theirEntry) {
        theirEntry.status = 'connected';
        theirEntry.connectedAt = new Date();
      }
    } else {
      myEntry.status = 'declined';
      if (theirEntry) theirEntry.status = 'declined';
    }

    await this.contactRepo.save([myEntry, ...(theirEntry ? [theirEntry] : [])]);
    return myEntry;
  }

  async getPendingRequests(userId: string) {
    return this.contactRepo.find({
      where: { ownerId: userId, status: 'pending_received' },
    });
  }

  async getSentRequests(userId: string) {
    return this.contactRepo.find({
      where: { ownerId: userId, status: 'pending_sent' },
    });
  }

  async removeContact(userId: string, contactId: string) {
    await this.contactRepo.delete({ ownerId: userId, contactId });
    await this.contactRepo.delete({ ownerId: contactId, contactId: userId });
  }

  async blockContact(userId: string, contactId: string) {
    await this.contactRepo.update(
      { ownerId: userId, contactId },
      { status: 'blocked' },
    );
  }
}
