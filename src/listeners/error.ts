import {
	Events,
	Listener,
	ListenerOptions,
	PieceContext,
} from '@sapphire/framework';

export class ErrorListener extends Listener<typeof Events.Error> {
	public constructor(context: PieceContext, options?: ListenerOptions) {
		super(context, {
			...options,
			once: true,
		});
	}

	public run(error: Error) {
		this.container.client.logger.error(error);
	}
}
