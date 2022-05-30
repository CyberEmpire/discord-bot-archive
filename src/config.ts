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

const logger = new CustomLogger(env.LOG_LEVEL ?? LogLevel.Debug);

interface Configuration {
	bot: {
		clientOptions: ClientOptions;
		token: string;
	};

	guild: {
		id: string;
		welcomeChannel: string;
	};

	database: SequelizeOption;

	leveling: {
		startLevel: number;
		startXp: number;
		minXp: number;
		maxXp: number;
		xpMultiplier: number;
		cardImg: string;
		// TODO: Find a better way to implement that
		fonts: {
			path: string;
			family: string;
		}[];
	};

	autoroler: {
		pickTimeout: number;
		openReplyLifetime: number;
	};
}

const config: Configuration = {
	bot: {
		token: env.BOT_TOKEN as string,
		clientOptions: {
			defaultPrefix: env.BOT_PREFIX ?? '!',
			caseInsensitiveCommands: true,
			logger: { instance: logger },
			// Enable all intents
			intents: Object.values(Intents.FLAGS).reduce((a, b) => a + b),
		},
	},
	guild: {
		id: env.GUILD_ID ?? '511176831391629313',
		welcomeChannel: env.GUILD_WELCOME_CHANNEL,
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
		cardImg: join(__dirname, '..', 'images', 'empty-level-card.png'),
		fonts: [
			{ path: join(__dirname, '..', 'fonts', 'consolas.ttf'), family: 'Consolas' },
			{
				path: join(__dirname, '..', 'fonts', 'computo-monospace.otf'),
				family: 'Computo Monospace',
			},
		],
	},
	autoroler: {
		pickTimeout: 360000,
		openReplyLifetime: 30000,
	},
};

declare module '@sapphire/pieces' {
	interface Container {
		config: Configuration;
	}
}

export default config;
