import path from 'path';
import {readdir, stat} from 'node:fs/promises';
import process, {cwd} from 'node:process';
import {Executor} from './executor.js';

export class NavigationExecutor extends Executor {
    #name = 'navigation';
    #destinationFilePath;

    constructor(args) {
        super();
        if (args.length > 0) {
            this.#destinationFilePath = this._getPathToFileFromArgs(args[0]);
        }
    }

    #isDirectoryOrFile = async (destinationPath) => {
        const stats = await stat(destinationPath);
        return stats.isDirectory() ? 'directory' : stats.isFile()
            ? 'file' : 'unknown';
    };

    moveUp = async () => {
        const pathToUpperDirectory = path.join(cwd(), '..');
        process.chdir(pathToUpperDirectory);
        console.log(cwd()) // !!!!!
        //this._rl.setPrompt(`\nYou are currently in ${cwd()}\n`);
    }

    changeDir = async () => {
        process.chdir(this.#destinationFilePath);
        console.log(this.#destinationFilePath) // !!!!!
        //this._rl.setPrompt(`\nYou are currently in ${cwd()}\n`);
    }

    showList = async () => {
        try {
            const currentDir = cwd();
            const items = await readdir(currentDir);

            const files = [];
            const folders = [];

            for (const item of items) {
                const itemPath = path.join(currentDir, item);
                const type = await this.#isDirectoryOrFile(itemPath);
                const name = type === 'file' ? item : `${item}/`;

                if (type === 'file') {
                    files.push({
                        Name: name,
                        Type: type
                    });
                } else {
                    folders.push({
                        Name: name,
                        Type: type
                    });
                }
            }

            const sortedFolders = folders.sort((a, b) => a.Name.localeCompare(b.Name));
            const sortedFiles = files.sort((a, b) => a.Name.localeCompare(b.Name));

            const tableData = [...sortedFolders, ...sortedFiles];
            console.table(tableData);

            // ДОДЕЛАТЬ!!! После таблицы не показывает cwd()
            // const rl = readline.createInterface({
            //     input: process.stdin,
            //     output: process.stdout,
            //     prompt: colorize(`\nYou are currently in ${currentDir}\n`, 33)
            //     //prompt: `\x1b[33m\nYou are currently in ${pathToHomeDirectory}\x1b[0m\n`
            // });
            // rl.prompt();
        } catch (error) {
            const errMsg = this._colorize('Operation failed:', 31);
            console.log(errMsg, error.message);
        }
    }
}

// \x1b[30m: Black
// \x1b[31m: Red
// \x1b[32m: Green
// \x1b[33m: Yellow
// \x1b[34m: Blue
// \x1b[35m: Magenta
// \x1b[36m: Cyan
// \x1b[37m: White
// \x1b[90m: Bright black (gray)
// \x1b[91m: Bright red
// \x1b[92m: Bright green
// \x1b[93m: Bright yellow
// \x1b[94m: Bright blue
// \x1b[95m: Bright magenta
// \x1b[96m: Bright cyan
// \x1b[97m: Bright white