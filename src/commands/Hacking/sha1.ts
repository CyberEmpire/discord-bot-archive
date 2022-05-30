import { Args, Command, PieceContext } from '@sapphire/framework';
import { SHA1 } from 'crypto-js';
import { Message, MessageEmbed } from 'discord.js';

export class SHA1Command extends Command {
	constructor(context: PieceContext) {
		super(context, {
			name: 'SHA1',
			description: 'Hash a string with SHA1.',
			detailedDescription: '{text}',
		});
	}

	async messageRun(message: Message, args: Args) {
		const str = await args.rest('string', { minimum: 1 });

		if (str) {
			const embed = new MessageEmbed()
				.setColor('#00df11')
				.setTitle('SHA1 hash')
				.addField('Input', str)
				.addField('Output', SHA1(str).toString());

			message.reply({ embeds: [embed] });
		}
	}
}
