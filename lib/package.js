var {existsSync: exists, readFileSync} = require('fs')
var {exec} = require('child_process')

var package = {
    bump: (version) => {

        // handle package.json version
        if (exists('./package.json')) {
            var package = readFileSync('./package.json')
            if (typeof package === 'undefined' || package.length == 0) {
                return
            }

            package = JSON.parse(package)
            var oldVersion = package.version
            
            exec(`npm version --no-git-tag-version -f ${version.major}.${version.minor}.${version.patch}`)

            return { 
                file: 'package.json', 
                oldVersion: `v${package.version}`, 
                newVersion: `v${version.major}.${version.minor}.${version.patch}` 
            }
        }

        return
    }
}

module.exports = package