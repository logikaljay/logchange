# logchange

Automatically generate a new version and changelog by parsing <a href="https://gist.github.com/stephenparish/9941e89d80e2bc58a153#format-of-the-commit-message" target="_blank">angular style git commit messages</a>.

## Installation

### Global
```bash
$ npm install -g logchange
```

### Local
```bash
$ npm install logchange
```

Add logchange as a script to your `package.json`

```json
{
    ...
    "scripts": {
        ...
        "logchange": "logchange"
    }
}
```

## Commit messages mapping to versions
### Breaking changes 
```
feat(Scope): message

BREAKING CHANGE:
Some breaking change here.
```

This will increment the MAJOR version.

### Features
```
feat(Scope): message
``` 

This will increment the MINOR version.

### Fixes
```
fix(Scope): message
```

This will increment the PATCH version.

## Usage

```text
  Usage: version [options]

  Options:

    -h, --help             output usage information
    -V, --version          output the version number
    -j, --json             just output a version as json
    -s, --stdout           output to stdout instead of file
    -f, --format <format>  format to output in [markdown, html]
    -o, --file <file>      changelog file to read/write
```

## Process

1. Write your code
2. Commit your code using <a href="https://gist.github.com/stephenparish/9941e89d80e2bc58a153#format-of-the-commit-message" target="_blank">angular style commits</a>
3. Test your code
4. Run `logchange` (globally) / Run `npm run logchange` (locally) / Run `yarn logchange` (locally/yarn)
5. Commit your `package.json` and `CHANGELOG.md` with a `chore(Version): updating version and changelog` message. - message doesn't really matter - as long as its a `chore` otherwise, it may increment your version the next time you run `logchange`

## TODO

- [x] fix issue with multiple version being bumped per execution.
- [x] rewrite to support testing/coverage
- [x] rework options to be a bit more intuitive
- [x] add `logchange scopes` to iterate over the git log and return all the scopes already used
- [ ] create contributors template, automatically increment number of commits against each contributor
- [x] add `logchange current` to output the current version
- [x] add `logchange next` to output what the next version will be
- [x] format the scopes to all start with a capital letter, regardless of what case was used in the commit