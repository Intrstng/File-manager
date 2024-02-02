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
            this.#sourcePath = this._getPathToFileForHashFromArgs(this.#args[0]);
            this.#destinationPath = this._getPathToFileForHashFromArgs(this.#args[1]);
        }
    }

    #compressDecompressReducer = (action) => {
        // If only one arg (#sourcePath) is entered, avoids crushing of app (due to invoking createWriteStream(this.#destinationPath))
        if (!this.#sourcePath || !this.#destinationPath) {
            console.log('\x1b[91mInvalid input\x1b[0m');
            return;
        }
        // Avoids creating of new wrong file due to createWriteStream if #sourcePath is not valid
        access(this.#sourcePath, (error) => {
            if (error) {
                console.log('\x1b[91mInvalid input: source path does not exist\x1b[0m');
            } else {
                const readStream = createReadStream(this.#sourcePath);
                const writeStream = createWriteStream(this.#destinationPath);
                const compressDecompressStream = action === 'Compression'
                                                ? createBrotliCompress()
                                                : createBrotliDecompress();

                pipeline(readStream, compressDecompressStream, writeStream, (error) => {
                    if (error) {
                        console.log('\x1b[31mOperation failed:\x1b[0m');
                        console.error(error.message);
                    } else {
                        console.log(`\x1b[92m${action} complete.\x1b[0m`);
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