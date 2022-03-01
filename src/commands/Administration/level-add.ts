import { Args, Command, container, PieceContext } from '@sapphire/framework';
import { magenta, yellow } from 'chalk';
import type { Message } from 'discord.js';

export class LevelAddCommand extends Command {
	constructor(context: PieceContext) {
		super(context, {
			name: 'Level-Add',
			aliases: ['lvl-add'],
			description: 'Add/reduce the level of a member.',
			detailedDescription: '{Member} {Number}',
			requiredUserPermissions: ['MANAGE_MESSAGES'],
		});
	}

	async messageRun(message: Message, args: Args) {
		const member = await args.pick('member');
		const amount = await args.pick('number');

		const ml = await container.modules.get('leveling').getMember(member);

		ml.level += amount;

		await ml.save();

		message.reply(`Added **${amount} Levels** to ${member}.`);
		this.container.logger.info(
			`${magenta(message.author.tag)} added ${yellow(amount)} levels to ${magenta(
				member.user.tag
			)}.`
		);
	}
}
