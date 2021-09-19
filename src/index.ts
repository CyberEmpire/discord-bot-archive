import config from './config';
import { Events, SapphireClient } from '@sapphire/framework';
import { magentaBright } from 'chalk';

const client = new SapphireClient(config.bot.clientOptions);

client.on(Events.ClientReady, () => {
	client.logger.info(`Logged in as ${magentaBright(client.user?.tag)}.`);
});

client.login(config.bot.token).catch(console.error);
client.logger.info(`Logging in...`);
