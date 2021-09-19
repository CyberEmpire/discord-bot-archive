import { Args, Command, PieceContext } from '@sapphire/framework';
import { Message, MessageEmbed, User } from 'discord.js';

function makeUnbanEmbed(
	author: User,
	user: User,
	reason: string
): MessageEmbed {
	const embed = new MessageEmbed()
		.setColor('GREEN')
		.setAuthor(`Unbanned by ${author.tag}`, author.displayAvatarURL())
		.setTitle(`**${user.tag} has been unbanned.**`)
		.setDescription(`**Reason:** ${reason}`)
		.setThumbnail(user.displayAvatarURL())
		.setTimestamp(Date.now());

	return embed;
}

class PingCommand extends Command {
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
			embeds.push(makeUnbanEmbed(message.author, u, reason));
			await message.guild?.members.unban(u);
		}

		message.reply({ embeds });
	}
}

export default PingCommand;
