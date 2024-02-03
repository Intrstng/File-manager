import path, { basename } from 'path';
import { rm, access, stat } from 'node:fs/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import fs from 'fs/promises';
import { pipeline } from 'node:stream/promises';
import process from 'node:process';
import os from 'node:os';
import { Executor } from './executor.js';

export class OsExecutor extends Executor {
    #name = 'os';
    #args;
    #sourcePath;
    #destinationPath;
    #sourceFileName;

    constructor(args) {
        super();
        if (args.length >= 1) {
            this.#args = args;
            this.#sourcePath = this._getPathToFileFromArgs(args[0]);
            this.#destinationPath = this._getPathToFileFromArgs(args[1]);
            this.#sourceFileName = basename(this.#sourcePath);
        }
    }

    getEOL = async () => {
        const defaultEOL = os.EOL;
        const msg = this._colorize('Default End-Of-Line (EOL) sequence: ', 92) +
                    this._colorize(JSON.stringify(defaultEOL), 93);
        await process.stdout.write(msg);
    }

    getCPUs = async () => {
        const msg = this._colorize('Overall amount of CPU\'s: ', 94) +
                    this._colorize(`${os.availableParallelism()}\n`, 92);
        process.stdout.write(msg);
        // console.log(os.cpus().length) - we can also use
        const data = os.cpus().map(({model, speed}) => ({
                'Model': model.trim(),
                'Clock rate (GHz)': speed / 1000
            }));
        console.table(data);
    }

    getHomeDir = async () => {
        const homedir = this._colorize(os.homedir(), 96);
        process.stdout.write(homedir);
    }

    getSysUsername = async () => {
        const username = this._colorize(os.userInfo().username, 96);
        process.stdout.write(username);
    }

}

// compress fileForHash.txt ./src/executors/files/some.gz

// \x1b[30m: Black
// \x1b[31m: Red
// \x1b[32m: Green
// \x1b[33m: Yellow
// \x1b[34m: Blue
// \x1b[35m: Magenta
// \x1b[36m: Cyan
// \x1b[37m: White
// \x1b[90m: Bright black (gray)
// \x1b[91m: Bright red
// \x1b[92m: Bright green
// \x1b[93m: Bright yellow
// \x1b[94m: Bright blue
// \x1b[95m: Bright magenta
// \x1b[96m: Bright cyan
// \x1b[97m: Bright white






