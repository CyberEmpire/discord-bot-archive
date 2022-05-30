import type { PieceContext, PieceOptions } from '@sapphire/framework';
import {
	DMChannel,
	Message,
	MessageActionRow,
	MessageComponentInteraction,
	MessageSelectMenu,
	MessageSelectOptionData,
	Role,
} from 'discord.js';
import { AutoRoleMenu } from '../lib/AutoRoleMenu';
import { Module } from '../lib/Module';

export class AutoRolerModule extends Module {
	async sendRoleMenu(menu: AutoRoleMenu, dm: DMChannel): Promise<Message> {
		const guild = await this.container.client.guilds.fetch(menu.guild);

		const options: MessageSelectOptionData[] = [];

		for (const r of menu.roles) {
			const role = await guild.roles.fetch(r.id);

			if (role)
				options.push({
					label: role.name,
					value: role.id,
					description: r.description,
				});
		}

		const messageMenu = new MessageSelectMenu({
			customId: `autoroler-pick:${menu.guild}:${menu.channel}:${menu.id}`,
			minValues: 1,
			options,
		});

		const message = await dm.send({
			content: 'Pick a role !',
			components: [new MessageActionRow({ components: [messageMenu] })],
		});

		// Deletes message after timeout
		setTimeout(async () => {
			const messageToDelete = await dm.messages.fetch(message.id);
			if (messageToDelete) messageToDelete.delete();
		}, this.container.config.autoroler.pickTimeout);

		return message;
	}

	async pickRoles(interaction: MessageComponentInteraction): Promise<void> {
		if (!interaction.isSelectMenu()) return;

		interaction.deferReply();

		const identifier = interaction.customId.slice('autoroler-pick:'.length);

		const [guildId, channelId, messageId] = identifier.split(':');

		// Improperly formatted menu identifier
		if (!guildId || !channelId || !messageId) return interaction.deferReply();

		const menu = await AutoRoleMenu.findOne({
			where: {
				id: messageId,
				channel: channelId,
				guild: guildId,
			},
		});

		// Inexistant menu
		if (!menu) return interaction.deleteReply();

		const guild = await this.container.client.guilds.fetch(guildId);

		// Inexistant guild
		if (!guild) return interaction.deleteReply();

		const member = await guild?.members.fetch(interaction.user);

		// Inexistant member
		if (!member) return interaction.deleteReply();

		const roles: Role[] = [];

		for (const roleId of interaction.values) {
			const role = await guild?.roles.fetch(roleId);

			const isInMenu = menu.roles.find(({ id }) => id === roleId) !== undefined;

			// Filters inexistant roles and unexpected roles
			if (role && isInMenu) roles.push(role);
		}

		for (const role of roles) {
			if (member.roles.cache.has(role.id)) {
				await member.roles.remove(role.id);
				await member.send(`You have been **removed** the **${role.name}** role.`);
			} else {
				await member.roles.add(role.id);
				await member.send(`You have been **added** the **${role.name}** role.`);
			}
		}

		await interaction.deleteReply();

		const dmChannel = interaction.user.dmChannel;
		if (!dmChannel) return;

		const dmMessage = await dmChannel.messages.fetch(interaction.message.id);
		await dmMessage.delete();
	}

	async checkRoleMenu(menu: AutoRoleMenu): Promise<void> {
		const guild = await this.container.client.guilds.fetch(menu.guild);
		const channel = await guild.channels.fetch(menu.channel);

		try {
			if (!channel || !channel.isText()) throw Error();
			await channel.messages.fetch(menu.id);
		} catch {
			await menu.destroy();
			this.container.logger.info(`Role Menu ${menu.id}:${menu.channel}:${menu.guild} cleaned.`);
		}
	}

	async openRoleMenu(interaction: MessageComponentInteraction): Promise<void> {
		if (!interaction.inGuild()) return;

		const menu = await AutoRoleMenu.findOne({
			where: {
				id: interaction.message.id,
				channel: interaction.channelId,
				guild: interaction.guildId,
			},
		});

		// Inexistant menu
		if (!menu) return;

		const dm = await interaction.user.createDM();

		if (dm) {
			await this.sendRoleMenu(menu, dm);
			await interaction.reply(`📬 ${interaction.user} Check your DMs !`);
		} else await interaction.reply(`⚠️ ${interaction.user} please open your DMs !`);

		const reply = await interaction.fetchReply();
		const replyMessage = await interaction.channel?.messages.fetch(reply.id);

		// Delete reply after some time to avoid filling the role channel
		if (replyMessage)
			setTimeout(() => {
				replyMessage.delete();
			}, this.container.config.autoroler.openReplyLifetime);
	}

	override async clientReady(): Promise<void> {
		const menus = await AutoRoleMenu.findAll();

		menus.forEach(async (menu) => await this.checkRoleMenu(menu));

		this.container.client.on('interactionCreate', async (interaction) => {
			if (!interaction.isMessageComponent()) return;

			if (interaction.customId.startsWith('autoroler-open')) await this.openRoleMenu(interaction);
			if (interaction.customId.startsWith('autoroler-pick')) await this.pickRoles(interaction);
		});
	}

	constructor(context: PieceContext, options: PieceOptions) {
		super(context, {
			...options,
		});
	}
}

declare module '../lib/ModuleStore' {
	interface ModuleStoreEntries {
		autoRoler: AutoRolerModule;
	}
}
