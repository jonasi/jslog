import * as dayjs from 'dayjs';

let out: Console;
if (typeof window !== 'undefined') {
    out = global.console;
} else {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { stderr } = require('process');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { Console } = require('console');

    out = new Console({ stderr: stderr, stdout: stderr });
}

const levels = {
    'debug': 0,
    'info':  1,
    'warn':  2,
    'error': 3,
} as const;

export type Level = keyof typeof levels;

type EagerArgs = [ string, ...unknown[] ];
type LazyArgs = [ (fn: (...args: EagerArgs) => void) => void ];

type Args = EagerArgs | LazyArgs;

export class Logger {
    minLevel: Level = 'debug';

    debug(...args: Args): this {
        return this.log('debug', args);
    }

    info(...args: Args): this {
        return this.log('info', args);
    }

    warn(...args: Args): this {
        return this.log('warn', args);
    }

    error(...args: Args): this {
        return this.log('error', args);
    }

    private log(level: Level, largs: Args): this {
        if (levels[level] < levels[this.minLevel]) {
            return this;
        }

        let msg = '';
        let args: unknown[] = [];

        if (typeof largs[0] === 'function') {
            largs[0]((...largs: EagerArgs) => {
                [ msg, ...args ] = largs;
            });
        } else {
            [ msg, ...args ] = largs;
        }

        const time = dayjs();
        if (typeof msg === 'string') {
            msg = `[${ time }][${ level }] ${ msg }`;
        } else {
            args.unshift(msg);
            msg = `[${ time }][${ level }]`;
        }

        out[level](msg, ...args);
        return this;
    }
}

const defaultLogger = new Logger();
export default defaultLogger;
