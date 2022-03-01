import {
	CommandDeniedPayload,
	Events,
	Listener,
	ListenerOptions,
	PieceContext,
	UserError,
} from '@sapphire/framework';
import { blue, magenta } from 'chalk';

export class CommandDeniedListener extends Listener<typeof Events.CommandDenied> {
	public constructor(context: PieceContext, options?: ListenerOptions) {
		super(context, {
			...options,
		});
	}

	public messageRun(error: UserError, data: CommandDeniedPayload) {
		this.container.client.logger.info(
			`Command ${blue(data.command.name)} denied for ${magenta(
				data.message.author.tag
			)}. Because of error ${error.name}`
		);
	}
}
