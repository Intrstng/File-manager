import path, { basename } from 'path';
import { rm, access, stat } from 'node:fs/promises';
import {createReadStream, createWriteStream} from 'node:fs';
import { pipeline } from 'node:stream/promises';
import { Executor } from './executor.js';

export class FsExecutor extends Executor {
    #name = 'fs';
    #sourcePath;
    #destinationPath;
    #sourceFileName;

    constructor(args) {
        super();
        if (args.length >= 1) {
            this.#sourcePath = this._getPathToFileFromArgs(args[0]);
            this.#destinationPath = this._getPathToFileFromArgs(args[1]);
            this.#sourceFileName = basename(this.#sourcePath);
        }
    }

    #isDestinationDirectory = async (destinationPath) => {
        try {
            const stats = await stat(destinationPath);
            return stats.isDirectory();
        } catch (error) {
            return false;
        }
    };

    #isFileExists = async (filePath) => {
        try {
            await access(filePath);
            return true;
        } catch (error) {
            return false;
        }
    };

    deleteFile = async () => {
        if (!this.#sourcePath) {
            console.log('\x1b[91mInvalid input\x1b[0m');
            return;
        }
        try {
            await rm(this.#sourcePath, {
                force: false,
                recursive: true
            });
            console.log(`\x1b[90m${this.#sourceFileName}\x1b[92m\nDelete complete.\x1b[0m`);
        } catch (error) {
            console.log('\x1b[31mOperation failed:\x1b[0m');
            console.error(error.message);
        }
    }

    #checkIsDirectory = async (path) => {
        const isDirectory = await this.#isDestinationDirectory(path);
        if (!isDirectory) {
            console.log('\x1b[91mInvalid destination path. Second argument must be path to a directory\x1b[0m');
            return;
        }
    }

    #checkIsFileExists = async (path) => {
        const fileExists = await this.#isFileExists(path);
        if (fileExists) {
            console.log('\x1b[91mFile with the same name already exists in the destination directory\x1b[0m');
            return;
        }
    }

    copyFile = async () => {
        await this.#checkIsDirectory(this.#destinationPath);
        try {
            await access(this.#sourcePath);
            const destinationPath = path.join(this.#destinationPath, this.#sourceFileName);
            await this.#checkIsFileExists(destinationPath);
            const readStream = createReadStream(this.#sourcePath);
            const writeStream = createWriteStream(destinationPath);
            await pipeline(readStream, writeStream);
            console.log(`\x1b[92mCopy \x1b[97m${this.#sourceFileName}\x1b[92m complete.\x1b[0m`);
        } catch (error) {
            console.log('\x1b[31mOperation failed:\x1b[0m');
            console.error(error.message);
        }
    }

    moveFile = async () => {
        await this.#checkIsDirectory(this.#destinationPath);
        try {
            await access(this.#sourcePath);
            const destinationPath = path.join(this.#destinationPath, this.#sourceFileName);
            await this.#checkIsFileExists(destinationPath);
            const readStream = createReadStream(this.#sourcePath);
            const writeStream = createWriteStream(destinationPath);
            await pipeline(readStream, writeStream);
            await rm(this.#sourcePath);
            console.log(`\x1b[92mFile \x1b[97m${this.#sourceFileName}\x1b[92m transfer completed\x1b[0m`);
        } catch (error) {
            console.log('\x1b[31mOperation failed:\x1b[0m');
            console.error(error.message);
        }
    }
}

// compress fileForHash.txt ./src/executors/files/some.gz




