const {expect} = require('code')
const {describe, before, it} = require('mocha')

const Templates = require('../templates')

describe('Templating', () => {

    ['html', 'markdown'].forEach(template => {

        it(`${template} template should be an object`, (done) => {

            expect(Templates[template]).to.be.object()

            done()
        })

        it(`${template}.body should return a string for 0 commits`, (done) => {
            var body = Templates[template].body({ major: 1, minor: 2, patch: 3 }, 'abc123', [])
            expect(body).to.be.string()
            
            done()
        })

        it(`${template}.body should return a string that contains 'breaking' if breaking changes are included`, (done) => {
            var commits = [{
                sha: '321abc',
                type: 'feat',
                breaking: true,
                scope: 'Something',
                message: 'managed to break everything',
                author: 'logikal@gmail.com'
            }]
            
            var body = Templates[template].body({ major: 1, minor: 2, patch: 3 }, 'abc123', commits)
            expect(body).to.be.string()
            expect(body.indexOf('Breaking')).to.be.greaterThan(-1)

            done()
        })

        it(`${template}.body should return a string for 1 commit`, (done) => {
            var commits = [{
                sha: '321abc',
                type: 'fix',
                breaking: false,
                scope: 'Something',
                message: 'managed to fix something',
                author: 'logikal@gmail.com'
            }]
            
            var body = Templates[template].body({ major: 1, minor: 2, patch: 3 }, 'abc123', commits)
            expect(body).to.be.string()

            done()
        })
    })
})