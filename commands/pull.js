'use strict'
const sh = require('shelljs')
const shellescape = require('shell-escape')

const CommandResult = require('../utils/CommandResult')
const forEachFileOfEachApp = require('../utils/forEachFileOfEachApp')

module.exports = {
  command: 'pull <app...>',
  alias: 'p',
  description: 'pull configs from the system to the local folder',
  options: [['--cmd <CMD>', '[experimental] custom "copy" command, default: cp']],
  action: (apps, program) => {
    const output = new CommandResult()

    forEachFileOfEachApp(apps, ({localconfFile, sysconfFile}) => {
      if (program.cmd) {
        console.log([program.cmd, sysconfFile.replace(/\\/g, '/'), localconfFile])
        console.log(shellescape([program.cmd, sysconfFile.replace(/\\/g, '/'), localconfFile]))
        const out = sh.exec(shellescape([program.cmd, sysconfFile.replace(/\\/g, '/'), localconfFile]))
        output.addShellOutput(out)
        return
      }
      const result = sh.cp(sysconfFile, localconfFile)
      output.addShellOutput(result)
    })

    return output.toString()
  },
}
