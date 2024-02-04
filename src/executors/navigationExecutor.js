import path from 'path';
import {readdir, stat} from 'node:fs/promises';
import process, {cwd} from 'node:process';
import {Executor} from './executor.js';

export class NavigationExecutor extends Executor {
    #name = 'navigation';
    #rl ={};
    #destinationFilePath = '';

    set args (value) {
        if (value.length > 0) {
            this.#destinationFilePath = this._getPathToFileFromArgs(value[0]);
        }
    }

    set rl (value) {
        this.#rl = value;
    }

    #isDirectoryOrFile = async (destinationPath) => {
        const stats = await stat(destinationPath);
        return stats.isDirectory() ? 'directory' : stats.isFile()
                                   ? 'file' : 'unknown';
    };

    #setReadline = () => {
        this.#rl.setPrompt(this._colorize(`\nYou are currently in ${cwd()}\n`, 33));
    }

    moveUp = async () => {
        const pathToUpperDirectory = path.join(cwd(), '..');
        process.chdir(pathToUpperDirectory);
        this.#setReadline();
    }

    changeDir = async () => {
        try {
            process.chdir(this.#destinationFilePath);
            this.#setReadline();
        } catch (error) {
            console.log(this._errMsgOperationFailed, error.message);
        }
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
            console.log('\n');
            this.#rl.prompt();
        } catch (error) {
            console.log(this._errMsgOperationFailed, error.message);
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