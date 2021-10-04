import { PieceContext, container } from '@sapphire/framework';
import { Module } from '../lib/Module';
import type { GuildMember } from 'discord.js';
import {
	Canvas,
	createCanvas,
	Image,
	loadImage,
	NodeCanvasRenderingContext2D,
	registerFont,
} from 'canvas';

function shadowedText(
	ctx: NodeCanvasRenderingContext2D,
	text: string,
	x: number,
	y: number,
	font: string,
	shadowSize: number,
	textColor: string,
	shadowColor: string
) {
	ctx.fillStyle = textColor;
	ctx.font = font;
	ctx.fillText(text, x, y);

	ctx.strokeStyle = shadowColor;
	ctx.lineWidth = shadowSize;
	ctx.font = font;
	ctx.strokeText(text, x, y);
}

function roundRect(
	ctx: NodeCanvasRenderingContext2D,
	x: number,
	y: number,
	width: number,
	height: number,
	radius: number = 5,
	fill: boolean,
	stroke: boolean = true
) {
	ctx.beginPath();
	ctx.moveTo(x + radius, y);
	ctx.lineTo(x + width - radius, y);
	ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
	ctx.lineTo(x + width, y + height - radius);
	ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
	ctx.lineTo(x + radius, y + height);
	ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
	ctx.lineTo(x, y + radius);
	ctx.quadraticCurveTo(x, y, x + radius, y);
	ctx.closePath();
	if (fill) {
		ctx.fill();
	}
	if (stroke) {
		ctx.stroke();
	}
}

function roundedImage(
	ctx: NodeCanvasRenderingContext2D,
	image: Image,
	x: number,
	y: number,
	width: number
) {
	ctx.save(); // save the context
	ctx.beginPath();
	ctx.arc(x + width / 2, y + width / 2, width / 2, 0, 2 * Math.PI);
	ctx.clip();
	ctx.drawImage(image, x, y, width, width);
	ctx.restore();
}

function drawCircle(
	ctx: NodeCanvasRenderingContext2D,
	x: number,
	y: number,
	width: number,
	color: string
) {
	ctx.save(); // save the context
	ctx.beginPath();
	ctx.arc(x + width / 2, y + width / 2, width / 2, 0, 2 * Math.PI);
	ctx.fillStyle = color;
	ctx.fill();
	ctx.restore();
}

export class LevelCardModule extends Module {
	async makeCard(member: GuildMember): Promise<Canvas> {
		const ml = await container.modules.get('leveling').getMember(member);

		const canva = createCanvas(2016, 1059);
		const ctx = canva.getContext('2d');

		const bgImage = await loadImage(container.config.leveling.cardImg);

		const profileImage = await loadImage(member.user.displayAvatarURL({ format: 'jpeg' }));

		ctx.drawImage(bgImage, 0, 0, 2016, 1059);

		// Profile picture

		drawCircle(ctx, 100, 100, 300, 'rgb(0,223,13)');
		roundedImage(ctx, profileImage, 110, 110, 280);

		// Draw username

		shadowedText(
			ctx,
			member.user.username,
			450,
			230,
			'140px Computo Monospace',
			5,
			'rgb(0,223,13)',
			'rgb(0,0,0)'
		);

		// Draw Role

		shadowedText(
			ctx,
			member.roles.highest.name,
			520,
			380,
			'85px Computo Monospace',
			2,
			'rgb(0,0,0)',
			'rgb(0,223,13)'
		);

		// Level
		ctx.textAlign = 'center';
		shadowedText(
			ctx,
			ml.level.toString(),
			780,
			580,
			'bold 170px Consolas',
			5,
			'rgb(0,223,13)',
			'rgb(0,0,0)'
		);

		// XP
		shadowedText(
			ctx,
			`${ml.xp}/${ml.nextLevelXP}`,
			780,
			750,
			'bold 140px Consolas',
			5,
			'rgb(0,223,13)',
			'rgb(0,0,0)'
		);

		// Rank
		shadowedText(
			ctx,
			`#${await ml.rank}`,
			1600,
			730,
			'bold 170px Consolas',
			5,
			'rgb(0,223,13)',
			'rgb(0,0,0)'
		);

		// Progress Bar
		const percent = Math.floor((ml.xp * 100) / ml.nextLevelXP);
		ctx.fillStyle = 'rgb(0,223,13)';
		roundRect(ctx, 101, 868, (1813 * percent) / 100, 65, 18, true, false); // 1813

		ctx.textAlign = 'left';
		ctx.fillStyle = 'rgb(0,0,0)';
		ctx.font = '65px Consolas';
		ctx.fillText('Progress...', 130, 915);

		ctx.textAlign = 'right';
		ctx.fillStyle = 'rgb(0,0,0)';
		ctx.font = 'bold 65px Consolas';
		ctx.fillText(`${percent}%`, 1900, 920);

		return canva;
	}

	override onLoad() {
		container.config.leveling.fonts.forEach((f) => {
			registerFont(f.path, { ...f });
		});
	}

	constructor(context: PieceContext) {
		super(context);
	}
}

declare module '../lib/ModuleStore' {
	interface ModuleStoreEntries {
		'level-card': LevelCardModule;
	}
}
