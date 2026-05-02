#!/usr/bin/env node

function usage(exitCode) {
  console.log(`NAME
\tget-strings - extract strings from javascript source files

SYNOPSIS
\tnpx get-strings [OPTION...] FILE...

OPTIONS
\t--json
\t\toutput in JSON format
\t--jsonl
\t\toutput in JSON lines format`);
  process.exit(exitCode);
}

const { readFileSync } = require('node:fs');
const { extname } = require('node:path');

const { getStrings } = require('./src');

const [,,...files] = process.argv;

let outputFormat;
if(files[0] === '--json') {
  outputFormat = 'json';
  files.shift();
} else if(files[0] === '--jsonl') {
  outputFormat = 'json-lines';
  files.shift();
}

if(!files.length) usage(1);
if(['--help', '--usage'].includes(files[0])) usage();

if(outputFormat === 'json') {
  const strings = files.flatMap(stringsFromFile);
  console.log(JSON.stringify(strings, null, 2));
} else if(outputFormat === 'json-lines') {
  for(const f of files) {
    for(const s of stringsFromFile(f)) process.stdout.write(JSON.stringify(s) + '\n');
  }
} else {
  let hasPrevious;
  for(const f of files) {
    for(const s of stringsFromFile(f)) {
      if(hasPrevious) process.stdout.write('\0');
      process.stdout.write(s);
      hasPrevious = true;
    }
  }
}

function stringsFromFile(f) {
  switch(extname(f)) {
    case '.js': return getStrings(readFileSync(f));
    case '.coffee': return fatal(`
Failed with file: ${f}

.coffee not supported; try:

  get-strings <(npx coffee -c "${f}")`);
    default: throw new Error(`Unrecognised extension for file '${f}'`);
  }
}

function fatal(message) {
  console.log(message);
  process.exit(1);
}
