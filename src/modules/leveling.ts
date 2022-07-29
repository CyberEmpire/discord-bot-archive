import { PieceContext, container } from '@sapphire/framework';
import { Module } from '../lib/Module';
import { MemberLevel, makeLeaderboard } from '../lib/MemberLevel';
import type { GuildMember, Message } from 'discord.js';
import { magenta, yellowBright } from 'chalk';

export class LevelingModule extends Module {
	/**
	 * Fetch the list of members ordered by ranking.
	 */
	getLeaderboard = makeLeaderboard;

	/**
	 * Fetch a member's level.
	 */
	async getMember(member: GuildMember): Promise<MemberLevel> {
		return (
			(await MemberLevel.findByPk(member.id)) ??
			(await MemberLevel.build({ id: member.id, username: member.user.username }).save())
		);
	}

	async onMessage(message: Message): Promise<void> {
		if (message.member && !message.author.bot) {
			const { minXp, maxXp, xpMultiplier } = container.config.leveling;
			const memberLevel = await this.getMember(message.member);
			const baseLevel = memberLevel.level;

			memberLevel.xp += Math.ceil(minXp + Math.random() * (maxXp - minXp)) * xpMultiplier;

			await memberLevel.save();

			// Level UP
			if (memberLevel.level > baseLevel) {
				container.logger.info(
					`${magenta(message.author.tag)} is now level ${yellowBright(memberLevel.level)}`
				);
				const card = await container.modules.get('level-card').makeCard(message.member);

				message.channel.send({
					content: `GG ${message.author} ! You are now **level ${memberLevel.level}** !`,
					files: [card.createPNGStream()],
				});
			}
		}
	}

	override async onLoad() {
		await MemberLevel.sync();
		container.client.on('messageCreate', this.onMessage.bind(this));
	}

	constructor(context: PieceContext) {
		super(context);
	}
}

declare module '../lib/ModuleStore' {
	interface ModuleStoreEntries {
		leveling: LevelingModule;
	}
}
