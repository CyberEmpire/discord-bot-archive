import { Command, PieceContext } from '@sapphire/framework';
import type { Message } from 'discord.js';

export class DiceCommand extends Command {
	constructor(context: PieceContext) {
		super(context, {
			name: 'Dice',
			description: 'Roll your luck !',
		});
	}

	async run(message: Message) {
		const num = Math.round(Math.random() * 5 + 1);

		message.reply(`🎲 You rolled a **${num}** !`);
	}
}
