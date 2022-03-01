import { Args, Command, CommandStore, PieceContext } from '@sapphire/framework';
import { Client, Message, MessageEmbed } from 'discord.js';

function getPrefix(client: Client): string {
	if (client.options.defaultPrefix) {
		if (typeof client.options.defaultPrefix === 'string') {
			return client.options.defaultPrefix;
		}
		return client.options.defaultPrefix[0];
	}
	return '!';
}

function sortCommands(commands: CommandStore): Map<string, Array<Command>> {
	const categories: Map<string, Array<Command>> = new Map();

	commands.forEach((cmd) => {
		if (!cmd.category) return;
		if (!categories.get(cmd.category)) {
			categories.set(cmd.category, []);
			commands
				.filter((c) => c.category === cmd.category)
				.forEach((c) => {
					if (!cmd.category) return;
					categories.get(cmd.category)?.push(c);
				});
		}
	});

	return categories;
}

function joinCommands(commands: Array<Command>): string {
	const commandNames: Array<String> = [];

	commands.forEach((cmd) => {
		commandNames.push(`\`${cmd.name}\``);
	});

	return commandNames.join(', ');
}

function makeCommandList(commands: CommandStore): MessageEmbed {
	const categories = sortCommands(commands);

	const embed = new MessageEmbed()
		.setTitle('Commands list')
		.setDescription(
			`This is a list of available commands. Commands you aren\'t authorised to use may not be visible to you. Use \`!help {Command}\` to get help about a specific command.`
		)
		.setColor('#00df11');

	categories.forEach((v, k) => {
		embed.addField(k, joinCommands(v));
	});

	return embed;
}

function makeHelpEmbed(command: Command): MessageEmbed {
	const embed = new MessageEmbed()
		.setAuthor(command.category ?? 'No category')
		.setTitle(command.name)
		.setDescription(command.description)
		.setColor('#00df11')
		.setFooter('Arguments: {} = Required | () = Optionnal | [] = List');

	if (command.detailedDescription) {
		embed.addField(
			'Usage:',
			`**${getPrefix(command.container.client) + command.name}** ${command.detailedDescription}`
		);
	}

	if (command.aliases.length > 0) {
		const aliases = command.aliases.map((a) => `\`${a}\``);
		embed.addField('Aliases:', aliases.join(', '));
	}

	return embed;
}

export class HelpCommand extends Command {
	constructor(context: PieceContext) {
		super(context, {
			name: 'Help',
			aliases: ['h'],
			description:
				'A command that lists all the commands or gives detailled informations about a specific command.',
			detailedDescription: '(Command)',
		});
	}

	async messageRun(message: Message, args: Args) {
		const commands = this.container.stores.get('commands');
		let arg = args.finished ? null : await args.pick('string');

		this.container.client.options.defaultPrefix;

		if (arg) {
			const cmd = commands.get(arg);

			if (cmd) {
				message.reply({ embeds: [makeHelpEmbed(cmd)] });
			} else {
				message.reply(`❓ The \`${arg}\` command doesn't exist.`);
			}
		} else {
			message.reply({ embeds: [makeCommandList(commands)] });
		}
	}
}
