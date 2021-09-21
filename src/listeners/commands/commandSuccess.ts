import {
	CommandSuccessPayload,
	Events,
	Listener,
	ListenerOptions,
	PieceContext,
} from '@sapphire/framework';
import { blue, magenta } from 'chalk';

export class CommandSuccessListener extends Listener<typeof Events.CommandSuccess> {
	public constructor(context: PieceContext, options?: ListenerOptions) {
		super(context, {
			...options,
			once: true,
		});
	}

	public run(data: CommandSuccessPayload) {
		this.container.client.logger.info(
			`${magenta(data.message.author.tag)} used the command ${blue(data.command.name)}.`
		);
	}
}
