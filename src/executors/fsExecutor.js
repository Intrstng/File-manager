import { basename } from 'path';
import { rm, cp } from 'node:fs/promises';
import { Executor } from './executor.js';

export class FsExecutor extends Executor {
    #name = 'fs';
    #sourcePath;
    #destinationPath;

    constructor(args) {
        super();
        if (args.length >= 1) {
            this.#sourcePath = this._getPathToFileForHashFromArgs(args[0]);
            this.#destinationPath = this._getPathToFileForHashFromArgs(args[1]);
        }
    }

    delete = async () => {
        if (!this.#sourcePath) {
            console.log('\x1b[91mInvalid input\x1b[0m');
            return;
        }
        const destinationFileName = basename(this.#sourcePath);
        try {
            await rm(this.#sourcePath, {
                force: false,
                recursive: true
            });
            console.log(`\x1b[90m${destinationFileName}\x1b[92m\nDelete complete.\x1b[0m`);
        } catch (error) {
            console.log('\x1b[31mOperation failed:\x1b[0m');
            console.error(error.message);
        }
    }

    copy = async () => {
        if (!this.#sourcePath || !this.#destinationPath) {
            console.log('\x1b[91mInvalid input\x1b[0m');
            return;
        }
        try {
            await cp(this.#sourcePath, this.#destinationPath, {
                errorOnExist: true,
                recursive: true,
                force: false
            });
        } catch {
            throw new Error ('FS operation failed');
        }
    }
}

// compress fileForHash.txt ./src/executors/files/some.gz