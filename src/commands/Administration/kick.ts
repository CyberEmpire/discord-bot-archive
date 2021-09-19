import { Args, Command, PieceContext } from '@sapphire/framework';
import { GuildMember, Message, MessageEmbed, User } from 'discord.js';

async function kickMember(member: GuildMember, reason: string) {
	if (member.kickable) {
		await member
			.send(
				`**You have been kicked from ${member.guild.name}. Reason: ${reason}**`
			)
			.catch(() => {});
		await member.kick(reason);
	}
}

function makeKickEmbed(
	author: User,
	member: GuildMember,
	reason: string
): MessageEmbed {
	const message = member.kickable
		? `**${member.user.tag} has been kicked.**`
		: `**${member.user.tag} couldn't be kicked.**`;

	const embed = new MessageEmbed()
		.setColor(member.kickable ? 'RED' : 'AQUA')
		.setAuthor(`Kicked by ${author.tag}`, author.displayAvatarURL())
		.setTitle(message)
		.setDescription(`**Reason:** ${reason}`)
		.setThumbnail(member.user.displayAvatarURL())
		.setTimestamp(Date.now());

	return embed;
}

class PingCommand extends Command {
	constructor(context: PieceContext) {
		super(context, {
			name: 'Kick',
			description: 'Kick members from your guild.',
			detailedDescription: '{[Members]} (Reason)',
			requiredClientPermissions: ['KICK_MEMBERS'],
			requiredUserPermissions: ['KICK_MEMBERS'],
		});
	}

	async run(message: Message, args: Args) {
		const members = await args.repeat('member');
		const reason = await args.rest('string').catch(() => 'No Reason');

		const embeds: MessageEmbed[] = [];

		for (const m of members) {
			embeds.push(makeKickEmbed(message.author, m, reason));
			await kickMember(m, reason);
		}

		message.reply({ embeds });
	}
}

export default PingCommand;
