import { exit } from 'process';
import { join } from 'path';
import { config as loadEnv } from 'dotenv';
import { ClientOptions, Intents } from 'discord.js';
import { LogLevel } from '@sapphire/framework';
import CustomLogger from './logger';
import type { Options as SequelizeOption } from 'sequelize';

if (loadEnv().error) {
	console.error(loadEnv().error);
	exit(1);
}

const env: any = loadEnv().parsed;

const logger = new CustomLogger(LogLevel.Debug);

interface Configuration {
	bot: {
		clientOptions: ClientOptions;
		token: string;
	};
	guild: {
		id: string;
	};
	database: SequelizeOption;
	leveling: {
		startLevel: number;
		startXp: number;
		minXp: number;
		maxXp: number;
		xpMultiplier: number;
		cardImg: string;
	};
}

const config: Configuration = {
	bot: {
		token: env.BOT_TOKEN as string,
		clientOptions: {
			// Enable all intents
			defaultPrefix: env.BOT_PREFIX ?? '!',
			caseInsensitiveCommands: true,
			logger: { instance: logger },
			intents: Object.values(Intents.FLAGS).reduce((a, b) => a + b),
		},
	},
	guild: {
		id: env.GUILD_ID ?? '511176831391629313',
	},
	database: {
		host: env.DB_HOST,
		database: env.DB_DATABASE,
		username: env.DB_USER,
		password: env.DB_PASS,
		dialect: 'mariadb',
		logging: (...msg) => logger.debug(msg[0]),
	},
	leveling: {
		minXp: 25,
		maxXp: 35,
		startLevel: 0,
		startXp: 100,
		xpMultiplier: 1,
		cardImg: join(__dirname, 'images', 'empty-level-card.png'),
	},
};

declare module '@sapphire/pieces' {
	interface Container {
		config: Configuration;
	}
}

export default config;
