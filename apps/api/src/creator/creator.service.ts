import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CreatorService {
  constructor(private prisma: PrismaService) {}

  async getAllCreators() {
    return this.prisma.creator.findMany({
      include: {
        _count: {
          select: { posts: true },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async createCreator(userId: string, createDto: any) {
    const { displayName, bio, links, isAdult } = createDto;

    // Check if creator profile already exists
    const existingCreator = await this.prisma.creator.findUnique({
      where: { userId },
    });

    if (existingCreator) {
      throw new ConflictException('Creator profile already exists for this user');
    }

    // Create creator profile and update user role in a transaction
    return this.prisma.$transaction(async (tx) => {
      // Create the creator profile
      const creator = await tx.creator.create({
        data: {
          displayName,
          bio,
          links,
          isAdult: isAdult || false,
          user: {
            connect: {
              id: userId,
            },
          },
        },
        include: {
          user: {
            select: {
              email: true,
              patreonId: true,
            },
          },
        },
      });

      // Update user role to CREATOR
      await tx.user.update({
        where: { id: userId },
        data: { role: 'CREATOR' },
      });

      return creator;
    });
  }

  async getCreatorById(id: string) {
    const creator = await this.prisma.creator.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            email: true,
            patreonId: true,
          },
        },
        tiers: {
          orderBy: { level: 'asc' },
        },
      },
    });

    if (!creator) {
      throw new NotFoundException('Creator not found');
    }

    return creator;
  }

  async getCreatorByUserId(userId: string) {
    return this.prisma.creator.findUnique({
      where: { userId },
    });
  }

  async updateCreator(id: string, updateDto: any) {
    return this.prisma.creator.update({
      where: { id },
      data: updateDto,
    });
  }

  async getCreatorTiers(creatorId: string) {
    return this.prisma.tier.findMany({
      where: { creatorId },
      orderBy: { level: 'asc' },
    });
  }

  async getCreatorPosts(creatorId: string, userId?: string) {
    // Get user's active memberships if authenticated
    let userMemberships = [];
    if (userId) {
      userMemberships = await this.prisma.membership.findMany({
        where: {
          userId,
          status: 'ACTIVE',
        },
        include: {
          tier: true,
        },
      });
    }

    // Get posts
    const posts = await this.prisma.post.findMany({
      where: { creatorId },
      include: {
        tiers: true,
        assets: true,
      },
      orderBy: { created_at: 'desc' },
    });

    // Filter posts based on user's memberships
    return posts.map(post => {
      const postTierIds = post.tiers.map(t => t.id);
      const hasAccess = 
        post.visibility === 'PUBLIC' || 
        postTierIds.length === 0 ||
        userMemberships.some(m => postTierIds.includes(m.tierId));
      
      return {
        ...post,
        hasAccess,
        // Hide assets if user doesn't have access
        assets: hasAccess ? post.assets : [],
      };
    });
  }
}
