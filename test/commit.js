const {expect} = require('code')
const {describe, before, it} = require('mocha')

const Commit = require('../lib/commit')

describe('Commit parser', () => {

    it(`it should get commit data`, (done) => {
        var commits = Commit.getCommits()
        expect(commits).to.be.array()

        done()
    })

    it(`should get a commits from a specific commit`, (done) => {
        var commits = Commit.getCommits('HEAD~1')
        expect(commits).to.be.array()
        expect(commits.length).to.equal(1)

        done()
    })

    it(`should parse commit data correctly`, (done) => {
        var data = Commit.getCommits()
        var commits = Commit.parseCommits(data)

        expect(commits).to.be.array()
        expect(commits[0]).to.be.object()
        expect(commits[0].sha).to.be.string()
        expect(commits[0].type).to.be.string()
        expect(commits[0].scope).to.be.string()
        expect(commits[0].message).to.be.string()
        expect(commits[0].author).to.be.string()

        done()
    })

    it(`should ignore non-angular style commits correctly`, (done) => {
        var data = Commit.getCommits()
        data.push('foobar')
        var commits = Commit.parseCommits(data)

        expect(commits).to.be.array()
        expect(commits[commits.length - 1].message).to.not.equal('foobar')

        done()
    })

    it(`should return the scopes for commits`, (done) => {
        var data = Commit.getCommits()
        var commits = Commit.parseCommits(data)

        var scopes = Commit.getScopes(commits)
        expect(scopes).to.be.array()

        done()
    })
})