`get-strings`
=============

NodeJS utility for getting strings defined in Javascript source files.

## Usage

```sh
npx get-strings path/to/source.js
```

## Output formats

### JSON Lines

This is the default output format.

```sh
$ npx get-strings --jsonl example.js
"a"
"b"
"c"
```

### JSON

```sh
$ npx get-strings --json example.js
[
  "a",
  "b",
  "c"
]
```

### Null-terminated strings

Note: this format will not escape null characters in extracted strings.

```sh
$ npx get-strings -0 example.js | xargs -0 -n1
a
b
c
```
