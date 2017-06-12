var {execSync} = require('child_process')

var commit = {

    getCommits: (from) => {
        var cmd = `git --no-pager log -s --format='%h_EOH_%s_EOT_%B_EOC_%aE_EOE_' --no-color`

        if (from) {
            cmd = `${cmd} ${from}..HEAD`
        }

        var data = execSync(cmd)

        return data.toString().trim().split('_EOE_').filter(commit => commit !== '')
    },

    parseCommits: (data) => {
        var commits = data.map(commit => {
            var matches = commit.replace(/\n/gi, '').match(/(\w+)_EOH_(\w+)\((.*)\): (.*)_EOT_(.*)_EOC_(.*)/)
            if (matches === null) {
                return null
            }

            var isBreaking = matches[5].indexOf('BREAKING CHANGE') > -1

            return {
                sha: matches[1],
                type: isBreaking ? 'breaking' : matches[2].toLowerCase(),
                breaking: isBreaking,
                scope: `${matches[3][0].toUpperCase()}${matches[3].slice(1)}`,
                message: matches[4],
                author: matches[6]
            }
        }).filter(commit => commit !== null)

        return commits
    },

    getScopes: (commits) => {
        return commits.map(commit => commit.scope)
    }
}

module.exports = commit