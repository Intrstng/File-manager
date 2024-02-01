import {HashExecutor} from './hashExecutor.js';
import {parseInputArguments} from '../utils/parseInputArguments.js';

export const router = (inputArgs) => {
    const [action, ...args] = inputArgs;

    const hashFn = new HashExecutor(args);

    const commands = {
        // fs
        //     'cat': 'readFile',
        'cat': function () {
            console.log('cat2024')
        },
        'add': 'createEmptyFile',
        'rn': 'renameFile',
        'cp': 'copyFile',
        'mv': 'moveFile',
        'rm': 'removeFile',
        // Hash
        'hash': hashFn.calculateHash,
        // Navigation
        'up': 'up',
        'cd': 'cd',
        'ls': 'ls',
        // OS
        '--EOL': 'getEOL',
        '--cpus': 'getCPUs',
        '--homedir': 'getHomeDir',
        '--username': 'getSysUsername',
        '--architecture': 'getSysArch',
        // ZLib
        'compress': 'compress',
        'decompress': 'decompress',
    };



    if (inputArgs[0] === 'os' && commands[args[0]]) {
        console.log(`Your OS input ${inputArgs[0]} ${commands[args[0]]}`); // change to action
    } else if (inputArgs[0] === 'os' && !commands[args[0]]) {
        console.log('Invalid input');
    } else if (commands[action]) {
        //console.log(`Your input ${commands[action]}`);   // change to action
        commands[action]();
    } else {
        console.log('Invalid input');
    }
};