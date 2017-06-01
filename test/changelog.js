const {expect} = require('code')
const {describe, before, it} = require('mocha')

const Changelog = require('../lib/changelog')
const Version = require('../lib/version')
const {markdown} = require('../templates')

describe('Changelog parser', () => {

    it(`should get the changelog path`, (done) => {

        var path = Changelog.getPath()
        expect(path).to.be.string()

        done()
    })

    it(`should return null if a changelog could not be found`, (done) => {

        process.chdir('./test')
        var path = Changelog.getPath()
        expect(path).to.equal(null)
        process.chdir('../')

        done()
    })

    it(`should load the changelog`, (done) => {

        var path = Changelog.getPath()
        var changelog = Changelog.load(path)
        expect(changelog).to.be.string()

        done()
    })

    it(`should find the latest version from the changelog`, (done) => {
        var path = Changelog.getPath()
        var changelog = Changelog.load(path)
        var version = Changelog.getLatestVersion(changelog)
        expect(version).to.be.object()

        done()
    })

    it(`should return 0.0.0 as the version if one could not be found in the changelog`, (done) => {
        var version = Changelog.getLatestVersion('foobar')
        expect(version).to.be.object()
        expect(version.major).to.equal(0)
        expect(version.minor).to.equal(0)
        expect(version.patch).to.equal(0)

        done()
    })

    it(`should find the latest commit from the changelog`, (done) => {
        var path = Changelog.getPath()
        var changelog = Changelog.load(path)
        var commit = Changelog.getLatestCommit(changelog)

        expect(commit).to.be.string()
        done()
    })

    it(`should return null as the latest commit if one could not be found in the changelog`, (done) => {
        var commit = Changelog.getLatestCommit('foobar')
        expect(commit).to.equal(null)

        done()
    })

    it(`should return true if there are changes to write to the changelog`, (done) => {

        var commits = [{
            type: 'fix'
        }]

        var hasChanges = Changelog.hasChanges(commits)
        expect(hasChanges).to.equal(true)

        done()
    })

    it(`should return false if there are no changes to write to the changelog`, (done) => {

        var commits = [{
            type: 'chore'
        }]

        var hasChanges = Changelog.hasChanges(commits)
        expect(hasChanges).to.equal(false)

        done()
    })

    it(`should build a new changelog`, (done) => {

        var commits = [
            { 
                sha: '96fd323',
                type: 'feat',
                breaking: false,
                scope: 'Something',
                message: 'did something fun',
                author: 'logikal@gmail.com' 
            }, { 
                sha: '02d8333',
                type: 'breaking',
                breaking: true,
                scope: 'Something',
                message: 'i broke it all',
                author: 'logikal@gmail.com' 
            }
        ]

        var next = Version.getNext(commits)
        var current = Version.getCurrent()
        var changelog = Changelog.build(markdown, next, commits)

        expect(changelog).to.be.string()
        expect(changelog.indexOf(`# ${next.toString()}`)).to.be.greaterThan(-1)
        done()
    })
})