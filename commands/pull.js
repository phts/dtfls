const sh = require('shelljs')

const forEachFileOfEachApp = require('../utils/forEachFileOfEachApp')

module.exports = {
  command: 'pull <app...>',
  description: 'pull configs from the system to the local folder',
  action: apps => {
    const output = []

    forEachFileOfEachApp(apps, ({localconfFile, sysconfFile}) => {
      sh.cp(sysconfFile, localconfFile)
    })

    return output.join('\n')
  },
}
