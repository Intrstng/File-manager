import path from 'path';
import { cwd } from 'node:process';

export class Executor {
    _errMsgOperationFailed;
    _errMsgInvalidInput;
    constructor () {
        this._errMsgOperationFailed = this._colorize('Operation failed:', 31);
        this._errMsgInvalidInput = this._colorize('Invalid input', 91);
    }

    _getPathToFileFromArgs = (pathToFile) => {
        if (pathToFile) {
            return path.isAbsolute(pathToFile)
                ? path.normalize(pathToFile)
                : path.join(cwd(), pathToFile);
        }
    }

    _prompt = () => {
        const msg = this._colorize(`\nYou are currently in ${cwd()}`, 33);
        console.log(msg);
    }

    _colorize = (text, colorCode) => `\x1b[${colorCode}m${text}\x1b[0m`;
}