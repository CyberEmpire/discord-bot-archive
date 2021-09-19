import { Listener, ListenerOptions, PieceContext } from '@sapphire/framework';
import { magentaBright } from 'chalk';
import type { Client } from 'discord.js';

export class ReadyListener extends Listener {
	public constructor(context: PieceContext, options?: ListenerOptions) {
		super(context, {
			...options,
			once: true,
		});
	}

	public run(client: Client) {
		client.logger.info(`Logged in as ${magentaBright(client.user?.tag)}.`);
	}
}
