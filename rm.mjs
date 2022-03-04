#!/bin/node
import {rm} from 'fs/promises';
const argsarray = process.argv.slice(2);
const normal_args = argsarray.filter((val)=>{
    return /^[^-]|^[^-][^-]/.test(val);
})

const available_opts = ['-r', '--recursive', '--verbose', '-v', '--help'];
const getOpts = argsarray.filter((val)=>{
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
    -r  --recursive recursive : to delete directories
    -v  --verbose verbose : for verbose messages`)
    process.exit(0)
}

const RECURSIVE = (getOpts.includes('-r') | getOpts.includes('--recursive')) ? true : false;
const VERBOSE = (getOpts.includes('-v') | getOpts.includes('--verbose')) ? true : false;

let options = {
        recursive: RECURSIVE
};

for (let item of normal_args) {

    try {
        await rm(item, options);
        if (VERBOSE)
            console.log(`successfully deleted ${item}`);
    } catch (error) {
        console.error('there was an error:', error.message);
    }
}
