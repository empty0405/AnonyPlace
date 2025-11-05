import { WebhooksService } from './webhooks.service';
export declare class WebhooksController {
    private readonly webhooksService;
    constructor(webhooksService: WebhooksService);
    handlePatreonWebhook(payload: any, signature: string): Promise<{
        received: boolean;
    }>;
    handleHoodpayWebhook(payload: any, signature: string): Promise<{
        received: boolean;
    }>;
}
