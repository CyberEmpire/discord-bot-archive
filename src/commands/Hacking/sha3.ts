import { Args, Command, PieceContext } from '@sapphire/framework';
import { SHA3 } from 'crypto-js';
import { Message, MessageEmbed } from 'discord.js';

export class SHA3Command extends Command {
	constructor(context: PieceContext) {
		super(context, {
			name: 'SHA3',
			description: 'Hash a string with SHA3.',
			detailedDescription: '{text}',
			preconditions: ['GuildOnly'],
		});
	}

	async messageRun(message: Message, args: Args) {
		const str = await args.rest('string', { minimum: 1 });

		if (str) {
			const embed = new MessageEmbed()
				.setColor('#00df11')
				.setTitle('SHA3 hash')
				.addField('Input', str)
				.addField('Output', SHA3(str).toString());

			message.reply({ embeds: [embed] });
		}
	}
}
