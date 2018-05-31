const sh = require('shelljs')

const forEachFileOfEachApp = require('../utils/forEachFileOfEachApp')

module.exports = {
  command: 'pull <app...>',
  description: 'pull configs from the system to the local folder',
  action: apps => {
    const output = []

    forEachFileOfEachApp(apps, ({localconfFile, sysconfFile}) => {
      const result = sh.cp(sysconfFile, localconfFile)
      if (result.stdout || result.stderr) {
        output.push(result.stdout || result.stderr)
      }
    })

    return output.join('\n')
  },
}
