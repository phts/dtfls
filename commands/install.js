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

    forEachFileOfEachApp(apps, ({localconfFile, sysconfFile}) => {
      if (program.backup) {
        const result = sh.cp(sysconfFile, `${sysconfFile}.bak`)
        output.addShellOutput(result)
      }

      const result = sh.cp(localconfFile, sysconfFile)
      output.addShellOutput(result)
    })

    apps.forEach(app => {
      postinstall([app])
    })

    return output.toString()
  },
}
