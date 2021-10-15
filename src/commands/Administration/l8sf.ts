import { Command, container, PieceContext } from '@sapphire/framework';
import type { Message } from 'discord.js';
import type { MemberLevel } from '../../modules/leveling';

export class L8SFCommand extends Command {
	constructor(context: PieceContext) {
		super(context, {
			name: 'l8sf',
			description: 'His command.',
			requiredUserPermissions: ['MANAGE_MESSAGES'],
		});
	}

	async run(message: Message) {
		const lb = await container.modules.get('leveling').getLeaderboard();

		const now = new Date();

		const inactive = lb.filter((l: MemberLevel) => {
			return l.updatedAt < now;
		});

		let text = '';

		for (const l of inactive) {
			text += `${l.username} : ${l.level} : ${l.xp}\n`;
		}

		await message.reply(text);
	}
}
