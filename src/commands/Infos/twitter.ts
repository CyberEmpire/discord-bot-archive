import { Command, PieceContext } from '@sapphire/framework';
import type { Message } from 'discord.js';

export class TwitterCommand extends Command {
	constructor(context: PieceContext) {
		super(context, {
			name: 'Twitter',
			description: 'Follow us on social medias !',
		});
	}

	async messageRun(message: Message) {
		message.reply('▶️ Visit our awesome Twitter page https://twitter.com/TheCyberEmpire');
	}
}
