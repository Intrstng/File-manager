import path from 'path';
import { createReadStream }  from 'node:fs';
const { createHash } = await import('node:crypto');
import { cwd } from "node:process";


export class HashExecutor {
    #name = 'hash';
    #destinationFilePath;
    #args;

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

    calculateHash = async() => {
        if (this.#args.length > 0) {
            this.#destinationFilePath = this.#getPathToFileForHashFromArgs(this.#args[0]);
            const hash = createHash('sha256');
            const input = await createReadStream(this.#destinationFilePath);

            input.on('readable', () => {
                const data = input.read();
                if (data)
                    hash.update(data);
                else {
                    const calculatedHash = hash.digest('hex');
                    console.log(calculatedHash);
                }
            });

            input.on('error', (error) => {
                console.log('\x1b[31mOperation failed:\x1b[0m');
                console.log(error.message);
            });
        } else {
            console.log('\x1b[91mInvalid input\x1b[0m');
        }
    };
}