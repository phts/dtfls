'use strict'
const sh = require('shelljs')
const shellescape = require('shell-escape')

const CommandResult = require('../utils/CommandResult')
const forEachFileOfEachApp = require('../utils/forEachFileOfEachApp')

module.exports = {
  command: 'diff <app...>',
  alias: 'df',
  description: 'print difference between local and system configs',
  action: (apps) => {
    const output = new CommandResult()

    forEachFileOfEachApp(apps, ({localconfFile, sysconfFile}) => {
      const diffArgs = shellescape(['-r', '--ignore-all-space', localconfFile, sysconfFile])
      const result = sh.exec(`diff ${diffArgs}`)
      output.addShellOutput(result, {prepend: `${localconfFile} <=> ${sysconfFile}`})
    })

    return output.toString()
  },
}
