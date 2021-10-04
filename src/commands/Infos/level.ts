import { Args, Command, PieceContext, container } from '@sapphire/framework';
import type { GuildMember, Message } from 'discord.js';

export class LevelCommand extends Command {
	constructor(context: PieceContext) {
		super(context, {
			name: 'Level',
			aliases: ['lvl'],
			description: "Display detailled information about someone's level.",
			detailedDescription: '(Member)',
		});
	}

	async run(message: Message, args: Args) {
		if (!message.member) return;
		const member = (await args.pick('member').catch(() => message.member)) as GuildMember;
		const ml = await container.modules.get('leveling').getMember(member);
		message.reply(`${member} is level **${ml.level}** with **${ml.xp}** XP`);
	}
}
