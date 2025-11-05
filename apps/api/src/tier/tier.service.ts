import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TierService {
  constructor(private prisma: PrismaService) {}

  async getTiersByCreatorId(creatorId: string) {
    return this.prisma.tier.findMany({
      where: { creatorId },
      orderBy: { level: 'asc' },
    });
  }

  async createTier(createDto: any) {
    const { creatorId, name, level, externalTierId } = createDto;

    return this.prisma.tier.create({
      data: {
        creatorId,
        name,
        level: level || 1,
        externalTierId,
      },
      include: {
        creator: true,
      },
    });
  }

  async getTierById(id: string) {
    const tier = await this.prisma.tier.findUnique({
      where: { id },
      include: {
        creator: true,
      },
    });

    if (!tier) {
      throw new NotFoundException('Tier not found');
    }

    return tier;
  }

  async updateTier(id: string, updateDto: any) {
    return this.prisma.tier.update({
      where: { id },
      data: updateDto,
    });
  }

  async deleteTier(id: string) {
    return this.prisma.tier.delete({
      where: { id },
    });
  }

  async getCreatorById(id: string) {
    const creator = await this.prisma.creator.findUnique({
      where: { id },
    });

    if (!creator) {
      throw new NotFoundException('Creator not found');
    }

    return creator;
  }
}
