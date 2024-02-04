import path, { basename } from 'path';
import process from 'node:process';
import { rm, access, stat } from 'node:fs/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import fs from 'fs/promises';
import { pipeline } from 'node:stream/promises';
import { Executor } from './Executor.js';

export class FsExecutor extends Executor {
    #name = 'fs';
    #rl = {};
    #sourcePath = '';
    #destinationPath = '';
    #sourceFileName = '';

    set args (value) {
        if (value.length >= 1) {
            this.#sourcePath = this._getPathToFileFromArgs(value[0]);
            this.#destinationPath = this._getPathToFileFromArgs(value[1]);
            this.#sourceFileName = basename(this.#sourcePath);
        } else {
            this.#sourcePath = '';
            this.#destinationPath = '';
            this.#sourceFileName = '';
        }
    }

    set rl (value) {
        this.#rl = value;
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

    #checkIsDirectory = async (path) => {
        const isDirectory = await this.#isDestinationDirectory(path);
        if (!isDirectory) {
            const errMsg = this._colorize('Invalid destination path. Second argument must be path to a directory', 91);
            throw new Error(errMsg);
        }
    }

    #checkIsFileExists = async (path) => {
        const fileExists = await this.#isFileExists(path);
        if (fileExists) {
            const errMsg = this._colorize('File with the same name already exists in the destination directory', 91);
            throw new Error(errMsg);
        }
    }

    #createFile = async (fileName, innerData) => {
        try {
            const destinationFilePath = path.join(process.cwd(), fileName);
            await this.#checkIsFileExists(destinationFilePath);
            const writeStream = createWriteStream(destinationFilePath);
            writeStream.write(innerData);
            writeStream.end();
            const msg = this._colorize('The file ', 92) +
                        this._colorize(fileName, 97) +
                        this._colorize(' has been created in the current working directory.', 92);
            console.log(msg);
        } catch (error) {
            console.log(this._errMsgOperationFailed, error.message);
        }
    }

    createEmptyFile = async () => {
        await this.#createFile(this.#sourceFileName, '');
        this._prompt();
    }

    deleteFile = async () => {
        if (!this.#sourcePath) {
            console.log(this._errMsgInvalidInput);
            return;
        }
        try {
            await rm(this.#sourcePath, {
                force: false,
                recursive: true
            });
            const msg = this._colorize(this.#sourceFileName, 90) + ' \n' +
                        this._colorize('Delete complete.', 92);
            console.log(msg);
            this._prompt();
        } catch (error) {
            console.log(this._errMsgOperationFailed, error.message);
            this._prompt();
        }
    }

    copyFile = async () => {
        if (!this.#sourcePath) {
            console.log(this._errMsgInvalidInput);
            return;
        }
        try {
            await this.#checkIsDirectory(this.#destinationPath);
            await access(this.#sourcePath);
            const destinationPath = path.join(this.#destinationPath, this.#sourceFileName);
            await this.#checkIsFileExists(destinationPath);
            const readStream = createReadStream(this.#sourcePath);
            const writeStream = createWriteStream(destinationPath);
            await pipeline(readStream, writeStream);
            const msg = this._colorize('Copy ', 92) +
                        this._colorize(this.#sourceFileName, 97) +
                        this._colorize(' complete.', 92);
            console.log(msg);
            this._prompt();
        } catch (error) {
            console.log(this._errMsgOperationFailed, error.message);
            this._prompt();
        }
    }

    moveFile = async () => {
        if (!this.#sourcePath) {
            console.log(this._errMsgInvalidInput);
            return;
        }
        try {
            await this.#checkIsDirectory(this.#destinationPath);
            await access(this.#sourcePath);
            const destinationPath = path.join(this.#destinationPath, this.#sourceFileName);
            await this.#checkIsFileExists(destinationPath);
            const readStream = createReadStream(this.#sourcePath);
            const writeStream = createWriteStream(destinationPath);
            await pipeline(readStream, writeStream);
            await rm(this.#sourcePath);
            const msg = this._colorize('File ', 92) +
                        this._colorize(this.#sourceFileName, 97) +
                        this._colorize(' transfer completed.', 92);
            console.log(msg);
            this._prompt();
        } catch (error) {
            console.log(this._errMsgOperationFailed, error.message);
            this._prompt();
        }
    }

    showFileContent = async () => {
        if (!this.#sourcePath) {
            console.log(this._errMsgInvalidInput);
            return;
        }
        try {
            const readStream = createReadStream(this.#sourcePath);
            readStream.on('data', (chunk) => {
                const innerText = this._colorize(chunk, 92);
                process.stdout.write(innerText + '\n');
                this._prompt();
            });
            readStream.on('error',(error) => {
                const errMsg = this._colorize('File ', 31) +
                               this._colorize(this.#sourceFileName, 97) +
                               this._colorize(' read operation failed:', 31);
                console.log(errMsg, error.message);
                this._prompt();
            });
        } catch (error) {
            console.log(this._errMsgOperationFailed, error.message);
            this._prompt();
        }
    }

    renameFile = async () => {
        try {
            const __dirname = path.dirname(this.#sourcePath);
            const destinationFileName = basename(this.#destinationPath);
            const __destinationFilePath = path.join(__dirname, destinationFileName);
            await fs.rename(this.#sourcePath, __destinationFilePath);
            const msg = this._colorize('Renaming file ', 92) +
                        this._colorize(this.#sourceFileName, 37) +
                        this._colorize(' to ', 92) +
                        this._colorize(destinationFileName, 97) +
                        this._colorize(' completed.', 92);
            console.log(msg);
            this._prompt();
        } catch (error) {
            const errMsg = this._colorize('File ', 31) +
                           this._colorize(this.#sourceFileName, 97) +
                           this._colorize(' rename operation failed:', 31);
            console.log(errMsg, error.message);
            this._prompt();
        }
    }
}