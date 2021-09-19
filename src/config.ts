import { exit } from 'process';
import { config as loadEnv } from 'dotenv';
import { ClientOptions, Intents } from 'discord.js';
import { LogLevel } from '@sapphire/framework';
import CustomLogger from './logger';

if (loadEnv().error) {
	console.error(loadEnv().error);
	exit(1);
}

const env: any = loadEnv().parsed;

interface BotConfiguration {
	clientOptions: ClientOptions;
	token: string;
}

interface Configuration {
	bot: BotConfiguration;
}

const config: Configuration = {
	bot: {
		token: env.BOT_TOKEN_DEV as string,
		clientOptions: {
			// Enable all intents
			defaultPrefix: '!',
			caseInsensitiveCommands: true,
			logger: { instance: new CustomLogger(LogLevel.Debug) },
			intents: Object.values(Intents.FLAGS).reduce((a, b) => a + b),
		},
	},
};

export default config;