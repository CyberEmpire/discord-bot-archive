import {
	CommandAcceptedPayload,
	Events,
	Listener,
	ListenerOptions,
	PieceContext,
} from '@sapphire/framework';
import { magenta } from 'chalk';

export class CommandAcceptListener extends Listener<typeof Events.CommandAccepted> {
	public constructor(context: PieceContext, options?: ListenerOptions) {
		super(context, {
			...options,
		});
	}

	public messageRun(data: CommandAcceptedPayload) {
		this.container.client.logger.debug(
			`Command ${data.command.name} accepted for ${magenta(data.message.author.tag)}.`
		);
	}
}
