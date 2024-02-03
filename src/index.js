import path from 'path';
import { getUserNameFromArgs } from './utils/getUserNameFromArgs.js';
import * as readline from 'node:readline/promises';
import os from 'os';
import process from 'node:process';
import { parseInputArguments } from './utils/parseInputArguments.js';
import { router } from './executors/router.js';
import { colorize } from './utils/colorize.js';


export const startCLI = async () => {
    const userName = await getUserNameFromArgs();
    // Define system disk
    const systemDrive = os.platform() === 'win32' ? process.env.SystemDrive : '/';
    // Define username
    const username = os.userInfo().username;
// Home directory (system_drive/Users/Username)
    let pathToHomeDirectory = path.join(systemDrive, 'Users', username);

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: colorize(`\nYou are currently in ${pathToHomeDirectory}\n`, 33)
        //prompt: `\x1b[33m\nYou are currently in ${pathToHomeDirectory}\x1b[0m\n`
    });
    const greetPhrase = colorize('Welcome to the File Manager, ', 36) +
                        colorize(`${userName}!`, 35);
    console.log(greetPhrase);
    // Display the prompt
    rl.prompt();
    process.chdir(pathToHomeDirectory);

    rl.on('line', async (input) => {
        if (input === '.exit') {
            rl.emit('SIGINT');
        };
        try {
            if (input) {
                const parsedInputArgs = parseInputArguments(input);
                router(parsedInputArgs);
            }
        } catch (error) {
            console.error(error); // !!!!!!!!!!!!!!!!!!!!
        }

        // Set the prompt again for the next input
        rl.prompt();
    });

    rl.on('SIGINT', () => {
        const exitPhrase =  colorize('Thank you for using File Manager, ', 31) +
                            colorize(userName, 94) +
                            colorize(' goodbye!', 31);
        console.log(exitPhrase);
        process.exit(0);
    });
}

await startCLI();