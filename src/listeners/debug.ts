import { Events, Listener, ListenerOptions, PieceContext } from '@sapphire/framework';

export class DebugListener extends Listener<typeof Events.Debug> {
	public constructor(context: PieceContext, options?: ListenerOptions) {
		super(context, {
			...options,
			once: true,
		});
	}

	public messageRun(info: string) {
		this.container.client.logger.debug(info);
	}
}
