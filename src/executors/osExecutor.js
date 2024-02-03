import path, { basename } from 'path';
import { rm, access, stat } from 'node:fs/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import fs from 'fs/promises';
import { pipeline } from 'node:stream/promises';
import os from 'node:os';
import process from 'node:process';
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
}

// compress fileForHash.txt ./src/executors/files/some.gz






