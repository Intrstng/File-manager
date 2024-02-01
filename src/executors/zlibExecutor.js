import path from 'path';
import {cwd} from "node:process";
import {createReadStream, createWriteStream} from 'fs';
import {createBrotliCompress} from 'zlib';
import {pipeline} from 'stream';


export class ZlibExecutor {
    #name = 'zlib';
    #args;
    #sourcePath;
    #destinationPath;

    constructor(args) {
        this.#args = args;
    }

    #getPathToFileForHashFromArgs = (pathToFile) => {
        if (pathToFile) {
            return path.isAbsolute(pathToFile)
                ? path.normalize(pathToFile)
                : path.join(cwd(), pathToFile);
        }
    }

    compressWithBrotli = async () => {
        if (this.#args.length > 1) {
            this.#sourcePath = this.#getPathToFileForHashFromArgs(this.#args[0]);
            this.#destinationPath = this.#getPathToFileForHashFromArgs(this.#args[1]);

            // Avoids creating of new wrong file due to createReadStream if #sourcePath is not valid
            if (!this.#sourcePath || !this.#destinationPath) {
                console.log('\x1b[91mInvalid input\x1b[0m');
                return;
            }

            const readStream = await createReadStream(this.#sourcePath);
            const compressStream = await createBrotliCompress();
            const writeStream = await createWriteStream(this.#destinationPath);

            pipeline(readStream, compressStream, writeStream, (error) => {
                if (error) {
                    console.log('\x1b[31mOperation failed:\x1b[0m');
                    console.error(error.message);
                } else {
                    console.log('\x1b[92mCompression complete.\x1b[0m');
                }
            });
        } else {
            console.log('\x1b[91mInvalid input\x1b[0m');
        }
    }
}

// compress fileForHash.txt ./src/executors/files/some.gz