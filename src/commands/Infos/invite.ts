import { Command, PieceContext } from '@sapphire/framework';
import type { Message } from 'discord.js';

export class InviteCommand extends Command {
	constructor(context: PieceContext) {
		super(context, {
			name: 'Invite',
			aliases: ['inv'],
			description: "Get the server's invitation link.",
		});
	}

	async run(message: Message) {
		message.reply(
			"Here's Cyber Empire's invite link: https://discord.gg/wKJaE9C"
		);
	}
}
