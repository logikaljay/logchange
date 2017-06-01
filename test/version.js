const {expect} = require('code')
const {describe, before, it} = require('mocha')

const Version = require('../lib/version')
const {version: pkgVersion} = require('../package.json')

describe('Version parser', () => {

    it(`should format a version correctly`, (done) => {
        var version = Version.format(1,0,0)
        expect(version).to.be.object()
        expect(version.major).to.equal(1)
        expect(version.minor).to.equal(0)
        expect(version.patch).to.equal(0)

        done()
    });

    ['1.1.1', 'v1.1.1', 'v 1.1.1'].forEach(v => {
        it(`should parse '${v}' correctly`, (done) => {
            var version = Version.parseVersion(v)
            expect(version).to.be.object()
            expect(version.major).to.equal(1)
            expect(version.minor).to.equal(1)
            expect(version.patch).to.equal(1)

            done()
        })
    })

    it(`should return '0.0.0' if unable to parse the version`, (done) => {
        var version = Version.parseVersion(1)
        expect(version).to.be.object()
        expect(version.major).to.equal(0)
        expect(version.minor).to.equal(0)
        expect(version.patch).to.equal(0)

        done()
    })

    it(`should load the current version correctly`, (done) => {
        var version = Version.getCurrent()
        expect(version).to.be.object()

        done()
    })

    it(`should return '0.0.0' if the package.json is not available`, (done) => {
        process.chdir('./templates')

        var version = Version.getCurrent()
        expect(version).to.be.object()
        expect(version.major).to.equal(0)
        expect(version.minor).to.equal(0)
        expect(version.patch).to.equal(0)

        process.chdir('../')

        done()
    })

    it(`should return '0.0.0' if the package.json does not have a version property`, (done) => {
        process.chdir('./test')
        var version = Version.getCurrent()
        expect(version).to.be.object()
        expect(version.major).to.equal(0)
        expect(version.minor).to.equal(0)
        expect(version.patch).to.equal(0)
        process.chdir('../')

        done()
    })

    it(`should return the next version when a patch is committed`, (done) => {
        var commits = [{
            sha: '123456',
            type: 'fix',
            breaking: false,
            scope: 'Something',
            message: 'fixed something',
            author: 'logikal@gmail.com'
        }]

        var current = Version.getCurrent()
        var next = Version.getNext(commits)
        expect(next.major).to.equal(current.major)
        expect(next.minor).to.equal(current.minor)
        expect(next.patch).to.equal(current.patch + 1)

        done()
    })

    it(`should return the next version when a feature and a patch are committed`, (done) => {

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
                type: 'fix',
                breaking: false,
                scope: 'Parse',
                message: 'fixed something important',
                author: 'logikal@gmail.com' 
            }
        ]

        var current = Version.getCurrent()
        var next = Version.getNext(commits)
        expect(next.major).to.equal(current.major)
        expect(next.minor).to.equal(current.minor+1)
        expect(next.patch).to.equal(0)

        done()

    })

    it(`should return the next version when a feature and a breaking change are committed`, (done) => {

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

        var current = Version.getCurrent()
        var next = Version.getNext(commits)
        expect(next.major).to.equal(current.major+1)
        expect(next.minor).to.equal(0)
        expect(next.patch).to.equal(0)

        done()

    })

    it(`should return the same current version when there are no features or fixes`, (done) => {
        var commits = [{
            sha: '123abc',
            type: 'chore',
            breaking: false,
            scope: 'Something',
            message: 'Did something',
            author: 'logikal@gmail.com'
        }]

        var current = Version.getCurrent()
        var next = Version.getNext(commits)

        expect(next.major).to.equal(current.major)
        expect(next.minor).to.equal(current.minor)
        expect(next.patch).to.equal(current.patch)

        done()
    })
})