import { Args, Command, PieceContext } from '@sapphire/framework';
import { SHA256 } from 'crypto-js';
import { Message, MessageEmbed } from 'discord.js';

export class SHA256Command extends Command {
	constructor(context: PieceContext) {
		super(context, {
			name: 'SHA256',
			description: 'Hash a string with SHA256.',
			detailedDescription: '{text}',
			preconditions: ['GuildOnly'],
		});
	}

	async run(message: Message, args: Args) {
		const str = await args.rest('string', { minimum: 1 });

		if (str) {
			const embed = new MessageEmbed()
				.setColor('#00df11')
				.setTitle('SHA256 hash')
				.addField('Input', str)
				.addField('Output', SHA256(str).toString());

			message.reply({ embeds: [embed] });
		}
	}
}
