#!/usr/local/bin/node 

var {readFileSync, writeFileSync, existsSync: exists} = require('fs')
var {join} = require('path')
var {exec} = require('child_process')
var program = require('commander')

var Commit = require('./lib/commit')
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
    lastCommit = new Commit(commits[0])
    commits = commits.reverse()

    commits.forEach(handleCommit)

    if (program.json) {
        process.stdout.write(JSON.stringify({ version: `${major}.${minor}.${patch}`, display: `v${major}.${minor}.${patch}`, major, minor, patch }))
        return
    }

    buildChangelog(breakingChanges, features, fixes)
})

var handleCommit = (commit) => {
    var data = new Commit(commit)

    if (data.type === 'fix') {
        fixes.push(data)
        patch++
    }
    else if (data.type === 'feat') {
        features.push(data)
        patch = 0
        minor++
    }

    if (data.breaking) {
        breakingChanges.push(data)
        minor = 0
        patch = 0
        major++
    }
}

var buildChangelog = (...sections) => {

    // don't write an empty section
    var hasCommits = false
    sections.forEach((section) => {
        if (section.length > 0) {
            hasCommits = true
        }
    })

    if (!hasCommits) {
        console.log('There were no new commits to release.')
        return
    }

    var newChangelog = template({ major, minor, patch }, lastCommit, ...sections)
    if (!program.stdout) {
        writeFileSync(changelogPath, newChangelog + oldChangelog)
        console.log(`Wrote ${commits.length} ${commits.length !== 1 ? 'commits' : 'commit'} to ${file}`)
    }
    else {
        process.stdout.write(newChangelog + oldChangelog)
    }
}