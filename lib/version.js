
var lib = {
    format: (major = 0, minor = 0, patch = 0) => {
        return {
            major: Number(major),
            minor: Number(minor),
            patch: Number(patch)
        }
    },

    parseVersion: (version) => {
        if (typeof version !== 'string') {
            return lib.format()
        }

        var data = version.trim().replace('v ', '').replace('v', '').split('.')
        return lib.format(...data)
    },

    getCurrent: (version) => {

        var package = {}
        try {
            package = require(`${process.cwd()}/package.json`)
        }
        catch (err) {
            return lib.format()
        }

        if ( ! package.hasOwnProperty('version')) {
            return lib.format()
        }

        return lib.parseVersion(package.version)
    }
}

module.exports = lib