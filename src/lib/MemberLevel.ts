import { container } from '@sapphire/framework';
import { DataTypes, Model } from 'sequelize';

export class MemberLevel extends Model {}

/**
 * Represents a member's level.
 */
export interface MemberLevel {
	/**
	 * The member's user ID.
	 */
	id: string;

	/**
	 * The member's display name.
	 * This data is used to generate the leaderboard.
	 */
	username: string;

	/**
	 * The member's current experience.
	 */
	xp: number;

	/**
	 * The member's current level.
	 */
	level: number;

	/**
	 * The experience required to pass to the next level.
	 */
	nextLevelXP: number;

	/**
	 * The member's ranking relative to other members.
	 */
	rank: Promise<number>;
	createdAt: Date;
	updatedAt: Date;
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
			defaultValue: container.config.leveling.startXp,
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
			defaultValue: container.config.leveling.startLevel,
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

export async function makeLeaderboard(): Promise<Array<MemberLevel>> {
	const guild = await container.client.guilds.fetch(container.config.guild.id);
	const members = await guild.members.fetch();
	const leaderboard = (
		await container.database.query('SELECT * FROM MemberLevels ORDER BY level DESC, xp DESC')
	)[0] as MemberLevel[];
	return leaderboard.filter((m) => members.has(m.id));
}
