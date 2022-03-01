import { Command, PieceContext } from '@sapphire/framework';
import type { Message } from 'discord.js';

export class PingCommand extends Command {
	constructor(context: PieceContext) {
		super(context, {
			name: 'Ping',
			aliases: ['pong'],
			description: 'Tests the latency.',
		});
	}

	async messageRun(message: Message) {
		const response = await message.channel.send('Ping...');
		const latency = response.createdTimestamp - message.createdTimestamp;
		await response.edit(`Pong! Took me ${latency}ms. Gateway ping: ${message.client.ws.ping}ms`);
	}
}
