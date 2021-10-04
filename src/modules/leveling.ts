import { DataTypes, Model } from 'sequelize';
import { PieceContext, container } from '@sapphire/framework';
import { Module } from '../lib/Module';
import type { GuildMember } from 'discord.js';

class MemberLevel extends Model {}

interface MemberLevel {
	id: string;
	username: string;
	xp: number;
	level: number;
	nextLevelXP: number;
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
			defaultValue: 0,
			set(val: number) {
				const cap = this.nextLevelXP;
				if (val < cap) {
					this.setDataValue('xp', val);
				} else {
					this.level += 1;
					// LVL UP
					this.xp = val - cap;
				}
			},
		},
		level: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 1,
		},
	},
	{
		sequelize: container.database,
		modelName: 'MemberLevel',
		getterMethods: {
			nextLevelXP() {
				return Math.floor(500 + 500 * 0.4 * this.level);
			},
		},
	}
);

export class LevelingModule extends Module {
	async getMember(member: GuildMember): Promise<MemberLevel> {
		return (
			(await MemberLevel.findByPk(member.id)) ??
			(await MemberLevel.build({ id: member.id, username: member.user.username }).save())
		);
	}

	override async clientReady() {
		const guild = await container.client.guilds.fetch('881612001720283208');
		const members = await guild.members.fetch();

		members.forEach(async (member) => {
			const ml = await this.getMember(member);
			container.logger.debug(ml.id);
			ml.username = member.user.username;
			console.log(ml.nextLevelXP);
			ml.save();
		});
	}

	override async onLoad() {
		await MemberLevel.sync();
		this.container.client.on('message', async (message) => {
			if (message.member && !message.author.bot) {
				const ml = await this.getMember(message.member);
				const lvl = ml.level;
				ml.xp += 3000;
				if (ml.level > lvl) message.reply('GG');
				ml.save();
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
