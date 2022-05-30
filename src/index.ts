import config from './config';
import { join } from 'path';
import { Database } from './database';
import { SapphireClient, container } from '@sapphire/framework';
import { ModuleStore } from './lib/ModuleStore';

container.config = config;

container.database = new Database(config.database);

container.database.setup().catch((err: Error) => {
	client.logger.fatal(`Connection to database failed: ${err}`);
	process.exit();
});

const client = new SapphireClient(config.bot.clientOptions);

client.stores.register(new ModuleStore().registerPath(join(__dirname, 'modules')));

client.login(config.bot.token).catch((err: Error) => {
	client.logger.fatal(`Connection to Discord failed: ${err}`);
	process.exit(1);
});

client.logger.info(`Logging in...`);
