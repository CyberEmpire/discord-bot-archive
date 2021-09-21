import { Args, Command, PieceContext } from '@sapphire/framework';
import { Message, MessageEmbed, User } from 'discord.js';

function makeUnbanEmbed(author: User, user: User, reason: string, worked: boolean): MessageEmbed {
	const message = worked ? `**${user.tag} has been unbanned.**` : `**${user.tag} isn't banned.**`;

	const embed = new MessageEmbed()
		.setColor(worked ? 'GREEN' : 'YELLOW')
		.setAuthor(`Unbanned by ${author.tag}`, author.displayAvatarURL())
		.setTitle(message)
		.setDescription(`**Reason:** ${reason}`)
		.setThumbnail(user.displayAvatarURL())
		.setTimestamp(Date.now());

	return embed;
}

export class UnbanCommand extends Command {
	constructor(context: PieceContext) {
		super(context, {
			name: 'Unban',
			description: 'Unban members from your guild.',
			detailedDescription: '{[Members]} (Reason)',
			requiredClientPermissions: ['BAN_MEMBERS'],
			requiredUserPermissions: ['BAN_MEMBERS'],
		});
	}

	async run(message: Message, args: Args) {
		const users = await args.repeat('user');
		const reason = await args.rest('string').catch(() => 'No Reason');

		const embeds: MessageEmbed[] = [];

		for (const u of users) {
			if (await message.guild?.bans.fetch(u).catch(() => false)) {
				embeds.push(makeUnbanEmbed(message.author, u, reason, true));
				await message.guild?.members.unban(u);
			} else {
				embeds.push(makeUnbanEmbed(message.author, u, reason, false));
			}
		}

		message.reply({ embeds });
	}
}
