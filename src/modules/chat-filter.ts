import { PieceContext, PieceOptions, container } from '@sapphire/framework';
import { magenta } from 'chalk';
import type { Message } from 'discord.js';
import { Module } from '../lib/Module';

const inviteRegex = /(https|http)?:?\/?\/?discord.gg.*\/?.*[a-zA-Z0-9]+/g;

export class ChatFilterModule extends Module {
	public async filterAdvertising(msg: Message): Promise<void> {
		if (msg.content.match(inviteRegex)) {
			await msg.delete();
			await msg.channel.send(`${msg.author} You are not allowed to advertise on this server !`);
			msg.member?.disableCommunicationUntil(Date.now() + 1 * 60 * 1000, 'Tried to advertise');
			container.client.logger.warn(`${magenta(msg.author.tag)} tried to advertise !`);
		}
	}

	public async filterMessage(msg: Message): Promise<void> {
		if (msg.channel.type !== 'GUILD_TEXT' && msg.channel.type !== 'GUILD_PUBLIC_THREAD') return;
		if (msg.author.id === container.client.id) return;
		if (msg?.member?.permissions.has('MANAGE_MESSAGES')) return;

		await this.filterAdvertising(msg);
	}

	public override async onLoad() {
		container.client.on('messageCreate', this.filterMessage.bind(this));
	}

	constructor(context: PieceContext, options: PieceOptions) {
		super(context, {
			...options,
		});
	}
}

declare module '../lib/ModuleStore' {
	interface ModuleStoreEntries {
		chatFilter: ChatFilterModule;
	}
}
