import { Args, Command, PieceContext } from '@sapphire/framework';
import { GuildMember, Message, MessageEmbed, User } from 'discord.js';

async function banMember(member: GuildMember, reason: string) {
	if (member.bannable) {
		await member
			.send(`**You have been banned from ${member.guild.name}. Reason: ${reason}**`)
			.catch(() => {});
		await member.ban({ reason, days: 1 });
	}
}

function makeBanEmbed(author: User, member: GuildMember, reason: string): MessageEmbed {
	const message = member.bannable
		? `**${member.user.tag} has been banned.**`
		: `**${member.user.tag} couldn't be banned.**`;

	const embed = new MessageEmbed()
		.setColor(member.bannable ? 'RED' : 'AQUA')
		.setAuthor(`Banned by ${author.tag}`, author.displayAvatarURL())
		.setTitle(message)
		.setDescription(`**Reason:** ${reason}`)
		.setThumbnail(member.user.displayAvatarURL())
		.setTimestamp(Date.now());

	return embed;
}

export class BanCommand extends Command {
	constructor(context: PieceContext) {
		super(context, {
			name: 'Ban',
			description: 'Ban members from your guild.',
			detailedDescription: '{[Members]} (Reason)',
			requiredClientPermissions: ['BAN_MEMBERS'],
			requiredUserPermissions: ['BAN_MEMBERS'],
		});
	}

	async run(message: Message, args: Args) {
		const members = await args.repeat('member');
		const reason = await args.rest('string').catch(() => 'No Reason');

		const embeds: MessageEmbed[] = [];

		for (const m of members) {
			embeds.push(makeBanEmbed(message.author, m, reason));
			await banMember(m, reason);
		}

		message.reply({ embeds });
	}
}
