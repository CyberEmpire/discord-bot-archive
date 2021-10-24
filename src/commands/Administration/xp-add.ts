import { Args, Command, container, PieceContext } from '@sapphire/framework';
import { magenta, yellow } from 'chalk';
import type { Message } from 'discord.js';

export class XPAddCommand extends Command {
	constructor(context: PieceContext) {
		super(context, {
			name: 'XP-Add',
			description: 'Add/reduce XP of a member.',
			detailedDescription: '{Member} {Number}',
			requiredUserPermissions: ['MANAGE_MESSAGES'],
		});
	}

	async run(message: Message, args: Args) {
		const member = await args.pick('member');
		const amount = await args.pick('number');

		const ml = await container.modules.get('leveling').getMember(member);

		ml.xp += amount;

		await ml.save();

		message.reply(`Added **${amount} XP** to ${member}.`);
		this.container.logger.info(
			`${magenta(message.author.tag)} added ${yellow(amount)} XP to ${magenta(member.user.tag)}.`
		);
	}
}
