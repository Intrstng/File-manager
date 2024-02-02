import { createReadStream } from 'node:fs';
const { createHash } = await import('node:crypto');
import { Executor } from './executor.js';

export class HashExecutor extends Executor {
    #name = 'hash';
    #destinationFilePath;

    constructor(args) {
        super();
        if (args.length > 0) {
            this.#destinationFilePath = this._getPathToFileForHashFromArgs(args[0]);
        }
    }

    calculateHash = async () => {
        if (!this.#destinationFilePath) {
            console.log('\x1b[91mInvalid input\x1b[0m');
            return;
        }
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
    };
}