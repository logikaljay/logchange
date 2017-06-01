#!/usr/bin/env node

var {readFileSync, writeFileSync, existsSync: exists} = require('fs')
var {join} = require('path')
var {exec} = require('child_process')
var program = require('commander')

var Commit = require('./lib/commit')
var {bump} = require('./lib/package')
var {body: html} = require('./templates/html')
var {body: markdown} = require('./templates/markdown')

program
    .version('1.0.0')
    .option('-j, --json', 'just output a version as json')
    .option('-s, --stdout', 'output to stdout instead of file')
    .option('-f, --format <format>', 'format to output in [markdown, html]', 'markdown')
    .option('-o, --file <file>', 'changelog file to read/write', 'CHANGELOG.md')
    .parse(process.argv)

var template = program.format.toLowerCase() === 'html' ? html : markdown
var file = program.file

var changelogPath = join(process.env.PWD, file)

var major = 0
var minor = 0
var patch = 0

var commits = []
var breakingChanges = []
var features = []
var fixes = []
var lastCommit = ""
var oldChangelog = ""

// check if a changelog already exists
if (exists(changelogPath)) {
    var oldChangelog = readFileSync(changelogPath).toString()

    var version = oldChangelog.match(/data\-major\=\"(\d+)\" data\-minor\=\"(\d+)\" data\-patch\=\"(\d+)\"/)
    if (version !== null) {
        major = version[1]
        minor = version[2]
        patch = version[3]
    }

    lastCommit = oldChangelog.match(/data\-commit\=\"(\w+)\"/)
    if (lastCommit !== null) {
        lastCommit = lastCommit[1]
    }
}

var cmd = `git --no-pager log -s --format='%h_EOH_%s_EOT_%B_EOC_%aE_EOE_' --no-color`
if (lastCommit !== null && lastCommit.length > 0) {
    cmd = `${cmd} ${lastCommit}..HEAD`
}

exec(cmd, { maxBuffer: Infinity }, (err, data) => {
    commits = data.split('_EOE_')

    var index = 0
    if (data.length > 0) {
        lastCommit = new Commit(commits[index])

        // lastCommit might not be an angular style commit message
        while (typeof lastCommit.sha === 'undefined' && index < commits.length) {
            index++
            lastCommit = new Commit(commits[index])
        }

        commits = commits.reverse()
        handleCommits(commits)
    }

    if (program.json) {
        process.stdout.write(JSON.stringify({ version: `${major}.${minor}.${patch}`, display: `v${major}.${minor}.${patch}`, major, minor, patch }))
        return
    }

    // don't build a changelog if there are no commits
    var hasCommits = false
    var sections = [breakingChanges, features, fixes]
    sections.forEach((section) => {
        if (section.length > 0) {
            hasCommits = true
        }
    })

    if (!hasCommits) {
        console.log('There were no new commits to release.')
        return
    }

    buildChangelog(breakingChanges, features, fixes)
    bumpVersion({ major, minor, patch })
})

var handleCommits = (commits) => {

    // we don't want to bump 6 feature version at once if there were 6 `feat` commits since last time we ran - we only want to bump once.

    var bumpMajor = false
    var bumpMinor = false
    var bumpPatch = false

    // iterate over our commits
    for (var c in commits) {
        var commit = new Commit(commits[c])

        if (commit.type === 'fix') {
            bumpPatch = true
            fixes.push(commit)
        }
        else if (commit.type === 'feat') {
            bumpMinor = true
            features.push(commit)
        }
        else if (commit.type === 'major') {
            bumpMajor = true
            breakingChanges.push(commit)
        }
    }

    if (bumpMajor) {
        major++
        minor = 0
        patch = 0
        return
    }
    else if (bumpMinor) {
        minor++
        patch = 0;
        return
    }
    else if (bumpPatch) {
        patch++
        return
    }
}

var buildChangelog = (...sections) => {

    var newChangelog = template({ major, minor, patch }, lastCommit, ...sections)
    if (!program.stdout) {
        writeFileSync(changelogPath, newChangelog + oldChangelog)
        console.log(`Wrote ${commits.length} ${commits.length !== 1 ? 'commits' : 'commit'} to ${file}`)
    }
    else {
        process.stdout.write(newChangelog + oldChangelog)
    }
}

var bumpVersion = (version) => {
    if (program.stdout) {
        return
    }

    var result = bump(version)
    if (typeof result === 'undefined') {
        return
    }

    var {file, oldVersion, newVersion} = result
    console.log(`Bumped ${file} version from ${oldVersion} to ${newVersion}`)
}
