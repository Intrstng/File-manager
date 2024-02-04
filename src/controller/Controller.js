import {getUserNameFromArgs} from '../utils/getUserNameFromArgs.js';
import {parseInputArguments} from '../utils/parseInputArguments.js';
import path from 'path';
import * as readline from 'node:readline/promises';
import os from 'os';
import process from 'node:process';
import { HashExecutor } from '../executors/hashExecutor.js';
import { ZlibExecutor } from '../executors/zlibExecutor.js';
import { FsExecutor } from '../executors/fsExecutor.js';
import {OsExecutor} from '../executors/osExecutor.js';
import {NavigationExecutor} from '../executors/navigationExecutor.js';

export class Controller {
    #rl;
    #fs;
    #hash;
    #zlib;
    #os;
    #nav;

    #startCLI = async () => {
        this.#fs = new FsExecutor();
        this.#hash = new HashExecutor();
        this.#zlib = new ZlibExecutor();
        this.#os = new OsExecutor();
        this.#nav = new NavigationExecutor();

        const userName = await getUserNameFromArgs();
        // Define system disk
        const systemDrive = os.platform() === 'win32' ? process.env.SystemDrive : '/';
        const username = os.userInfo().username;
        let pathToHomeDirectory = path.join(systemDrive, 'Users', username);
        // let pathToHomeDirectory = os.homedir() // or we can also do

        this.#rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: this.#colorize(`\nYou are currently in ${pathToHomeDirectory}\n`, 33)
        });
        const greetPhrase = this.#colorize('Welcome to the File Manager, ', 36) +
                            this.#colorize(`${userName}!`, 35);
        console.log(greetPhrase);
        // Display the prompt
        this.#rl.prompt();
        process.chdir(pathToHomeDirectory);

        this.#rl.on('line', async (input) => {
            if (input === '.exit') {
                this.#rl.emit('SIGINT');
            };
            try {
                if (input) {
                    const parsedInputArgs = parseInputArguments(input);
                    this.#router(parsedInputArgs);
                }
            } catch (error) {
                console.error(error.message);
            }
            // Set the prompt again for the next input
            this.#rl.prompt();
        });

        this.#rl.on('SIGINT', () => {
            const exitPhrase =  this.#colorize('Thank you for using File Manager, ', 31) +
                                this.#colorize(userName, 94) +
                                this.#colorize(' goodbye!', 31);
            console.log(exitPhrase);
            process.exit(0);
        });
    }

    #router = (inputArgs) => {
        const [action, ...args] = inputArgs;

        this.#hash.args = args;
        this.#zlib.args = args;
        this.#fs.args = args;
        this.#fs.rl = this.#rl;
        this.#os.args = args;
        this.#nav.args = args;
        this.#nav.rl = this.#rl;

        const errMsg = this.#colorize('Invalid input', 91);
        const commands = {
            // fs
            'cat': this.#fs.showFileContent,
            'add': this.#fs.createEmptyFile,
            'rn': this.#fs.renameFile,
            'cp': this.#fs.copyFile,
            'mv': this.#fs.moveFile,
            'rm': this.#fs.deleteFile,
            // Hash
            'hash': this.#hash.calculateHash,
            // Navigation
            'up': this.#nav.moveUp,
            'cd': this.#nav.changeDir,
            'ls': this.#nav.showList,
            // OS
            '--EOL': this.#os.getEOL,
            '--cpus': this.#os.getCPUs,
            '--homedir': this.#os.getHomeDir,
            '--username': this.#os.getSysUsername,
            '--architecture': this.#os.getSysArch,
            // ZLib
            'compress': this.#zlib.compressWithBrotli,
            'decompress': this.#zlib.deCompressWithBrotli,
        };

        if (inputArgs[0] === 'os' && args.length === 0) {
            console.log(errMsg);
        } else if (inputArgs[0] === 'os') {
            args.forEach(arg => {
                commands.hasOwnProperty(arg)
                    ? commands[arg]()
                    : console.log(errMsg);
            })
        } else if (commands[action]) {
            commands[action]();
        } else {
            console.log(errMsg);
        }
    };

    #colorize = (text, colorCode) => `\x1b[${colorCode}m${text}\x1b[0m`;

    init = () => {
        this.#startCLI();
    }
}