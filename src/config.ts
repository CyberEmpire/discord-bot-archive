import { exit } from 'process';
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
};

declare module '@sapphire/pieces' {
	interface Container {
		config: Configuration;
	}
}

export default config;
