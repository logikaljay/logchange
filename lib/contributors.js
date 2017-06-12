var contributors = {
    getFromChangelog: (changelog) => {
        // parse changelog - look for contributors section
        /*
        <!--CONTRIBUTORS-->
            <ul>
            <li>logikal@gmail.com (5 commits)</li>
            <li>jay.baker@colensobbdo.co.nz (1 commit)</li>
            </ul>
        <!--END_CONTRIBUTORS-->
        */
        var contributors = []
        var section = changelog.match(/<!--CONTRIBUTORS-->((.|\n|\r\n)*)<!--END_CONTRIBUTORS-->/)
        if (section && section.length === 3) {
            contributors = section[1].match(/<li>((.*?)) \((\d+) (commit|commits)\)<\/li>/gi)
            contributors = contributors.map(c => {
                c = c.replace('<li>', '').replace('</li>', '')
                c = c.split(/\((\d+) (commit|commits)\)/)
                return {
                    author: c[0].trim(),
                    commits: Number(c[1])
                }
            })
        }

        return contributors
    },

    getFromCommits: (commits) => {

        var contributors = []
        commits.forEach(c => {
            var {author} = c
            if (typeof contributors[author] !== 'undefined') {
                contributors[author] = contributors[author] + 1
            }
            else {
                contributors[author] = 1
            }
        })


        contributors = Object.keys(contributors).map(key => {
            return { author: key, commits: contributors[key] }
        })

        return contributors
    }
}

module.exports = contributors