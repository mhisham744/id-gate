import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FeedPostEntity } from '../feed/entities/feed-post.entity';
import { ConversationEntity } from '../communication/entities/conversation.entity';
import { MessageEntity } from '../communication/entities/message.entity';
import { OrganizationEntity } from '../entities/entities/organization.entity';

const ORG_ID = 'org-blink-egypt-001';
const ORG_NAME = 'Blink Egypt';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(FeedPostEntity)
    private feedRepo: Repository<FeedPostEntity>,
    @InjectRepository(ConversationEntity)
    private conversationRepo: Repository<ConversationEntity>,
    @InjectRepository(MessageEntity)
    private messageRepo: Repository<MessageEntity>,
    @InjectRepository(OrganizationEntity)
    private orgRepo: Repository<OrganizationEntity>,
  ) {}

  async seedAll(userId: string, user: any) {
    const orgCreated = await this.seedOrganization(userId);
    const postsCreated = await this.seedPosts(userId, user);
    const messagesCreated = await this.seedMessages(userId, user);
    return { postsCreated, messagesCreated, orgCreated };
  }

  private async seedOrganization(userId: string): Promise<number> {
    // Check if Blink Egypt already exists
    const existing = await this.orgRepo.findOne({ where: { idCode: 'IDG-BLINK-EG' } });
    if (existing) {
      // Ensure user is in adminIds
      if (!existing.adminIds.includes(userId)) {
        existing.adminIds = [...existing.adminIds, userId];
        await this.orgRepo.save(existing);
      }
      return 0;
    }

    await this.orgRepo.save(
      this.orgRepo.create({
        idCode: 'IDG-BLINK-EG',
        formalName: 'Blink Egypt Technologies S.A.E.',
        commercialName: 'Blink Egypt',
        registrationNumber: 'CR-EG-2024-78432',
        email: 'contact@blinkegypt.com',
        website: 'https://blinkegypt.com',
        phoneNumber: '+20225551234',
        address: '42 Tahrir Street, Downtown',
        city: 'Cairo',
        country: 'Egypt',
        industry: 'Technology',
        brands: ['Blink', 'BlinkPay'],
        products: ['Digital Identity', 'Secure Messaging', 'Payment Gateway'],
        adminIds: [userId],
        status: 'active',
      }),
    );
    return 1;
  }

  private async seedPosts(userId: string, user: any) {
    // Clear existing seed posts to avoid duplicates
    await this.feedRepo.delete({ organizationId: ORG_ID });

    const userName = `${user.firstName || 'User'} ${user.lastName || ''}`.trim();

    const posts: Partial<FeedPostEntity>[] = [
      {
        type: 'news',
        title: 'Blink Egypt Expands to 5 New Cities',
        content: 'We are thrilled to announce our expansion into Alexandria, Luxor, Aswan, Hurghada, and Sharm El-Sheikh. This marks a major milestone in our mission to provide fast, reliable delivery services across Egypt. Our new hubs are already operational and accepting orders.',
        summary: 'Blink Egypt is now serving 5 additional cities across Egypt',
        authorId: ORG_ID,
        authorName: 'Blink Egypt',
        authorType: 'organization',
        organizationId: ORG_ID,
        organizationName: ORG_NAME,
        audience: ['public'],
      },
      {
        type: 'event',
        title: 'Blink Egypt Team Townhall - May 2026',
        content: 'Monthly all-hands meeting to discuss Q2 progress, new initiatives, and celebrate our team achievements. All Blink Egypt staff and linked positions are invited. Refreshments will be served.',
        summary: 'Monthly team meeting for all Blink Egypt members',
        authorId: ORG_ID,
        authorName: 'Blink Egypt HR',
        authorType: 'organization',
        organizationId: ORG_ID,
        organizationName: ORG_NAME,
        eventDate: '2026-05-15',
        eventLocation: 'Blink Egypt HQ, Cairo',
        audience: ['public'],
      },
      {
        type: 'report',
        title: 'Q1 2026 Performance Report',
        content: 'Key metrics for Q1 2026: Revenue up 28% YoY, customer satisfaction at 94.2%, average delivery time reduced to 22 minutes. Our expansion strategy is delivering results. Full detailed breakdown available in the internal portal.',
        summary: 'Q1 results show strong growth across all key metrics',
        authorId: ORG_ID,
        authorName: 'Blink Egypt Finance',
        authorType: 'organization',
        organizationId: ORG_ID,
        organizationName: ORG_NAME,
        audience: ['public'],
      },
      {
        type: 'news',
        title: 'New Partnership: Blink x National Bank of Egypt',
        content: 'We are excited to announce our partnership with National Bank of Egypt to provide instant digital payments for all Blink transactions. This eliminates cash handling and streamlines the payment experience for both customers and delivery partners.',
        summary: 'Instant digital payments now available through NBE partnership',
        authorId: ORG_ID,
        authorName: 'Blink Egypt',
        authorType: 'organization',
        organizationId: ORG_ID,
        organizationName: ORG_NAME,
        audience: ['public'],
      },
      {
        type: 'event',
        title: 'Blink Egypt Hackathon 2026',
        content: 'Calling all developers! Join our 48-hour hackathon to build innovative logistics solutions. Winners receive cash prizes up to 50,000 EGP and potential full-time offers. Open to all verified developers on IDGate.',
        summary: '48-hour hackathon with 50,000 EGP in prizes',
        authorId: ORG_ID,
        authorName: 'Blink Egypt Tech',
        authorType: 'organization',
        organizationId: ORG_ID,
        organizationName: ORG_NAME,
        eventDate: '2026-06-01',
        eventLocation: 'Greek Campus, Cairo',
        audience: ['public'],
      },
      {
        type: 'news',
        title: `Welcome ${userName} to the Blink Egypt Family!`,
        content: `We are happy to welcome ${userName} to Blink Egypt. Your verified credentials have been confirmed and you now have full access to all organizational communications and resources.`,
        summary: 'New member onboarded successfully',
        authorId: ORG_ID,
        authorName: 'Blink Egypt',
        authorType: 'organization',
        organizationId: ORG_ID,
        organizationName: ORG_NAME,
        audience: ['public'],
      },
      {
        type: 'report',
        title: 'Employee Satisfaction Survey Results',
        content: 'Our annual employee satisfaction survey shows 91% of team members are proud to work at Blink Egypt. Key highlights: flexible work arrangements rated 4.7/5, career growth opportunities 4.5/5, team culture 4.8/5.',
        summary: '91% employee satisfaction rate in 2026 survey',
        authorId: ORG_ID,
        authorName: 'Blink Egypt HR',
        authorType: 'organization',
        organizationId: ORG_ID,
        organizationName: ORG_NAME,
        audience: ['public'],
      },
    ];

    for (const post of posts) {
      await this.feedRepo.save(this.feedRepo.create(post));
    }
    return posts.length;
  }

  private async seedMessages(userId: string, user: any) {
    const userName = `${user.firstName || 'User'} ${user.lastName || ''}`.trim();
    const now = Date.now();
    const min = 60_000;
    const hour = 3_600_000;
    const day = 24 * hour;
    let totalMessages = 0;

    // ─── Conversation 1: Blink Egypt (Organization) ───
    totalMessages += await this.seedConversation(userId, userName, {
      participantId: ORG_ID,
      participantName: ORG_NAME,
      participantType: 'organization',
      messages: [
        { from: 'them', content: `Hello ${userName}! Welcome to Blink Egypt. Your identity has been verified and you're now linked to our organization. 🎉`, time: now - 5 * hour },
        { from: 'them', content: 'As a verified member, you have access to all internal communications, team channels, and organizational resources.', time: now - 5 * hour + 1 * min },
        { from: 'me', content: 'Thank you! Excited to be part of the team. Where can I find the onboarding materials?', time: now - 4 * hour },
        { from: 'them', content: "Great question! I've shared the onboarding guide in our team channel. You'll find everything from IT setup to team introductions there.", time: now - 4 * hour + 5 * min },
        { from: 'them', content: "Also, don't forget our monthly townhall is coming up on May 15th. It would be great to introduce you to the rest of the team.", time: now - 4 * hour + 6 * min },
        { from: 'me', content: "Sounds great! I'll definitely be there. Is there anything I need to prepare beforehand?", time: now - 3 * hour },
        { from: 'them', content: "Just a brief intro about yourself — your background and what you're looking forward to. Keep it casual, 1-2 minutes max. 😊", time: now - 3 * hour + 3 * min },
        { from: 'me', content: 'Perfect, will do! One more question — is there a dress code for the office?', time: now - 2 * hour },
        { from: 'them', content: "Smart casual works! We're pretty relaxed. Jeans are fine as long as you're not meeting external clients. 👔➡️👕", time: now - 2 * hour + 2 * min },
        { from: 'me', content: 'Amazing, thanks for all the info! Looking forward to getting started 🚀', time: now - 1 * hour },
        { from: 'them', content: "We're glad to have you! If you need anything at all, just message here. This is your direct verified channel to Blink Egypt. 🙌", time: now - 30 * min },
      ],
    });

    // ─── Conversation 2: Mohamed Ali (colleague) ───
    totalMessages += await this.seedConversation(userId, userName, {
      participantId: 'user-mohamed-ali-001',
      participantName: 'Mohamed Ali',
      participantType: 'natural',
      messages: [
        { from: 'them', content: `Hey ${userName}! Saw you just joined Blink Egypt. Welcome aboard! 👋`, time: now - 2 * day },
        { from: 'me', content: 'Thanks Mohamed! Yeah just started. How long have you been there?', time: now - 2 * day + 30 * min },
        { from: 'them', content: 'About 2 years now. Started as a junior dev and now leading the mobile team.', time: now - 2 * day + 35 * min },
        { from: 'them', content: "If you need help setting up your dev environment, let me know. The docs are a bit outdated 😅", time: now - 2 * day + 36 * min },
        { from: 'me', content: "That would be awesome! I'm setting up my laptop tomorrow, might ping you if I get stuck.", time: now - 2 * day + 1 * hour },
        { from: 'them', content: 'Anytime! Also, we do a coffee run at 10am every day. Rooftop cafe. You should join us ☕', time: now - 1 * day },
        { from: 'me', content: "Count me in! See you tomorrow 👍", time: now - 1 * day + 10 * min },
      ],
    });

    // ─── Conversation 3: Sara Tech Support ───
    totalMessages += await this.seedConversation(userId, userName, {
      participantId: 'user-sara-tech-001',
      participantName: 'Sara Ibrahim',
      participantType: 'virtual',
      messages: [
        { from: 'them', content: `Hi ${userName}, I'm Sara from IT Support. I've been assigned to help you with your workstation setup.`, time: now - 1 * day - 3 * hour },
        { from: 'me', content: "Hi Sara! Great, I was just about to reach out. I received my MacBook but can't access the VPN.", time: now - 1 * day - 2 * hour },
        { from: 'them', content: "No worries, that's common for new joiners. I'll send you the VPN config file and credentials now.", time: now - 1 * day - 2 * hour + 5 * min },
        { from: 'them', content: '📎 vpn-config.ovpn\nHere you go! Install OpenVPN Connect and import this file.', time: now - 1 * day - 2 * hour + 6 * min },
        { from: 'me', content: 'Got it, installing now... Done! It connected successfully ✅', time: now - 1 * day - 1 * hour },
        { from: 'them', content: "Perfect! You should now have access to Jira, Confluence, and the internal Git repos. Let me know if anything else isn't working.", time: now - 1 * day - 1 * hour + 3 * min },
        { from: 'me', content: 'Everything looks good. Thanks for the quick help!', time: now - 1 * day - 50 * min },
        { from: 'them', content: "You're welcome! Don't hesitate to reach out if you need anything. Happy coding! 💻", time: now - 1 * day - 45 * min },
      ],
    });

    // ─── Conversation 4: Team Engineering (group) ───
    totalMessages += await this.seedGroupConversation(userId, userName, {
      name: 'Engineering Team',
      participantIds: [userId, 'user-mohamed-ali-001', 'user-sara-tech-001', 'user-omar-dev-001', 'user-nour-pm-001'],
      messages: [
        { from: 'user-omar-dev-001', displayName: 'Omar Khaled', content: 'Hey team, sprint planning is at 2pm today. Please update your Jira stories before then.', time: now - 6 * hour },
        { from: 'user-nour-pm-001', displayName: 'Nour Hassan', content: "Also, we have 3 carry-over stories from last sprint. Let's discuss priority.", time: now - 6 * hour + 10 * min },
        { from: 'user-mohamed-ali-001', displayName: 'Mohamed Ali', content: "I'll handle the auth token refresh bug. Already have a fix locally.", time: now - 5 * hour },
        { from: 'me', displayName: userName, content: "I can take the feed pagination task if that's available.", time: now - 4 * hour + 30 * min },
        { from: 'user-nour-pm-001', displayName: 'Nour Hassan', content: `Great initiative ${userName}! I'll assign it to you. Welcome to the team btw! 🎉`, time: now - 4 * hour + 35 * min },
        { from: 'user-omar-dev-001', displayName: 'Omar Khaled', content: 'Reminder: sprint planning in 30 mins. Conference room B.', time: now - 2 * hour },
      ],
    });

    // ─── Conversation 5: National Bank of Egypt (organization) ───
    totalMessages += await this.seedConversation(userId, userName, {
      participantId: 'org-nbe-001',
      participantName: 'National Bank of Egypt',
      participantType: 'organization',
      messages: [
        { from: 'them', content: `Dear ${userName}, your verified account has been linked to our digital services. You can now receive official bank notifications through this channel.`, time: now - 3 * day },
        { from: 'them', content: '🔔 Account Statement: Your April 2026 statement is now available in your NBE app.', time: now - 2 * day },
        { from: 'them', content: '🔔 Payment Received: EGP 45,000.00 salary credit from Blink Egypt. Reference: SAL-MAY-2026.', time: now - 12 * hour },
        { from: 'me', content: 'Thanks. Can I request a bank letter through this channel?', time: now - 10 * hour },
        { from: 'them', content: "Yes! Simply reply with 'REQUEST LETTER' followed by the type (salary certificate, account statement, or employment verification) and we'll process it within 24 hours.", time: now - 9 * hour },
      ],
    });

    // ─── Conversation 6: Layla (friend) ───
    totalMessages += await this.seedConversation(userId, userName, {
      participantId: 'user-layla-001',
      participantName: 'Layla Mahmoud',
      participantType: 'natural',
      messages: [
        { from: 'them', content: 'Congratulations on the new job!! 🎊🎊🎊', time: now - 3 * day + 5 * hour },
        { from: 'me', content: 'Thank you!! I start next week, super nervous 😬', time: now - 3 * day + 5 * hour + 20 * min },
        { from: 'them', content: "You'll crush it! Blink Egypt is a great company. My cousin works there and loves it.", time: now - 3 * day + 5 * hour + 25 * min },
        { from: 'me', content: "That's reassuring! We should celebrate this weekend. Dinner?", time: now - 3 * day + 6 * hour },
        { from: 'them', content: "Yes!! Let's go to that new place in Zamalek. Saturday 8pm?", time: now - 3 * day + 6 * hour + 5 * min },
        { from: 'me', content: 'Done! 🍽️', time: now - 3 * day + 6 * hour + 10 * min },
      ],
    });

    return totalMessages;
  }

  private async seedConversation(
    userId: string,
    userName: string,
    opts: {
      participantId: string;
      participantName: string;
      participantType: string;
      messages: { from: 'me' | 'them'; content: string; time: number }[];
    },
  ) {
    // Find or create
    let conv = await this.conversationRepo
      .createQueryBuilder('conv')
      .where('conv.type = :type', { type: 'direct' })
      .andWhere('conv.participantIds LIKE :userId', { userId: `%${userId}%` })
      .andWhere('conv.participantIds LIKE :pid', { pid: `%${opts.participantId}%` })
      .getOne();

    if (!conv) {
      conv = await this.conversationRepo.save(
        this.conversationRepo.create({
          type: 'direct',
          name: opts.participantName,
          participantIds: [userId, opts.participantId],
          adminIds: [userId, opts.participantId],
        }),
      );
    }

    // Clear existing messages
    await this.messageRepo.delete({ conversationId: conv.id });

    // Insert messages
    for (const msg of opts.messages) {
      await this.messageRepo.save(
        this.messageRepo.create({
          conversationId: conv.id,
          senderId: msg.from === 'me' ? userId : opts.participantId,
          senderType: msg.from === 'me' ? 'natural' : opts.participantType,
          senderDisplayName: msg.from === 'me' ? userName : opts.participantName,
          type: 'text',
          content: msg.content,
          status: 'read',
          createdAt: new Date(msg.time),
        }),
      );
    }

    // Update preview
    const last = opts.messages[opts.messages.length - 1];
    conv.lastMessagePreview = last.content.slice(0, 100);
    conv.lastMessageAt = new Date(last.time);
    conv.name = opts.participantName;
    await this.conversationRepo.save(conv);

    return opts.messages.length;
  }

  private async seedGroupConversation(
    userId: string,
    userName: string,
    opts: {
      name: string;
      participantIds: string[];
      messages: { from: string; displayName: string; content: string; time: number }[];
    },
  ) {
    // Find or create
    let conv = await this.conversationRepo
      .createQueryBuilder('conv')
      .where('conv.type = :type', { type: 'group' })
      .andWhere('conv.name = :name', { name: opts.name })
      .andWhere('conv.participantIds LIKE :userId', { userId: `%${userId}%` })
      .getOne();

    if (!conv) {
      conv = await this.conversationRepo.save(
        this.conversationRepo.create({
          type: 'group',
          name: opts.name,
          participantIds: opts.participantIds,
          adminIds: [opts.participantIds[0]],
        }),
      );
    }

    // Clear existing
    await this.messageRepo.delete({ conversationId: conv.id });

    // Insert
    for (const msg of opts.messages) {
      const isMe = msg.from === 'me' || msg.from === userId;
      await this.messageRepo.save(
        this.messageRepo.create({
          conversationId: conv.id,
          senderId: isMe ? userId : msg.from,
          senderType: 'natural',
          senderDisplayName: isMe ? userName : msg.displayName,
          type: 'text',
          content: msg.content,
          status: 'read',
          createdAt: new Date(msg.time),
        }),
      );
    }

    // Update preview
    const last = opts.messages[opts.messages.length - 1];
    conv.lastMessagePreview = `${last.displayName}: ${last.content}`.slice(0, 100);
    conv.lastMessageAt = new Date(last.time);
    await this.conversationRepo.save(conv);

    return opts.messages.length;
  }
}
