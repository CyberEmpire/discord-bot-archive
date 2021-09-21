import { Command, PieceContext } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';

function niceTime(date: Date): string {
	return `[${date.getFullYear()}/${date.getMonth()}/${date.getDate()}] ${date.getHours()}:${date.getMinutes()}`;
}

export class GuildInfosCommand extends Command {
	constructor(context: PieceContext) {
		super(context, {
			name: 'GuildInfos',
			aliases: ['guildinfo', 'serverinfo', 'serverinfos'],
			description: 'Display details about the current guild.',
			runIn: ['GUILD_ANY'],
		});
	}

	async run(message: Message) {
		if (message.guild) {
			const owner = await message.guild.fetchOwner();

			const embed = new MessageEmbed()
				.setColor('#00df11')
				.setAuthor(`Creator: ${owner.user.tag}`, owner.user.displayAvatarURL())
				.setTitle(message.guild.name)
				.setDescription(`Guild ID: **${message.guildId}**`)
				.setThumbnail(message.guild.iconURL() ?? '')
				.addField('__Members Count:__', message.guild.memberCount.toString())
				.addField(
					'__Boost Tier:__',
					`${message.guild.premiumTier} (${message.guild.premiumSubscriptionCount})`
				)
				.addField('__Creation Date:__', niceTime(message.guild.createdAt))
				.addField('__System channel:__', message.guild.systemChannel?.toString() ?? 'None');

			message.reply({ embeds: [embed] });
		}
	}
}
