import { HashExecutor } from './hashExecutor.js';
import {parseInputArguments} from '../utils/parseInputArguments.js';
import { ZlibExecutor } from './zlibExecutor.js';
import { FsExecutor } from './fsExecutor.js';
import { colorize } from '../utils/colorize.js';
import {OsExecutor} from './osExecutor.js';

export const router = (inputArgs) => {
    const [action, ...args] = inputArgs;

    const hash = new HashExecutor(args);
    const zlib = new ZlibExecutor(args);
    const fs = new FsExecutor(args);
    const os = new OsExecutor(args);

    const commands = {
        // fs
        'cat': fs.showFileContent,
        'add': fs.createEmptyFile,
        'rn': fs.renameFile,
        'cp': fs.copyFile,
        'mv': fs.moveFile,
        'rm': fs.deleteFile,
        // Hash
        'hash': hash.calculateHash,
        // Navigation
        'up': 'up',
        'cd': 'cd',
        'ls': 'ls',
        // OS
        '--EOL': os.getEOL,
        '--cpus': 'getCPUs',
        '--homedir': 'getHomeDir',
        '--username': 'getSysUsername',
        '--architecture': 'getSysArch',
        // ZLib
        'compress': zlib.compressWithBrotli,
        'decompress': zlib.deCompressWithBrotli,
    };

    if (inputArgs[0] === 'os' && commands[args[0]]) {
        commands[args[0]]();
    } else if (commands[action]) {
        commands[action]();
    } else {
        const errMsg = colorize('Invalid input', 91);
        console.log(errMsg);
    }
};