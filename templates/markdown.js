var template = {

    body: (version, lastCommit, ...sections) => {
        var commits = []
        sections.forEach((section) => {
            commits = commits.concat(section)
        })

        var output = `
            <!---
            <div data-major="${version.major}" data-minor="${version.minor}" data-patch="${version.patch}" data-commit="${lastCommit}" class="release-body commit">
            -->
            
            # v${version.major}.${version.minor}.${version.patch}
            **${process.env.LOGNAME}** released this on *${new Date()}* - ${commits.length} ${commits.length !== 1 ? 'commits' : 'commit'} ${commits.length === 1 ? 'makes' : 'make'} up this release
            ${sections.map((section) => {
                return template.section(section)
            }).join('')}
        `

        return output.replace(/  /gi, '')
    },

    section: (commits) => {
        if (commits.length === 0) {
            return
        }

        var title = commits[0].type === 'fix' ? 'Fixes' : 'Features'
        if (commits[0].breaking) {
            title = 'Breaking Changes'
        }

        return `
            ## ${title}
            ${commits.map((commit) => {
                return template.commit(commit)
            }).join('')}
        `
    },

    commit: (commit) => {
        return `* **${commit.scope}:** ${commit.message} (${commit.sha})
        `
    }
}

module.exports = template