import { Args, Command, PieceContext } from '@sapphire/framework';
import { SHA384 } from 'crypto-js';
import { Message, MessageEmbed } from 'discord.js';

export class SHA384Command extends Command {
	constructor(context: PieceContext) {
		super(context, {
			name: 'SHA384',
			description: 'Hash a string with SHA384.',
			detailedDescription: '{text}',
			preconditions: ['GuildOnly'],
		});
	}

	async run(message: Message, args: Args) {
		const str = await args.rest('string', { minimum: 1 });

		if (str) {
			const embed = new MessageEmbed()
				.setColor('#00df11')
				.setTitle('SHA384 hash')
				.addField('Input', str)
				.addField('Output', SHA384(str).toString());

			message.reply({ embeds: [embed] });
		}
	}
}
