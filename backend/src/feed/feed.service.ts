import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FeedPostEntity } from './entities/feed-post.entity';

@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(FeedPostEntity)
    private feedRepo: Repository<FeedPostEntity>,
  ) {}

  async getFeed(userId: string, filters?: { type?: string; page?: number; limit?: number }) {
    const page = filters?.page || 1;
    const limit = filters?.limit || 20;

    const qb = this.feedRepo
      .createQueryBuilder('post')
      .orderBy('post.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    // Filter by type if specified
    if (filters?.type && filters.type !== 'all') {
      qb.andWhere('post.type = :type', { type: filters.type });
    }

    // For now, show all public posts + posts targeted to user's orgs
    // In production, this would check user's positions/org memberships
    qb.andWhere("post.audience @> :audience", { audience: JSON.stringify(['public']) });

    const [posts, total] = await qb.getManyAndCount();
    return { posts, total, page, limit };
  }

  async createPost(data: Partial<FeedPostEntity>) {
    const post = this.feedRepo.create(data);
    return this.feedRepo.save(post);
  }

  async getPost(id: string) {
    return this.feedRepo.findOne({ where: { id } });
  }

  async likePost(postId: string) {
    await this.feedRepo.increment({ id: postId }, 'likesCount', 1);
  }

  async forwardPost(postId: string) {
    await this.feedRepo.increment({ id: postId }, 'forwardsCount', 1);
  }

  // Seed some demo data for development
  async seedDemoData(userId: string, userName: string) {
    const existingCount = await this.feedRepo.count();
    if (existingCount > 0) return;

    const demoPosts: Partial<FeedPostEntity>[] = [
      {
        type: 'news',
        title: 'IDGate Platform Officially Launched',
        content: 'The IDGate communication platform is now live, enabling verified identity-based communication for professionals worldwide. All users can now create their Natural Character profile and connect with organizations.',
        summary: 'IDGate is now live for all verified professionals',
        authorId: userId,
        authorName: 'IDGate Official',
        authorType: 'organization',
        organizationName: 'IDGate',
        audience: ['public'],
      },
      {
        type: 'event',
        title: 'Digital Identity Conference 2026',
        content: 'Join us for the annual Digital Identity Conference where industry leaders discuss the future of verified communications, blockchain-based credentials, and secure messaging.',
        summary: 'Annual conference on digital identity and verified communications',
        authorId: userId,
        authorName: 'Tech Events Board',
        authorType: 'organization',
        organizationName: 'Conference Board International',
        eventDate: '2026-06-15',
        eventLocation: 'Dubai World Trade Centre',
        audience: ['public'],
      },
      {
        type: 'report',
        title: 'Q1 2026 Digital Communication Trends',
        content: 'This quarterly report analyzes the shift towards identity-verified messaging platforms. Key findings include a 340% increase in demand for credential-based communication tools and growing enterprise adoption of verified channels.',
        summary: 'Quarterly analysis of digital communication industry trends',
        authorId: userId,
        authorName: 'Digital Insights Lab',
        authorType: 'organization',
        organizationName: 'Market Research Corp',
        audience: ['public'],
      },
      {
        type: 'news',
        title: 'Central Bank Adopts Verified Communication Channels',
        content: 'The Central Bank has announced that all official communications to financial institutions will now be sent through verified credential-based channels, reducing fraud and impersonation risks.',
        summary: 'Official financial communications now require verified identity',
        authorId: userId,
        authorName: 'Financial Times',
        authorType: 'organization',
        organizationName: 'Financial Times',
        audience: ['public'],
      },
      {
        type: 'event',
        title: 'Cybersecurity & Identity Workshop',
        content: 'A hands-on workshop covering best practices for identity verification, multi-factor authentication, and secure organizational communication hierarchies.',
        summary: 'Practical workshop on identity security',
        authorId: userId,
        authorName: 'CyberSec Academy',
        authorType: 'organization',
        organizationName: 'CyberSec Academy',
        eventDate: '2026-05-28',
        eventLocation: 'Online (Virtual)',
        audience: ['public'],
      },
      {
        type: 'report',
        title: 'Enterprise Communication Platform Market Share 2026',
        content: 'Annual market report showing the competitive landscape of enterprise communication platforms. Identity-verified platforms now command 12% of the market, up from 3% in 2024.',
        summary: 'Market share analysis of enterprise communication platforms',
        authorId: userId,
        authorName: 'Gartner Analytics',
        authorType: 'organization',
        organizationName: 'Gartner',
        audience: ['public'],
      },
      {
        type: 'news',
        title: 'New Data Privacy Regulations Require Verified Senders',
        content: 'Government regulators have introduced new requirements mandating that all official organizational communications must originate from verified sender identities, effective January 2027.',
        summary: 'New regulations mandate verified sender identity for official communications',
        authorId: userId,
        authorName: 'Reuters',
        authorType: 'organization',
        organizationName: 'Reuters',
        audience: ['public'],
      },
    ];

    for (const post of demoPosts) {
      await this.feedRepo.save(this.feedRepo.create(post));
    }
  }
}
