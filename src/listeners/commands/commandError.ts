import {
	CommandErrorPayload,
	Events,
	Listener,
	ListenerOptions,
	PieceContext,
} from '@sapphire/framework';
import { blue, red } from 'chalk';

export class CommandErrorListener extends Listener<typeof Events.CommandError> {
	public constructor(context: PieceContext, options?: ListenerOptions) {
		super(context, {
			...options,
			once: true,
		});
	}

	public run(error: Error, data: CommandErrorPayload) {
		this.container.client.logger.error(
			`Command ${blue(data.command.name)} exited with error "${red(error.name)}: ${error.message}"`
		);
	}
}
