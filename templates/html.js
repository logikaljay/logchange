var template = {

    body: (version, lastCommit, ...sections) => {
        var commits = []
        sections.forEach((section) => {
            commits = commits.concat(section)
        })

        var output = `
            <div data-major="${version.major}" data-minor="${version.minor}" data-patch="${version.patch}" data-commit="${lastCommit}" class="release-body commit">
                <div class="release-header">
                    <h1 class="release-title">v${version.major}.${version.minor}.${version.patch}</h1>
                    <p class="release-authorship"><strong>${process.env.LOGNAME}</strong> released this on ${new Date()} - ${commits.length} ${commits.length !== 1 ? 'commits' : 'commit'} ${commits.length === 1 ? 'makes' : 'make'} up this release</p>
                    ${sections.map((section) => {
                        return template.section(section)
                    }).join('')}
                </div>
            </div>
        `

        return output.replace(/^\s*[\r\n ]/gm, '')
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
            <h3>${title}</h3>
            <ul>
                ${commits.map((commit) => {
                    return template.commit(commit)
                }).join('')}
            </ul>
        `
    },

    commit: (commit) => {
        return `
            <li><strong>${commit.scope}:</strong> ${commit.message} (${commit.sha})</li>
        `
    }
}

module.exports = template