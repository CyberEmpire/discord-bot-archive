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

		let now = new Date();
		now.setDate(now.getDate() - 7); // users that are inactive for seven days in a row
		
		const inactive = lb.filter((l: MemberLevel) => {
			return l.updatedAt < now;
		});
		
		function delay(ms: number) {
		    return new Promise( resolve => setTimeout(resolve, ms) );
		}
		

		for (const l of inactive) {
			
			message.reply(`${l.id} : ${l.username} : ${l.level} : ${l.xp}\n`); // each user that is inactive for 7 days gets send
			await delay(1000); // might add sleep() if await correct
		}
		
		if (inactive.length === 0) message.reply(`All users active`);
		
		return;
	}
}
