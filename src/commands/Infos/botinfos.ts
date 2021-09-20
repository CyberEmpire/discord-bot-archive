import { Command, PieceContext } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';

function getmemoryUsage(): string {
	const used =
		Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100;
	const total =
		Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) / 100;
	return `${used} / ${total} MB`;
}

export class BotInfosCommand extends Command {
	constructor(context: PieceContext) {
		super(context, {
			name: 'BotInfos',
			aliases: ['botinfo'],
			description: 'Display details about the bot.',
		});
	}

	async run(message: Message) {
		const owner = await message.client.users
			.fetch('191257958431195146')
			.catch(() => null);

		const embed = new MessageEmbed()
			.setColor('#00df11')
			.setTitle("Bot's Informations")
			.setDescription(
				'Cyber Empire is a hacking community that focuses on Cyber Security, Infosec, Hacking.'
			)
			.setThumbnail(message.client.user?.displayAvatarURL() ?? '')
			.addField(
				'__Users:__',
				`The total amount of users accessible is **${message.client.users.cache.size}**.`
			)
			.addField(
				'__Ping:__',
				`Discord API Latency: **${message.client.ws.ping}ms**.`
			)
			.addField('__RAM:__', `Memory used: **${getmemoryUsage()}**.`);

		if (owner) {
			embed.setFooter(
				`Owner: ${owner.tag} | Version ${process.env.npm_package_version}`,
				owner.displayAvatarURL()
			);
		}

		message.reply({ embeds: [embed] });
	}
}
