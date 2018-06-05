const sh = require('shelljs')

const postinstall = require('./postinstall').action
const CommandResult = require('../utils/CommandResult')
const forEachFileOfEachApp = require('../utils/forEachFileOfEachApp')

module.exports = {
  command: 'install <app...>',
  description: 'install local configs to the system',
  options: [
    ['--backup', 'create backups of original files'],
  ],
  action: (apps, program) => {
    const output = new CommandResult()
    if (program.backup) {
      output.addString('--backup option is not implemented yet.\nAborted.')
      return output.toString()
    }

    forEachFileOfEachApp(apps, ({localconfFile, sysconfFile}) => {
      const result = sh.cp(localconfFile, sysconfFile)
      output.addShellOutput(result)
    })

    apps.forEach(app => {
      postinstall([app])
    })

    return output.toString()
  },
}
