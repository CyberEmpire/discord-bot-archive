import { Listener, ListenerOptions, PieceContext } from '@sapphire/framework';

export class ErrorListener extends Listener {
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
