#!/usr/bin/env node

const { Transform } = require('node:stream');

function usage(exitCode) {
  console.log(`NAME
\tget-strings - extract strings from javascript source files

SYNOPSIS
\tnpx get-strings [OPTION...] FILE...

OPTIONS
\t--json, -j
\t\toutput in JSON format
\t--jsonl, -l
\t\toutput in JSON lines format (default)
\t--null, -0
\t\toutput in null-terminated string format`);
  process.exit(exitCode);
}

const { readFileSync } = require('node:fs');
const { extname } = require('node:path');

const { getStrings, streamStrings } = require('./src');

const [,,...files] = process.argv;

const outputFormat = readOutputFormat();
function readOutputFormat() {
  switch(files[0]) {
    case '--null':
    case '-0':
      return files.shift() && 'null-terminated';
    case '--json':
    case '-j':
      return files.shift() && 'json';
    case '--jsonl':
    case '-l':
      files.shift();
      // falls through:
    default:
      return 'json-lines';
  }
}

if(!files.length) usage(1);
if(['--help', '--usage'].includes(files[0])) usage();

if(outputFormat === 'json') {
  const strings = files.flatMap(stringsFromFile);
  console.log(JSON.stringify(strings, null, 2));
} else if(outputFormat === 'json-lines') {
  const outstream = new Transform({
    writeableObjectMode: true,
    transform(chunk, encoding, callback) {
      try {
        callback(null, JSON.stringify(chunk.toString()) + '\n');
      } catch(err) {
        callback(err);
      }
    },
  });
  outstream.pipe(process.stdout);
  for(const f of files) streamStrings(readFileSync(f), outstream);
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
