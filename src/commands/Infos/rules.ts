import { Args, Command, PieceContext } from '@sapphire/framework';
import { EmbedFieldData, Message, MessageEmbed } from 'discord.js';

const rules = [
	[
		'**1️⃣ - We do not provide Black Hat services**',
		"Black hat activities are 📛 **against the law**, Discord's ToS and our laws! This is an Ethical hacking community, so we do not accept any BlackHat related conversations. The Staff is not responsible for any of your actions that might be against the laws. **Do not request for BlackHat services**. We highly prohibit requests such as \"Can you hack a 'Social media' account for me\". Yes, 💳 carding counts as Black Hat. *If you intent of joining our community for such reasons, you're in the wrong place !*\n\u200b",
	],
	[
		'**2️⃣ - Do not spam**',
		'By spam we mean "**irrelevant or unsolicited messages** sent over the Internet, typically to a **large number of users**, for the purposes of **🏷️ advertising, 🎣 phishing, 🦠spreading malware, etc**".\n\u200b',
	],
	[
		'**3️⃣ - Behave in a mature manner**',
		'This is a community, **treat everyone with respect** 🤝. Do not use an inappropriate language, this includes excessive swearing and slurs. **We wont tolerate any altercation between the members**.\n\u200b',
	],
	[
		'**4️⃣ - Do not share suspicious executable/link**',
		"In order to share (suspicious) 📎 **executables, links or anything in that direction**. You'll have to ask the senate for permission ⚖️. *Refusing to comply to this rule will result in the concerned message's deletion and further consequences.*\n\u200b",
	],
	[
		'**5️⃣ - Do not harm/threaten other members**',
		'This includes, but not only, **threatening ✍️ of Doxing, DoS-ing and any other thing that could harm other members**.\n\u200b',
	],
	[
		'**6️⃣ - Do not troll**',
		'By troll 🤡, we mean "a person who makes a deliberately offensive or provocative online post".**This also includes messages that incitates hate on another member/person**. *Humour and sarcasm is of course allowed **as long as it respects the other members***.\n\u200b',
	],
	[
		'**7️⃣ - Respect the use of channels**',
		'Please respect the usage of every channel. Ex: *Talking about C++ in the JavaScript channel*',
	],
];

function makeRulesEmbed(rules: Array<Array<String>>): MessageEmbed {
	const fields = rules.map((v) => {
		return { name: v[0], value: v[1] } as EmbedFieldData;
	});

	const embed = new MessageEmbed()
		.setColor('#00df11')
		.setTitle("📜 The Cyber Empire's rules")
		.setDescription(
			'In order to be part of our community, **you need to follow rules and guidelines**. The list below contains our primary rules but they are subject to change and **may be selectively enforced or ignored at the discretion of the administrators** pursuant to the spirit of the server.\n\u200b\n\u200b'
		)
		.setFooter('https://thecyberempire.com/')
		.setFields(fields);

	return embed;
}

export class RulesCommand extends Command {
	constructor(context: PieceContext) {
		super(context, {
			name: 'Rules',
			aliases: ['rule'],
			description: "Display the server's rules.",
		});
	}

	async run(message: Message, args: Args) {
		const rule = await args.pick('number').catch(() => null);

		if (rule) {
			if (rules[rule - 1]) {
				message.reply({ embeds: [makeRulesEmbed([rules[rule - 1]])] });
			} else {
				message.reply('❓ There is no such rule.');
			}
		} else {
			message.reply({ embeds: [makeRulesEmbed(rules)] });
		}
	}
}
