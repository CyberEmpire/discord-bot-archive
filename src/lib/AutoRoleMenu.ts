import { DataTypes, Model } from 'sequelize';
import { container } from '@sapphire/framework';

export class AutoRoleMenu extends Model {}

export interface AutoRoleMenu {
	id: string;
	guild: string;
	channel: string;
	imageUrl?: string;
	roles: {
		id: string;
		description?: string;
	}[];
	createdAt: Date;
	updatedAt: Date;
}

AutoRoleMenu.init(
	{
		id: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true,
		},
		guild: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		channel: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		imageUrl: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		roles: {
			type: DataTypes.JSON,
			allowNull: true,
		},
	},
	{
		sequelize: container.database,
		modelName: 'AutoRoleMenu',
	}
);
