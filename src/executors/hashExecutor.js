import { createReadStream } from 'node:fs';
const { createHash } = await import('node:crypto');
import { Executor } from './executor.js';

export class HashExecutor extends Executor {
    #name = 'hash';
    #destinationFilePath;

    constructor(args) {
        super();
        if (args.length > 0) {
            this.#destinationFilePath = this._getPathToFileFromArgs(args[0]);
        }
    }

    calculateHash = async () => {
        if (!this.#destinationFilePath) {
            const msg = this._colorize('Invalid input', 91);
            console.log(msg);
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
            const errMsg = this._colorize('Operation failed:', 31);
            console.log(errMsg, error.message);
        });
    };
}