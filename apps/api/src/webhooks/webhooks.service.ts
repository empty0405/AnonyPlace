import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class WebhooksService {
  constructor(private prisma: PrismaService) {}

  verifyPatreonSignature(payload: any, signature: string): boolean {
    const secret = process.env.PATREON_WEBHOOK_SECRET;
    if (!secret) return false;

    const hash = crypto
      .createHmac('md5', secret)
      .update(JSON.stringify(payload))
      .digest('hex');

    return hash === signature;
  }

  verifyHoodpaySignature(payload: any, signature: string): boolean {
    const secret = process.env.HOODPAY_WEBHOOK_SECRET;
    if (!secret) return false;

    const hash = crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(payload))
      .digest('hex');

    return signature === hash;
  }

  async processPatreonEvent(payload: any) {
    const { data, included } = payload;

    if (!data) return;

    const eventType = data.type;
    const userId = data.relationships?.user?.data?.id;

    if (!userId) return;

    // Find user by patreonId
    const user = await this.prisma.user.findUnique({
      where: { patreonId: userId },
    });

    if (!user) return;

    switch (eventType) {
      case 'members:pledge:create':
      case 'members:pledge:update':
        await this.handleMembershipUpdate(user.id, data, included);
        break;

      case 'members:pledge:delete':
        await this.handleMembershipDelete(user.id);
        break;
    }
  }

  private async handleMembershipUpdate(userId: string, data: any, included: any[]) {
    // Extract tier information from Patreon webhook
    const tierId = data.relationships?.currently_entitled_tiers?.data?.[0]?.id;
    
    if (!tierId) return;

    // Find the tier in our database
    const tier = await this.prisma.tier.findFirst({
      where: { externalTierId: tierId },
    });

    if (!tier) return;

    // Update or create membership
    const existing = await this.prisma.membership.findFirst({
      where: {
        userId,
        tierId: tier.id,
      },
    });

    if (!existing) {
      await this.prisma.membership.create({
        data: {
          userId,
          creatorId: tier.creatorId,
          tierId: tier.id,
          status: 'ACTIVE',
        },
      });
    } else {
      await this.prisma.membership.update({
        where: { id: existing.id },
        data: {
          status: 'ACTIVE',
        },
      });
    }
  }

  private async handleMembershipDelete(userId: string) {
    // Deactivate user's memberships when they cancel subscription
    await this.prisma.membership.updateMany({
      where: { userId },
      data: {
        status: 'CANCELLED',
        expiresAt: new Date(),
      },
    });
  }

  async processHoodpayEvent(payload: any) {
    const { event, data } = payload;

    switch (event) {
      case 'payment.success':
        await this.handleHoodpayPayment(data);
        break;

      case 'subscription.updated':
      case 'subscription.cancelled':
        await this.handleHoodpaySubscription(data);
        break;
    }
  }

  private async handleHoodpayPayment(data: any) {
    const { customer_email, product_id, amount } = data;

    // Find user by email
    const user = await this.prisma.user.findUnique({
      where: { email: customer_email },
    });

    if (!user) return;

    // We need creatorId, skip for now if not provided
    // In production, you would parse product_id to get creatorId
    // For now, just log the payment was received
    console.log('Hoodpay payment received:', { customer_email, product_id, amount });
  }

  private async handleHoodpaySubscription(data: any) {
    const { customer_email, subscription_id, status } = data;

    // Find user by email
    const user = await this.prisma.user.findUnique({
      where: { email: customer_email },
    });

    if (!user) return;

    // Update subscription status
    if (status === 'cancelled') {
      await this.prisma.membership.updateMany({
        where: { userId: user.id },
        data: {
          status: 'CANCELLED',
          expiresAt: new Date(),
        },
      });
    }
  }
}
