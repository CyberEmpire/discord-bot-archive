import { Events, Listener, ListenerOptions, PieceContext } from '@sapphire/framework';
import { yellow } from 'chalk';
import type { RateLimitData } from 'discord.js';

export class RateLimitListener extends Listener<typeof Events.RateLimit> {
	public constructor(context: PieceContext, options?: ListenerOptions) {
		super(context, {
			...options,
			once: true,
		});
	}

	public run(data: RateLimitData) {
		const message = `The client hit a ${data.global ? 'global' : ''} rate limit on ${yellow(
			data.method
		)} ${yellow(data.route)}. Limit: ${yellow(data.limit)}. Timeout: ${yellow(data.timeout)}ms.`;
		this.container.client.logger.warn(message);
	}
}
