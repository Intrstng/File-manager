import path from 'path';
import {getUserNameFromArgs} from './utils/getUserNameFromArgs.js';
import * as readline from 'node:readline/promises';
import os from 'os';
import process from 'node:process';
import {parseInputArguments} from './utils/parseInputArguments.js';
import {router} from './executors/router.js';


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
        prompt: `\nYou are currently in ${pathToHomeDirectory}\n`
    });
    console.log('\x1b[36m%s\x1b[0m', `Welcome to the File Manager, ${userName}!`);
    // Display the prompt
        rl.prompt();

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
        console.log('\x1b[31m%s\x1b[0m', `Thank you for using File Manager, ${userName}, goodbye!`);
        process.exit(0);
    });
}

await startCLI();