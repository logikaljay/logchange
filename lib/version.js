
var lib = {
    format: (major = 0, minor = 0, patch = 0) => {
        var obj = {
            major: Number(major),
            minor: Number(minor),
            patch: Number(patch)
        }

        obj.toString = () => {
            return `v${obj.major}.${obj.minor}.${obj.patch}`
        }

        return obj
    },

    parseVersion: (version) => {
        if (typeof version !== 'string') {
            return lib.format()
        }

        var data = version.trim().replace('v ', '').replace('v', '').split('.')
        return lib.format(...data)
    },

    getCurrent: () => {

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
    },

    getNext: (commits) => {
        var {major, minor, patch} = lib.getCurrent()

        var bumpPatch = false
        var bumpMinor = false
        var bumpMajor = false

        for (var c in commits) {
            switch (commits[c].type) {
                case 'fix':
                    bumpPatch = true
                    break

                case 'feat':
                    bumpMinor = true
                    break

                case 'breaking':
                    bumpMajor = true
                    break
            }
        }

        if (bumpMajor) {
            major++
            minor = 0
            patch = 0
        }
        else if (bumpMinor) {
            minor++
            patch = 0
        }
        else if (bumpPatch) {
            patch++
        }

        return lib.format(major, minor, patch)
    }
}

module.exports = lib