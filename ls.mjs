#!/usr/bin/env node
import { readdir } from 'fs/promises'
import chalk  from 'chalk'
const log = console.log;
const argsarray = process.argv.slice(2);
const normal_args = argsarray.filter((val) => {
    return /^[^-]|^[^-][^-]/.test(val);
})

const available_opts = ['--help'];
const getOpts = argsarray.filter((val) => {
    let opt = /^-\w+|^--\w+/.test(val);
    if (opt && !available_opts.includes(val)) {
        console.error(`unknown option : ${val}`);
        process.exit(2);
    }
    return opt;
})

if (!argsarray.length) {
    normal_args.push('.');
}

if (getOpts.includes('--help')) {
    log(chalk.italic(`ls [OPTIONS...] [FILES...]`));
    process.exit(0)
}
let options = {
    withFileTypes: true
};

for (let item of normal_args) {
    try {
        log(chalk.bold(`${item} : `));
        for (let val of await readdir(item, options)) {
            if (val.isDirectory())
                log(chalk.blue.bold(val.name));
            log(val.name);
        }
    } catch (error) {
        console.error('there was an error:', error.message);
    }
}
