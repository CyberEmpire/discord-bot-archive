import { Args, Command, PieceContext } from '@sapphire/framework';
import { Message, MessageActionRow, MessageButton } from 'discord.js';
import { AutoRoleMenu } from '../../lib/AutoRoleMenu';

export class AddRoleMenuCommand extends Command {
	constructor(context: PieceContext) {
		super(context, {
			name: 'addrolemenu',
			aliases: ['add-role-menu'],
			description: 'Add a new role menu in the specified channel',
			detailedDescription: '{Channel} {Title} [Roles...]',
			requiredUserPermissions: ['MANAGE_ROLES', 'MANAGE_CHANNELS'],
		});
	}

	async messageRun(message: Message, args: Args) {
		const channel = await args.pick('channel');
		const title = await args.pick('string');
		const roles = await args.repeat('role');

		if (!channel.isText()) return;

		const menuMessage = await channel.send('Creating role menu...');

		const menu = new AutoRoleMenu({
			id: menuMessage.id,
			channel: menuMessage.channelId,
			guild: menuMessage.guildId,
			roles: roles.map((r) => {
				return {
					id: r.id,
					description: title,
				};
			}),
		});

		menuMessage.edit({
			content: `**${title}**\n\nPick your roles !`,
			components: [
				new MessageActionRow({
					components: [
						new MessageButton({
							customId: `autoroler-open`,
							label: 'Click Me',
							style: 'PRIMARY',
						}),
					],
				}),
			],
		});

		await menu.save();

		message.reply('Created new role menu ✅');
	}
}
