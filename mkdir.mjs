#!/bin/node
import {mkdir} from 'fs/promises'
const argsarray = process.argv.slice(2);
const normal_args = argsarray.filter((val) => {
    return /^[^-]|^[^-][^-]/.test(val);
})

const available_opts = ['-p', '--parents', '--verbose', '-v', '--help'];
const getOpts = argsarray.filter((val) => {
    let opt = /^-\w+|^--\w+/.test(val);
    if (opt && !available_opts.includes(val)) {
        console.error(`unknown option : ${val}`);
        process.exit(2);
    }
    return opt;
})

if (!argsarray.length) {
    console.log('missing arguments\nuse --help for help');
    process.exit(1);
}

if (getOpts.includes('--help')) {
    console.log(`rm [OPTIONS...] [FILES...]
    -p --parents : create parent directories if they don't exist
    -v  --verbose verbose : for verbose messages`)
    process.exit(0)
}

const PARENTS = (getOpts.includes('-p') | getOpts.includes('--parents')) ? true : false;
const VERBOSE = (getOpts.includes('-v') | getOpts.includes('--verbose')) ? true : false;

const options = {
    recursive: PARENTS
};
for (let item of normal_args) {
    try {
        await mkdir(item, options);
        if (VERBOSE)
            console.log(`successfully created directory: ${item}`);
    } catch (error) {
        console.error('there was an error:', error.message);
    }
}
