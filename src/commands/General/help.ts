import { Command, CommandStore, PieceContext } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';

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

class HelpCommand extends Command {
	constructor(context: PieceContext) {
		super(context, {
			name: 'Help',
			aliases: ['h'],
			description: 'Display help for commands.',
		});
	}

	async run(message: Message) {
		const commands = this.container.stores.get('commands');

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

		message.reply({ embeds: [embed] });
	}
}

export default HelpCommand;
