import { Args, Command, PieceContext } from '@sapphire/framework';
import { GuildMember, Message, MessageEmbed } from 'discord.js';

function niceTime(date: Date): string {
	return `[${date.getFullYear()}/${date.getMonth()}/${date.getDate()}] ${date.getHours()}:${date.getMinutes()}`;
}

export class UserInfosCommand extends Command {
	constructor(context: PieceContext) {
		super(context, {
			name: 'UserInfos',
			aliases: ['userinfo', 'memberinfo', 'memberinfos'],
			description: 'Display details about a user.',
			runIn: ['GUILD_ANY'],
		});
	}

	async run(message: Message, args: Args) {
		if (message.member) {
			const member: GuildMember = (await args
				.pick('member')
				.catch(() => message.member)) as GuildMember;

			const embed = new MessageEmbed()
				.setColor(member.displayHexColor)
				.setTitle(member.user.tag)
				.setThumbnail(member.user.displayAvatarURL())
				.addField('Guild Name:', member.displayName, true)
				.addField('User ID:', member.user.id, true)
				.addField('Account Creation:', niceTime(member.user.createdAt))
				.addField('Member Since', niceTime(member.joinedAt ?? new Date()))
				.addField('Roles:', member.roles.cache.map((role) => role.toString()).join(' '));

			message.reply({ embeds: [embed] });
		}
	}
}
