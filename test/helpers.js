const {expect} = require('code')
const {describe, before, it} = require('mocha')

const Helpers = require('../bin/helpers')

describe('CLI helper functions', () => {

    it(`should return the help`, (done) => {
        var help = Helpers.help()
        expect(help).to.be.string()

        done()
    })

    it(`should return the help when provided options and commands`, (done) => {
        var options = [
            ['-f', '--foobar', 'Do nothing'],
            ['-F', '--Other', 'Do nothing else']
        ]

        var commands = [
            ['show', 'show something'],
            ['hide', 'hide something else']
        ]

        var help = Helpers.help(options, commands)
        expect(help).to.be.string()
        done()
    })

    it(`should return the help with a message`, (done) => {
        var help = Helpers.help('FOOBAR')

        expect(help.indexOf('FOOBAR')).to.be.greaterThan(-1)
        done()
    })

    it(`getArguments should handle incorrect arguments correctly`, (done) => {

        var args = Helpers.getArg('', ['-f', '--format'])
        expect(args).to.equal(null)

        done()
    })

    it(`getArguments should return arguments correctly`, (done) => {

        var args = Helpers.getArg('-f v%M.%m.%p', ['-f', '--format'])
        expect(args).to.equal('v%M.%m.%p')

        done()
    })

    it(`getArguments should handle multiple arguments correctly`, (done) => {

        var args = Helpers.getArg('-f html -s', ['-f', '--format'])
        expect(args).to.equal('html')

        done()
    })

    it(`getArguments should handle -s=foo style arguments correctly`, (done) => {

        var args = Helpers.getArg('-s=foo', ['-s'])
        expect(args).to.equal('foo')

        done()
    })

    it(`getArguments should handle -s style arguments correctly`, (done) => {
        var args = Helpers.getArg('-s', ['-s', '--silent'])
        expect(args).to.equal(true)

        done()
    })

    it(`getArguments should ignore arguments that its not looking for`, (done) => {

        var args = Helpers.getArg('-f html -s', ['-s', '--stdout'])
        expect(args).to.equal(true)

        done()
    })

    it(`should format options correctly`, (done) => {

        var options = Helpers.formatOptions([
            ['-s', '--silent', 'Help message for silent option', true],
            ['-V', '--verbose', 'Help message for verbose option', true]
        ])

        expect(options).to.be.string()
        done()
    })

    it(`should format commands correctly`, (done) => {
        var commands = Helpers.formatCommands([
            ['command', 'help'],
            ['command that is much longer', 'help']
        ])

        expect(commands).to.be.string()
        done()
    })
})