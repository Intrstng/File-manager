import { createReadStream } from 'node:fs';
const { createHash } = await import('node:crypto');
import { Executor } from './Executor.js';

export class HashExecutor extends Executor {
    #name = 'hash';
    #destinationFilePath = '';

    set args (value) {
        if (value.length > 0) {
            this.#destinationFilePath = this._getPathToFileFromArgs(value[0]);
        }
    }

    calculateHash = async () => {
        if (!this.#destinationFilePath) {
            console.log(this._errMsgInvalidInput);
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
                this._prompt();
            }
        });

        input.on('error', (error) => {
            console.log(this._errMsgOperationFailed, error.message);
            this._prompt();
        });
    };
}