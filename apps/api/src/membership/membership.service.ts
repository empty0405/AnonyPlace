import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MembershipService {
  constructor(private prisma: PrismaService) {}

  async getUserMemberships(userId: string) {
    return this.prisma.membership.findMany({
      where: {
        userId,
        status: 'ACTIVE',
        expiresAt: {
          gte: new Date(),
        },
      },
      include: {
        creator: {
          select: {
            id: true,
            displayName: true,
          },
        },
        tier: {
          select: {
            id: true,
            name: true,
            level: true,
          },
        },
      },
    });
  }

  async createMembership(userId: string, creatorId: string, tierId: string) {
    // Check if tier belongs to creator
    const tier = await this.prisma.tier.findFirst({
      where: {
        id: tierId,
        creatorId,
      },
    });

    if (!tier) {
      throw new NotFoundException('Tier not found for this creator');
    }

    // Check if user already has active membership
    const existing = await this.prisma.membership.findFirst({
      where: {
        userId,
        creatorId,
        status: 'ACTIVE',
        expiresAt: {
          gte: new Date(),
        },
      },
    });

    if (existing) {
      throw new ForbiddenException('Already subscribed to this creator');
    }

    // Create membership (expires in 30 days)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    return this.prisma.membership.create({
      data: {
        userId,
        creatorId,
        tierId,
        status: 'ACTIVE',
        expiresAt,
      },
      include: {
        creator: {
          select: {
            id: true,
            displayName: true,
          },
        },
        tier: {
          select: {
            id: true,
            name: true,
            level: true,
          },
        },
      },
    });
  }

  async cancelMembership(membershipId: string, userId: string) {
    const membership = await this.prisma.membership.findUnique({
      where: { id: membershipId },
    });

    if (!membership) {
      throw new NotFoundException('Membership not found');
    }

    if (membership.userId !== userId) {
      throw new ForbiddenException('Not authorized to cancel this membership');
    }

    return this.prisma.membership.update({
      where: { id: membershipId },
      data: { status: 'CANCELLED' },
    });
  }
}
