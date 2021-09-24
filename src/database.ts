import { Sequelize, Options } from 'sequelize';
import { yellow } from 'chalk';
import { container } from '@sapphire/framework';

export class Database extends Sequelize {
	public setup(): Promise<void> {
		return new Promise(async (resolve, reject) => {
			await super.authenticate().catch(reject);

			container.client.logger.info(
				`Connected to database ${yellow(this.config.username)}@${yellow(this.config.host)}:${yellow(
					this.config.database
				)}`
			);

			await container.database.sync();

			resolve();
		});
	}

	constructor(config: Options) {
		super(config);
	}
}

declare module '@sapphire/pieces' {
	interface Container {
		database: Database;
	}
}
