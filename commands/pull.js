const sh = require('shelljs')

const CommandResult = require('../utils/CommandResult')
const forEachFileOfEachApp = require('../utils/forEachFileOfEachApp')

module.exports = {
  command: 'pull <app...>',
  description: 'pull configs from the system to the local folder',
  action: apps => {
    const output = new CommandResult()

    forEachFileOfEachApp(apps, ({localconfFile, sysconfFile}) => {
      const result = sh.cp(sysconfFile, localconfFile)
      output.addShellOutput(result)
    })

    return output.toString()
  },
}
