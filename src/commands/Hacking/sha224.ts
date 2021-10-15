import { Args, Command, PieceContext } from '@sapphire/framework';
import { SHA224 } from 'crypto-js';
import { Message, MessageEmbed } from 'discord.js';

export class SHA224Command extends Command {
	constructor(context: PieceContext) {
		super(context, {
			name: 'SHA224',
			description: 'Hash a string with SHA224.',
			detailedDescription: '{text}',
			preconditions: ['GuildOnly'],
		});
	}

	async run(message: Message, args: Args) {
		const str = await args.rest('string', { minimum: 1 });

		if (str) {
			const embed = new MessageEmbed()
				.setColor('#00df11')
				.setTitle('SHA224 hash')
				.addField('Input', str)
				.addField('Output', SHA224(str).toString());

			message.reply({ embeds: [embed] });
		}
	}
}
