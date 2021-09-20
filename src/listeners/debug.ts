import { Listener, ListenerOptions, PieceContext } from '@sapphire/framework';

export class DebugListener extends Listener {
	public constructor(context: PieceContext, options?: ListenerOptions) {
		super(context, {
			...options,
			once: true,
		});
	}

	public run(info: string) {
		this.container.client.logger.debug(info);
	}
}
