import { HashExecutor } from './hashExecutor.js';
import {parseInputArguments} from '../utils/parseInputArguments.js';
import { ZlibExecutor } from './zlibExecutor.js';
import { FsExecutor } from './fsExecutor.js';
import { colorize } from '../utils/colorize.js';
import {OsExecutor} from './osExecutor.js';
import {NavigationExecutor} from './navigationExecutor.js';

export const router = (inputArgs) => {
    const [action, ...args] = inputArgs;

    const hash = new HashExecutor(args);
    const zlib = new ZlibExecutor(args);
    const fs = new FsExecutor(args);
    const os = new OsExecutor(args);
    const nav = new NavigationExecutor(args);

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
        'up': nav.moveUp,
        'cd': nav.changeDir,
        'ls': nav.showList,
        // OS
        '--EOL': os.getEOL,
        '--cpus': os.getCPUs,
        '--homedir': os.getHomeDir,
        '--username': os.getSysUsername,
        '--architecture': os.getSysArch,
        // ZLib
        'compress': zlib.compressWithBrotli,
        'decompress': zlib.deCompressWithBrotli,
    };

    const errMsg = colorize('Invalid input', 91);

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

