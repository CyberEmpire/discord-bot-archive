import { Args, Command, PieceContext } from '@sapphire/framework';
import { MD5 } from 'crypto-js';
import { Message, MessageEmbed } from 'discord.js';

export class MD5Command extends Command {
	constructor(context: PieceContext) {
		super(context, {
			name: 'MD5',
			description: 'Hash a string with MD5.',
			detailedDescription: '{text}',
		});
	}

	async messageRun(message: Message, args: Args) {
		const str = await args.rest('string', { minimum: 1 });

		if (str) {
			const embed = new MessageEmbed()
				.setColor('#00df11')
				.setTitle('MD5 hash')
				.addField('Input', str)
				.addField('Output', MD5(str).toString());

			message.reply({ embeds: [embed] });
		}
	}
}
