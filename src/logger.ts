import { Logger, LogLevel } from '@sapphire/framework';
import { magenta, cyan, cyanBright, yellow, redBright, bgRed } from 'chalk';

const levels = new Map<LogLevel, String>([
	[LogLevel.Trace, magenta('TRACE')],
	[LogLevel.Debug, cyan('DEBUG')],
	[LogLevel.Info, cyanBright('INFO')],
	[LogLevel.Warn, yellow('WARN')],
	[LogLevel.Error, redBright('ERROR')],
	[LogLevel.Fatal, bgRed('FATAL')],
]);

class CustomLogger extends Logger {
	public override write(level: LogLevel, ...values: readonly unknown[]): void {
		if (!this.has(level)) return;
		const method = Logger.levels.get(level);
		if (typeof method === 'string') console[method](`[${levels.get(level)}]`, ...values);
	}

	constructor(logLevel: LogLevel) {
		super(logLevel);
	}
}

export default CustomLogger;
