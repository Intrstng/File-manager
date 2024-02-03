import path, { basename } from 'path';
import { readdir } from 'node:fs/promises';
import { cwd } from 'node:process';
import process from 'node:process';
import { rm, access, stat } from 'node:fs/promises';
import { Executor } from './executor.js';

export class NavigationExecutor extends Executor {
    #name = 'hash';
    #destinationFilePath;

    constructor(args) {
        super();
        if (args.length > 0) {
            this.#destinationFilePath = this._getPathToFileFromArgs(args[0]);
        }
    }

    moveUp = async () => {

    }

    changeDir = async () => {

    }

    #isDirectoryOrFile = async (destinationPath) => {
        const stats = await stat(destinationPath);
        return stats.isDirectory() ? 'directory' : stats.isFile()
                                   ? 'file' : 'unknown';
    };

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
        } catch (error) {
            const errMsg = this._colorize('Operation failed:', 31);
            console.log(errMsg, error.message);
        }



        // const dirnamePath = cwd();
        // try {
        //     const currentDir = cwd();
        //     const items = await readdir(currentDir);
        //
        //     let dirContentArray = [];
        //
        //     for (let i = 0; i < items.length; i++) {
        //         const itemPath = path.join(currentDir, data[i]);
        //         // console.log(cwd())
        //         // console.log(itemPath)
        //         const type = await this.#isDirectoryOrFile(itemPath);
        //         dirContentArray.push({
        //             Name: data[i],
        //             Type: type
        //         });
        //     }
        //     // console.log(dirContentArray)
        // } catch (err) {
        //     console.error(err);
        // }
    }
}

// const data = [
//     { id: 1, name: 'John', age: 30 },
//     { id: 2, name: 'Jane', age: 25 },
//     { id: 3, name: 'Bob', age: 35 }
// ];
//
// console.table(data);







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