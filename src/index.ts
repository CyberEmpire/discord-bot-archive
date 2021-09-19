import config from './config';
import { SapphireClient } from '@sapphire/framework';

const client = new SapphireClient(config.bot.clientOptions);

client.login(config.bot.token).catch(console.error);
