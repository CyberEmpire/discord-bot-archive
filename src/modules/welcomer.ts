import { container, PieceContext, PieceOptions } from '@sapphire/framework';
import { magenta } from 'chalk';
import type { GuildMember } from 'discord.js';
import { Module } from '../lib/Module';

const welcomeText = `
__**Welcome in the The Cyber Empire**__

The Cyber Empire is an **ethical hacking community** that focuses on Cyber Security, Infosec, Hacking. 
Members of The Cyber Empire **share knowledge and experience** with other members. Our main goal is to improve and support 
people who are interested in ethical hacking. **We offer CTF's and will provide our members with live classes**. 
We have an active staff that offers 24/7 service in order to give you the best experience in our community!
`;

const rulesIntroductionText = `
In order to be part of our community, **you need to follow rules and guidelines**. 
The list below contains our primary rules but they are subject to change and **may be selectively
enforced or ignored at the discretion of the administrators** pursuant to the spirit of the server.
`;

const rulesText = `
**The rules of The Cyber Empire**

**1️⃣ - We do not provide Black Hat services**
Black hat activities are 📛 **against the law**, discord's ToS and our laws! This is an Ethical hacking community, so
we do not accept any BlackHat related conversations. The Staff is not responsible for any of your actions that might be against the laws. 
**Do not request for BlackHat services**. We highly prohibit requests such as "Can you hack a 'Social media' account for me". 
Yes, 💳 carding counts as Black Hat. If you intent of joining our community for such reasons, you're in the wrong place !

**2️⃣ - Do not spam**
By spam we mean "**irrelevant or unsolicited messages** sent over the Internet, typically to a **large** 
**number of users**, for the purposes of **🏷️ advertising,** 
**🎣 phishing, 🦠spreading malware, etc**".

**3️⃣ - Behave in a mature manner**
This is a community, **treat everyone with respect** 🤝. Do not use an inappropriate language, this includes excessive swearing and slurs.
**We wont tolerate any altercation between the members**.

**4️⃣ - Do not share suspicious executable/link** 
In order to share (suspicious) 📎 **executables, links or anything in that direction**. You'll have to ask the senate for permission ⚖️.
Refusing to comply to this rule will result in the concerned message's deletion and further consequences.

**5️⃣ - Do not harm/threaten other members**
This includes **threatening ✍️ of Doxing, DoS-ing and any other thing that could harm other members**.

**6️⃣ - Do not troll** 
By troll 🤡, we mean "a person who makes a deliberately offensive or provocative online post".
**This also includes messages that incitates hate on another member/person.**
*Humour and sarcasm is of course allowed **as long as it respects the other members***.

**7️⃣ - Respect the use of channels**
Please respect the usage of every channel. Ex: *Talking about C++ in the JavaScript channel*
`;

export class WelcomerModule extends Module {
	public async welcomeMember(member: GuildMember): Promise<void> {
		const welcomeChannel =
			container.config.guild.welcomeChannel &&
			(await container.client.channels.fetch(container.config.guild.welcomeChannel));

		container.logger.info(`${magenta(member.user.tag)} joined the server.`);

		if (welcomeChannel && welcomeChannel.isText()) {
			welcomeChannel.send(`${member} joined the server !`);
		}

		try {
			const bannerURL = member.guild.bannerURL();
			await member.user.send({
				content: `${member.user} ${welcomeText}\n${rulesIntroductionText}`,
				files: bannerURL ? [bannerURL] : undefined,
			});
			await member.user.send(`${member.user} ${rulesText}`);
		} catch (err) {
			container.logger.info(`Couldn't send DMs to ${magenta(member.user.tag)}.`);
		}
	}

	override async onLoad() {
		this.container.client.on('guildMemberAdd', this.welcomeMember);
	}

	constructor(context: PieceContext, options: PieceOptions) {
		super(context, {
			...options,
			enabled: container.config.guild.welcomeChannel != null,
		});
	}
}

declare module '../lib/ModuleStore' {
	interface ModuleStoreEntries {
		welcomer: WelcomerModule;
	}
}
