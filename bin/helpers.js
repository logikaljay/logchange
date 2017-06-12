const {basename} = require('path')

const helpers = {
  help: (msg, options, commands) => {

    var help = ""
    if (typeof msg === 'string') {
      help += `
  ❌  Invalid usage: ${msg}
`
    }
    else {
        commands = options
        options = msg
    }

    help += `
  Usage: ${basename(process.argv[1])} [options] <command>
`

    if (typeof options !== 'undefined') {
        help += `
  Options:
    ${helpers.formatOptions(options)}
`
    }

    if (typeof commands !== 'undefined') {
        help += `
  Commands:
    ${helpers.formatCommands(commands)}
`
    }
    return help
  },

  formatOptions: (options) => {
    var help = ''
    var MAX_COMMAND_LENGTH = 0

    var commands = options.map(option => `${option[0]}, ${option[1]} ${option[3] ? '<' + option[3] + '>' : ''}`)

    commands.forEach(cmd => {
        if (MAX_COMMAND_LENGTH < cmd.length) {
            MAX_COMMAND_LENGTH = cmd.length + 2
        }
    })

    options.forEach((option, i) => {

        var description = option[2]
        var spacingCount = MAX_COMMAND_LENGTH - commands[i].length
        var spacing = ''
        while (spacingCount > 0) {
            spacing += ' '
            spacingCount--
        }
        
        help += `
    ${commands[i]}${spacing}${description}`
    })

    return help + '\n'
  },

  formatCommands: (commands) => {
      var help = ''
      var MAX_COMMAND_LENGTH = 10

      commands.forEach(cmd => {
          if (MAX_COMMAND_LENGTH < cmd[0].length) {
              MAX_COMMAND_LENGTH = cmd[0].length + 2
          }
      })

      commands.forEach(cmd => {
          var description = cmd[2]
          var spacingCount = MAX_COMMAND_LENGTH - cmd[0].length
          var spacing = ''

          while(spacingCount > 0) {
              spacing += ' '
              spacingCount--
          }

          help += `
    ${cmd[0]}${spacing}${cmd[1]}`
      })

      return help += '\n'
  },

  getArg: (args, options) => {
    var regexStr = [...options].join('|')

    // check for `-s foo` style
    var regex = new RegExp(`(${regexStr}) ([^\\s]+)`)
    var data = args.match(regex)

    // check for `-s=foo` style
    if (data === null) {
        regex = new RegExp(`(${regexStr})=([^\\s]+)`)
        data = args.match(regex)
    }

    // check for `-s` style
    if (data === null) {
        regex = new RegExp(`(${regexStr})`)
        data = args.match(regex)

        if (data !== null) {
            data[2] = true
        }
    }

    return data !== null ? data[2] : null
  }
}

module.exports = helpers