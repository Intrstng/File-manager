import path from 'path';
import { cwd } from 'node:process';

export class Executor {
    _getPathToFileFromArgs = (pathToFile) => {
        if (pathToFile) {
            return path.isAbsolute(pathToFile)
                ? path.normalize(pathToFile)
                : path.join(cwd(), pathToFile);
        }
    }
    _colorize = (text, colorCode) => `\x1b[${colorCode}m${text}\x1b[0m`;
}