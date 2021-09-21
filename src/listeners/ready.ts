import { Command, Events, Listener, ListenerOptions, PieceContext } from '@sapphire/framework';
import { red, green, magentaBright, blue, blueBright } from 'chalk';
import type { Client } from 'discord.js';

export class ReadyListener extends Listener<typeof Events.ClientReady> {
	public constructor(context: PieceContext, options?: ListenerOptions) {
		super(context, {
			...options,
			once: true,
		});
	}

	public run(client: Client) {
		client.logger.info(`Logged in as ${magentaBright(client.user?.tag)}.`);
		client.stores.get('commands').forEach((cmd: Command) => {
			client.logger.info(
				`Command ${blueBright(cmd.fullCategory)}/${blue(cmd.name)}: ${
					cmd.enabled ? green('enabled') : red('disabled')
				}`
			);
		});
	}
}
