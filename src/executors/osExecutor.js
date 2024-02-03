import { basename } from 'path';
import process from 'node:process';
import os from 'node:os';
import { Executor } from './executor.js';

export class OsExecutor extends Executor {
    #name = 'os';

    getEOL = async () => {
        const defaultEOL = os.EOL;
        const msg = this._colorize('Default End-Of-Line (EOL) sequence: ', 92) +
                    this._colorize(`${JSON.stringify(defaultEOL)}\n`, 93);
        await process.stdout.write(msg);
    }

    getCPUs = async () => {
        const msg = this._colorize('Overall amount of CPU\'s: ', 94) +
                    this._colorize(`${os.availableParallelism()}\n`, 92);
        process.stdout.write(msg);
        // console.log(os.cpus().length) - we can also use
        const data = os.cpus().map(({model, speed}) => ({
            'Model': model.trim(),
            'Clock rate (GHz)': speed / 1000
        }));
        console.table(data);
    }

    getHomeDir = async () => {
        const homedir = this._colorize('Home directory: ', 92) +
                        this._colorize(`${os.homedir()}\n`, 93);
        process.stdout.write(homedir);
    }

    getSysUsername = async () => {
        const username =  this._colorize('System user name: ', 92) +
                          this._colorize(`${os.userInfo().username}\n`, 93);
        process.stdout.write(username);
    }

    getSysArch = async () => {
        const architecture =  this._colorize('CPU architecture: ', 92) +
                              this._colorize(`${os.arch()}\n`, 93);
        process.stdout.write(architecture);
    }
}

// os --EOL --cpus --homedir --username --architecture





