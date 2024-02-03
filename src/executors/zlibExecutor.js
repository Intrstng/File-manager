import {createReadStream, createWriteStream} from 'node:fs';
import {access} from 'node:fs';
import {createBrotliCompress, createBrotliDecompress} from 'node:zlib';
import {pipeline} from 'stream';
import {Executor} from './executor.js';


export class ZlibExecutor extends Executor {
    #name = 'zlib';
    #args;
    #sourcePath;
    #destinationPath;

    constructor(args) {
        super();
        this.#args = args;
        if (this.#args.length > 1) {
            this.#sourcePath = this._getPathToFileFromArgs(this.#args[0]);
            this.#destinationPath = this._getPathToFileFromArgs(this.#args[1]);
        }
    }

    #compressDecompressReducer = (action) => {
        // If only one arg (#sourcePath) is entered, avoids crushing of app (due to invoking createWriteStream(this.#destinationPath))
        if (!this.#sourcePath || !this.#destinationPath) {
            const msg = this._colorize('Invalid input', 91);
            console.log(msg);
            return;
        }
        // Avoids creating of new wrong file due to createWriteStream if #sourcePath is not valid
        access(this.#sourcePath, (error) => {
            if (error) {
                const msg = this._colorize('Invalid input: source path does not exist', 91);
                console.log(msg);
            } else {
                const readStream = createReadStream(this.#sourcePath);
                const writeStream = createWriteStream(this.#destinationPath);
                const compressDecompressStream = action === 'Compression'
                                                ? createBrotliCompress()
                                                : createBrotliDecompress();

                pipeline(readStream, compressDecompressStream, writeStream, (error) => {
                    if (error) {
                        const errMsg = this._colorize('Operation failed:', 31);
                        console.error(errMsg, error.message);
                    } else {
                        const msg =  this._colorize(`${action} complete.`, 92);
                        console.log(msg);
                    }
                });
            }
        })
    }

    compressWithBrotli = () => {
        const action = 'Compression';
        this.#compressDecompressReducer(action);
    }

    deCompressWithBrotli = () => {
        const action = 'Decompression';
        this.#compressDecompressReducer(action);
    }
}

// compress fileForHash.txt ./src/executors/files/some.gz