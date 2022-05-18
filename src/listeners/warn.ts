import { Events, Listener, ListenerOptions, PieceContext } from '@sapphire/framework';

export class WarnListener extends Listener<typeof Events.Warn> {
	public constructor(context: PieceContext, options?: ListenerOptions) {
		super(context, {
			...options,
			once: true,
		});
	}

	public run(error: string) {
		this.container.client.logger.warn(error);
	}
}
