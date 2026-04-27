#!/usr/bin/env node

const { readFileSync } = require('node:fs');
const { extname } = require('node:path');

const { getStrings } = require('./src');

const [,,...files] = process.argv;

let outputFormat;
if(files[0] === '--json') {
  outputFormat = 'json';
  files.shift();
}

if(outputFormat === 'json') {
  const strings = files.flatMap(stringsFromFile);
  console.log(JSON.stringify(strings, null, 2));
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
