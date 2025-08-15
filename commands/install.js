'use strict'
const path = require('path')
const sh = require('shelljs')
const shellescape = require('shell-escape')

const CommandResult = require('../utils/CommandResult')
const forEachFileOfEachApp = require('../utils/forEachFileOfEachApp')
const postinstall = require('./postinstall').action

module.exports = {
  command: 'install <app...>',
  alias: 'i',
  description: 'install local configs to the system',
  options: [
    ['--backup', 'create backups of original files'],
    ['--cmd <CMD>', 'custom "copy" command, default: cp'],
  ],
  action: (apps, program) => {
    const output = new CommandResult()

    forEachFileOfEachApp(apps, ({localconfFile, sysconfFile}) => {
      if (path.basename(localconfFile) === '.postinstall-only') {
        return
      }

      if (program.cmd) {
        const out = sh.exec(shellescape([program.cmd, localconfFile, sysconfFile.replace(/\\/g, '/')]))
        output.addShellOutput(out)
        return
      }

      if (program.backup) {
        const result = sh.cp(sysconfFile, `${sysconfFile}.bak`)
        output.addShellOutput(result)
      }

      output.addShellOutput(sh.mkdir('-p', path.dirname(sysconfFile)))
      output.addShellOutput(sh.cp(localconfFile, sysconfFile))
    })

    apps.forEach((app) => {
      postinstall([app])
    })

    return output.toString()
  },
}
