import { Command, PieceContext } from '@sapphire/framework';
import type { Message } from 'discord.js';

export class YoutubeCommand extends Command {
	constructor(context: PieceContext) {
		super(context, {
			name: 'Youtube',
			description: 'Follow us on social medias !',
		});
	}

	async messageRun(message: Message) {
		message.reply(
			'▶️ Visit our awesome Youtube chanel https://www.youtube.com/channel/UCVn_9X30syB8Qbhd6eUXTDA'
		);
	}
}
