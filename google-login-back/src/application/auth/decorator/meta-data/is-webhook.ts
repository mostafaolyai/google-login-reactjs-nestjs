import { SetMetadata } from '@nestjs/common';

export const IS_WEBHOOK = 'is-webhook';

/**
 * Marks the API as a public API that does not need any checking for permission
 * @constructor
 */
export const IsWebhook = () => SetMetadata(IS_WEBHOOK, true);
