import { Controller, Post, Body, Headers, HttpException, HttpStatus } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post('patreon')
  async handlePatreonWebhook(
    @Body() payload: any,
    @Headers('x-patreon-signature') signature: string,
  ) {
    // Verify webhook signature
    const isValid = this.webhooksService.verifyPatreonSignature(payload, signature);
    if (!isValid) {
      throw new HttpException('Invalid signature', HttpStatus.UNAUTHORIZED);
    }

    // Process the webhook event
    await this.webhooksService.processPatreonEvent(payload);

    return { received: true };
  }

  @Post('hoodpay')
  async handleHoodpayWebhook(
    @Body() payload: any,
    @Headers('x-hoodpay-signature') signature: string,
  ) {
    // Verify webhook signature
    const isValid = this.webhooksService.verifyHoodpaySignature(payload, signature);
    if (!isValid) {
      throw new HttpException('Invalid signature', HttpStatus.UNAUTHORIZED);
    }

    // Process the webhook event
    await this.webhooksService.processHoodpayEvent(payload);

    return { received: true };
  }
}
