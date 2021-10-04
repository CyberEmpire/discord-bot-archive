import { Piece, PieceOptions, PieceContext, SapphireClient } from '@sapphire/framework';

interface ModuleOptions extends PieceOptions {}

export class Module extends Piece {
	public async clientReady?(client: SapphireClient): Promise<void>;

	protected constructor(context: PieceContext, options: ModuleOptions = {}) {
		super(context, { ...options, name: (options.name ?? context.name).toLowerCase() });

		if (this.clientReady) {
			this.container.client.once('ready', this.clientReady);
		}
	}
}
