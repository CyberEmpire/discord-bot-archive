import { Args, Command, container, PieceContext } from '@sapphire/framework';
import type { Message } from 'discord.js';
import type { MemberLevel } from '../../modules/leveling';

export class L8SFCommand extends Command {
	constructor(context: PieceContext) {
		super(context, {
			name: 'l8sf',
			description: 'His command. You can pass a number of days of inactivity as argument.',
			detailedDescription: '(Number)',
			requiredUserPermissions: ['MANAGE_MESSAGES'],
		});
	}

	async messageRun(message: Message, args: Args) {
		const lb = await container.modules.get('leveling').getLeaderboard();

		const inactivityDays = await args.pick('number').catch(() => 7);

		let inactivityThreshold = new Date();

		inactivityThreshold.setDate(inactivityThreshold.getDate() - inactivityDays);

		const inactive = lb.filter((l: MemberLevel) => {
			return l.updatedAt < inactivityThreshold;
		});

		let text = '**Inactive Members:**\n```';

		for (const l of inactive) {
			text += `${l.username} : ${l.level} : ${l.xp}\n`;
		}

		text += '```';

		await message.reply(text);
	}
}
