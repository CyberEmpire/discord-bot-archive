import config from './config';
import { Database } from './database';
import { SapphireClient, container } from '@sapphire/framework';

container.database = new Database(config.database);

container.database.setup().catch((err: Error) => {
	client.logger.fatal(`Connection to database failed: ${err}`);
	process.exit();
});

const client = new SapphireClient(config.bot.clientOptions);

client.login(config.bot.token).catch(console.error);
client.logger.info(`Logging in...`);
