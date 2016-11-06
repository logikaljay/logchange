 class Commit {
    constructor (commit) {
        var matches = commit.replace(/\n/gi, '').match(/(\w+)_EOH_(\w+)\((\w+)\)\: (.*)_EOT_(.*)_EOC_(.*)/)
        if (matches !== null) {
            this.sha = matches[1]
            this.type = matches[2]
            this.scope = matches[3]
            this.message = matches[4]
            this.author = matches[6]
            this.breaking = matches[5].indexOf('BREAKING CHANGE') > -1
            if (this.breaking) {
                this.type = 'breaking'
            }
        }
    }
}

module.exports = Commit