import { Command, PieceContext } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';
import * as https from 'https';

async function getRandomMeme(): Promise<Meme> {
	return new Promise((resolve) => {
		https.get('https://meme-api.herokuapp.com/gimme/1', (res) => {
			var fullData = '';
			res.on('data', (data) => {
				fullData = fullData + data;
			});
			res.on('end', () => {
				var d = JSON.parse(fullData);
				resolve(d.memes[0]);
			});
		});
	});
}

interface Meme {
	title: string;
	postLink: string;
	url: string;
}

export class MemeCommand extends Command {
	constructor(context: PieceContext) {
		super(context, {
			name: 'Meme',
			description: 'Enjoy juicy memes.',
		});
	}

	async run(message: Message) {
		const meme = await getRandomMeme();

		const embed = new MessageEmbed()
			.setAuthor(
				meme.title,
				'https://s18955.pcdn.co/wp-content/uploads/2017/05/Reddit.png',
				meme.postLink
			)
			.setImage(meme.url)
			.setColor('#ff5700')
			.setFooter("Thanks to R3l3ntl3ss's Meme_Api");
		message.channel.send({ embeds: [embed] });
	}
}
