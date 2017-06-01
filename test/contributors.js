const {expect} = require('code')
const {describe, before, it} = require('mocha')

const Contributors = require('../lib/contributors')
const Changelog = require('../lib/changelog')
const Commit = require('../lib/commit')

describe(`Contributors`, () => {

    it(`should return an empty array if there are no contributors in the changelog`, (done) => {

        var path = Changelog.getPath()
        var changelog = Changelog.load(path)

        changelog = changelog.replace(/<!--CONTRIBUTORS-->((.|\n|\r\n)*)<!--END_CONTRIBUTORS-->/, '')
        var contributors = Contributors.getFromChangelog(changelog)

        expect(contributors).to.be.array()

        done()
    })

    it(`should get the contributors from the changelog`, (done) => {
        var changelog = `
        
        <!--CONTRIBUTORS-->
            <ul>
            <li>logikal@gmail.com (5 commits)</li>
            <li>jay.baker@colensobbdo.co.nz (1 commit)</li>
            </ul>
        <!--END_CONTRIBUTORS-->
        `

        var contributors = Contributors.getFromChangelog(changelog)
        expect(contributors).to.be.array()
        expect(contributors[0]).to.be.object()

        done()
    })

    it(`should get the contributors from the commits`, (done) => {
        var data = Commit.getCommits()
        var commits = Commit.parseCommits(data)

        var contributors = Contributors.getFromCommits(commits)
        expect(contributors).to.be.array()

        done()
    })
})