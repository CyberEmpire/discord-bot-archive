import { Command, PieceContext } from '@sapphire/framework';
import type { Message } from 'discord.js';

export class WebsiteCommand extends Command {
	constructor(context: PieceContext) {
		super(context, {
			name: 'Website',
			description: 'Follow us on scoial medias !',
		});
	}

	async messageRun(message: Message) {
		message.reply('https://thecyberempire.com/');
	}
}
