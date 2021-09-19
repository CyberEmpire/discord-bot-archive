import { Command, PieceContext } from '@sapphire/framework';
import type { Message } from 'discord.js';

class PingCommand extends Command {
	constructor(context: PieceContext) {
		super(context, {
			aliases: ['pong'],
			description: 'Tests the latency.',
		});
	}

	async run(message: Message) {
		const response = await message.channel.send('Ping...');
		const latency = response.createdTimestamp - message.createdTimestamp;
		await response.edit(
			`Pong! Took me ${latency}ms. Gateway ping: ${message.client.ws.ping}ms`
		);
	}
}

export default PingCommand;
