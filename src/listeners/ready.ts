import { Command, Events, Listener, ListenerOptions, PieceContext } from '@sapphire/framework';
import { red, green, magentaBright, blue, blueBright } from 'chalk';
import type { Client } from 'discord.js';
import type { Module } from '../lib/Module';

export class ReadyListener extends Listener<typeof Events.ClientReady> {
	public constructor(context: PieceContext, options?: ListenerOptions) {
		super(context, {
			...options,
			once: true,
		});
	}

	public run(client: Client) {
		client.logger.info(`Logged in as ${magentaBright(client.user?.tag)}.`);
		client.logger.info('BOT READY');
		client.stores.get('commands').forEach((cmd: Command) => {
			client.logger.info(
				`Command ${blueBright(cmd.fullCategory)}/${blue(cmd.name)}: ${
					cmd.enabled ? green('enabled') : red('disabled')
				}`
			);
		});
		client.stores.get('modules').forEach((mod: Module) => {
			client.logger.info(
				`Module ${blue(mod.name)}: ${mod.enabled ? green('enabled') : red('disabled')}`
			);
		});
	}
}
