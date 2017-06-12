var {existsSync, readFileSync} = require('fs')

const Version = require('./version')

const changelog = {
    getPath: (file) => {

        var paths = [
            `${process.cwd()}/${file}`,
            `${process.cwd()}/CHANGELOG.md`,
            `${process.cwd()}/changelog.md`,
            `${process.cwd()}/CHANGELOG.html`,
            `${process.cwd()}/changelog.html`,
            `${process.cwd()}/CHANGELOG.htm`,
            `${process.cwd()}/changelog.htm`
        ]

        for (var p in paths) {
            if (existsSync(paths[p])) {
                return paths[p]
            }
        }

        return null
    },

    load: (path) => {
        return readFileSync(path).toString()
    },

    getLatestVersion: (changelog) => {
        var version = changelog.match(/data\-major\=\"(\d+)\" data\-minor\=\"(\d+)\" data\-patch\=\"(\d+)\"/)
        if (version === null) {
            return Version.format()
        }

        return Version.format(...version)
    },

    getLatestCommit: (changelog) => {
        var lastCommit = changelog.match(/data\-commit\=\"(\w+)\"/)
        if (lastCommit === null) {
            return null
        }

        return lastCommit[1]
    },

    hasChanges: (commits) => {
        var hasChanges = false

        for (var c in commits) {
            if (commits[c].type === 'breaking' || commits[c].type === 'fix' || commits[c].type === 'feat') {
                hasChanges = true
            }
        }

        return hasChanges
    },

    build: (template, version, commits) => {
        var path = changelog.getPath()
        var oldChangelog = changelog.load(path)
        var latestCommit = commits[0].sha

        // split our commits array in to a 2d array of [breaking, feature, fixes]
        var commitsBySection = [
            commits.filter(commit => commit.breaking),
            commits.filter(commit => commit.type === 'feat'),
            commits.filter(commit => commit.type === 'fix')
        ]

        var newChangelog = template.body(version, latestCommit, ...commitsBySection)

        return newChangelog + oldChangelog
    }
}

module.exports = changelog