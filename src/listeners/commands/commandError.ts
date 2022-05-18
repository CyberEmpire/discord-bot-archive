import {
	CommandErrorPayload,
	Events,
	Listener,
	ListenerOptions,
	Identifiers,
	PieceContext,
	UserError,
	ArgumentError,
} from '@sapphire/framework';
import { blue, red } from 'chalk';
import { MessageEmbed } from 'discord.js';

export class CommandErrorListener extends Listener<typeof Events.CommandError> {
	public constructor(context: PieceContext, options?: ListenerOptions) {
		super(context, {
			...options,
		});
	}

	public makeErrorEmbed(text: string, commandName: string): MessageEmbed {
		const prefix = this.container.config.bot.clientOptions.defaultPrefix ?? '!';
		return new MessageEmbed()
			.setColor('RED')
			.setTitle(text)
			.setDescription(`See the help for this command with \`${prefix}help ${commandName}\``)
			.setFooter('> Command failed to run <');
	}

	public unhandled(error: Error, data: CommandErrorPayload): void {
		this.container.client.logger.error(
			`Command ${blue(data.command.name)} exited with unhandled error "${red(error.name)}: ${
				error.message
			}"\n\n${error.stack}`
		);

		data.message.reply({
			embeds: [this.makeErrorEmbed(`⁉️ Unhandled Error "${error.message}"`, data.command.name)],
		});
	}

	public userError(error: UserError, data: CommandErrorPayload): void {
		if (error.identifier === Identifiers.ArgsMissing) {
			data.message.reply({
				embeds: [this.makeErrorEmbed('❓ Missing required argument(s)', data.command.name)],
			});
		} else {
			data.message.reply({
				embeds: [this.makeErrorEmbed(`❌ **User Error:** ${error.message}`, data.command.name)],
			});
		}
	}

	public argumentError(error: ArgumentError, data: CommandErrorPayload): void {
		data.message.reply({
			embeds: [this.makeErrorEmbed(`❌ **Argument Error:** ${error.message}`, data.command.name)],
		});
	}

	public run(error: Error, data: CommandErrorPayload) {
		if (error instanceof ArgumentError) {
			this.argumentError(error, data);
		} else if (error instanceof UserError) {
			this.userError(error, data);
		} else {
			this.unhandled(error, data);
		}
	}
}
