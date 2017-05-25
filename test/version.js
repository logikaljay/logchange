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

        done()
    })
})