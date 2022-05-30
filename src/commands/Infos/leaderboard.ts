import { Command, PieceContext } from '@sapphire/framework';
import { Interaction, Message, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import type { MemberLevel } from '../../modules/leveling';

function makeLeaderboardEmbed(lb: MemberLevel[], page: number, max: number): MessageEmbed {
	const embed = new MessageEmbed()
		.setColor('#00df11')
		.setTitle('🏆 Leaderboard')
		.setFooter(`Page ${page + 1}/${max + 1} | ${lb.length} entries`);

	for (let i = page * 10; i < page * 10 + 10; i++) {
		const l = lb[i];
		if (l) {
			embed.addField(`#${i + 1} - ${l.username}`, `**Level:** ${l.level} | **XP:** ${l.xp}`);
		}
	}

	return embed;
}

function makeButtons(page: number, max: number): MessageActionRow {
	return new MessageActionRow({
		components: [
			new MessageButton({
				customId: 'prev',
				label: 'Previous',
				style: 'PRIMARY',
				type: 'BUTTON',
				emoji: '◀️',
				disabled: page <= 0,
			}),
			new MessageButton({
				customId: 'next',
				label: 'Next',
				style: 'PRIMARY',
				type: 'BUTTON',
				emoji: '▶️',
				disabled: page >= max,
			}),
		],
	});
}

export class LeaderboardCommand extends Command {
	constructor(context: PieceContext) {
		super(context, {
			name: 'Leaderboard',
			aliases: ['lb'],
			description: 'Displays a leaderboard of the top members.',
		});
	}

	async messageRun(message: Message) {
		const leveling = this.container.modules.get('leveling');
		let leaderboard = await leveling.getLeaderboard();

		let page = 0;
		const maxPage = Math.floor(leaderboard.length / 10);

		const m = await message.reply({
			embeds: [makeLeaderboardEmbed(leaderboard, page, maxPage)],
			components: [makeButtons(page, maxPage)],
		});

		const filter = (interaction: Interaction) => interaction.user.id === message.author.id;

		const collector = m.createMessageComponentCollector({
			filter,
			time: 5 * 60 * 1000,
		});

		collector.on('collect', async (i) => {
			if (i.customId === 'prev') {
				if (page > 0) {
					i.update({
						embeds: [makeLeaderboardEmbed(leaderboard, --page, maxPage)],
						components: [makeButtons(page, maxPage)],
					});
				} else {
					i.reply('You are already at the fist page !');
				}
			} else {
				if (page < maxPage) {
					i.update({
						embeds: [makeLeaderboardEmbed(leaderboard, ++page, maxPage)],
						components: [makeButtons(page, maxPage)],
					});
				} else {
					i.reply('You are already at the last page !');
				}
			}
		});

		collector.on('end', () => {
			m.edit({ components: [] });
		});
	}
}
