import { DataTypes, Model } from 'sequelize';
import { PieceContext, container } from '@sapphire/framework';
import { Module } from '../lib/Module';
import type { GuildMember } from 'discord.js';
import { magenta, yellowBright } from 'chalk';

const conf = container.config.leveling;

export class MemberLevel extends Model {}

export interface MemberLevel {
	id: string;
	username: string;
	xp: number;
	level: number;
	nextLevelXP: number;
	rank: Promise<number>;
}

MemberLevel.init(
	{
		id: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true,
		},
		username: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		xp: {
			type: DataTypes.BIGINT,
			allowNull: false,
			defaultValue: conf.startXp,
			set(val: number) {
				const cap = this.nextLevelXP;
				if (val < cap) {
					this.setDataValue('xp', val);
				} else if (val >= 0) {
					this.level += 1;
					this.xp = val - cap;
				} else {
					this.level -= 1;
					this.xp = this.nextLevelXP + val;
				}
			},
		},
		level: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: conf.startLevel,
		},
	},
	{
		sequelize: container.database,
		modelName: 'MemberLevel',
		getterMethods: {
			nextLevelXP() {
				return Math.floor(500 + 500 * 0.4 * this.level);
			},
			async rank(): Promise<number> {
				const leaderboard = await makeLeaderboard();
				return leaderboard.findIndex((m) => m.id === this.id) + 1;
			},
		},
	}
);

async function makeLeaderboard(): Promise<Array<MemberLevel>> {
	const guild = await container.client.guilds.fetch(container.config.guild.id);
	const members = await guild.members.fetch();
	const leaderboard = (
		await container.database.query('SELECT * FROM MemberLevels ORDER BY level DESC, xp DESC')
	)[0] as MemberLevel[];
	return leaderboard.filter((m) => members.has(m.id));
}



async function getMemberCorpses(): Promise<Array<MemberLevel>> {
	var today = new Date();
	var dd = String(today.getDate()).padStart(2, '0');
	var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
	var yyyy = today.getFullYear();
	const guild = await container.client.guilds.fetch(container.config.guild.id);
	const members = await guild.members.fetch();
	const corpses = (
		await container.database.query('SELECT * FROM MemberLevels WHERE last_update < DATEADD(day, -14, GETDATE())');
	)[0] as MemberLevel[];
	return corpses;
}

// Put corpses in #logs via command or whatever

export class LevelingModule extends Module {
	getLeaderboard = makeLeaderboard;

	async getMember(member: GuildMember): Promise<MemberLevel> {
		return (
			(await MemberLevel.findByPk(member.id)) ??
			(await MemberLevel.build({ id: member.id, username: member.user.username }).save())
		);
	}

	override async clientReady() {
		const guild = await container.client.guilds.fetch(container.config.guild.id);
		const members = await guild.members.fetch();

		members.forEach(async (member) => {
			const ml = await this.getMember(member);
			ml.username = member.user.username;
			ml.save();
		});
	}

	override async onLoad() {
		await MemberLevel.sync();
		container.client.on('message', async (message) => {
			if (message.member && !message.author.bot) {
				const ml = await this.getMember(message.member);
				const lvl = ml.level;

				ml.xp +=
					Math.ceil(conf.minXp + Math.random() * (conf.maxXp - conf.minXp)) * conf.xpMultiplier;

				// Level UP

				await ml.save();
				if (ml.level > lvl) {
					container.logger.info(
						`${magenta(message.author.tag)} is now level ${yellowBright(ml.level)}`
					);
					const card = await container.modules.get('level-card').makeCard(message.member);
					message.channel.send({
						content: `GG ${message.author} ! You are now **level ${ml.level}** !`,
						files: [card.createPNGStream()],
					});
				}
			}
		});
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
