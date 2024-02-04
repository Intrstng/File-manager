import { createReadStream, createWriteStream } from 'node:fs';
import { access } from 'node:fs';
import { createBrotliCompress, createBrotliDecompress } from 'node:zlib';
import { pipeline } from 'stream';
import { Executor } from './Executor.js';

export class ZlibExecutor extends Executor {
    #name = 'zlib';
    #args = [];
    #sourcePath = '';
    #destinationPath = '';

    set args (value) {
            this.#args = value;
            if (this.#args.length > 1) {
                this.#sourcePath = this._getPathToFileFromArgs(this.#args[0]);
                this.#destinationPath = this._getPathToFileFromArgs(this.#args[1]);
            } else {
                this.#sourcePath = '';
                this.#destinationPath = '';
            }
    }

    #compressDecompressReducer = (action) => {
        // If only one arg (#sourcePath) is entered, avoids crushing of app (due to invoking createWriteStream(this.#destinationPath))
        if (!this.#sourcePath || !this.#destinationPath) {
            console.log(this._errMsgInvalidInput);
            return;
        }
        // Avoids creating of new wrong file due to createWriteStream if #sourcePath is not valid
        access(this.#sourcePath, (error) => {
            if (error) {
                const msg = this._colorize('Invalid input: source path does not exist', 91);
                console.log(msg);
                this._prompt();
            } else {
                const readStream = createReadStream(this.#sourcePath);
                const writeStream = createWriteStream(this.#destinationPath);
                const compressDecompressStream = action === 'Compression'
                                                ? createBrotliCompress()
                                                : createBrotliDecompress();
                pipeline(readStream, compressDecompressStream, writeStream, (error) => {
                    if (error) {
                        console.error(this._errMsgOperationFailed, error.message);
                    } else {
                        const msg =  this._colorize(`${action} complete.`, 92);
                        console.log(msg);
                        this._prompt();
                    }
                });
            }
        })
    }

    compressWithBrotli = async () => {
        const action = 'Compression';
        await this.#compressDecompressReducer(action, this.#sourcePath, this.#destinationPath);
    }

    deCompressWithBrotli = async () => {
        const action = 'Decompression';
        await this.#compressDecompressReducer(action, this.#sourcePath, this.#destinationPath);
    }
}