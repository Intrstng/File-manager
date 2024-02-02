import path from 'path';
import { cwd } from 'node:process';

export class Executor {
    _getPathToFileForHashFromArgs = (pathToFile) => {
        if (pathToFile) {
            return path.isAbsolute(pathToFile)
                ? path.normalize(pathToFile)
                : path.join(cwd(), pathToFile);
        }
    }
}