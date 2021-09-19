import { SapphireClient } from '@sapphire/framework';

const client = new SapphireClient({
	intents: ['GUILDS', 'GUILD_MESSAGES'],
});

client.login('token').catch(console.error);
