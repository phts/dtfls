const sh = require('shelljs')

const postinstall = require('./postinstall').action
const forEachFileOfEachApp = require('../utils/forEachFileOfEachApp')

module.exports = {
  command: 'install <app...>',
  description: 'install local configs to the system',
  options: [
    ['--backup', 'create backups of original files'],
  ],
  action: (apps, program) => {
    const output = []
    if (program.backup) {
      output.push('--backup option is not implemented yet.\nAborted.')
      return output.join('\n')
    }

    forEachFileOfEachApp(apps, ({localconfFile, sysconfFile}) => {
      const result = sh.cp(localconfFile, sysconfFile)
      if (result.stdout || result.stderr) {
        output.push(result.stdout || result.stderr)
      }
    })

    apps.forEach(app => {
      postinstall([app])
    })

    return output.join('\n')
  },
}
