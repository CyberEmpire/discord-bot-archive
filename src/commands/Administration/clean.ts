import { Args, Command, PieceContext } from '@sapphire/framework';
import type { BaseGuildTextChannel, Message } from 'discord.js';

export class CleanCommand extends Command {
	constructor(context: PieceContext) {
		super(context, {
			name: 'Clean',
			description: 'Clean X amount of messages.',
			detailedDescription: '{Number}',
			requiredClientPermissions: ['MANAGE_MESSAGES'],
			requiredUserPermissions: ['MANAGE_MESSAGES'],
		});
	}

	async run(message: Message, args: Args) {
		let amount = await args.pick('number');

		amount = Math.min(1000, Math.max(1, amount));

		await (message.channel as BaseGuildTextChannel).bulkDelete(amount);

		const msg = await message.channel.send(`🧹 Cleaned ${amount} messages.`);
		setTimeout(() => {
			msg.delete();
		}, 3000);
	}
}
