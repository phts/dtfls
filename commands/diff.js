const sh = require('shelljs')
const shellescape = require('shell-escape')

const forEachFileOfEachApp = require('../utils/forEachFileOfEachApp')

module.exports = {
  command: 'diff <app...>',
  description: 'print difference between local and outside configs',
  action: apps => {
    const output = []

    forEachFileOfEachApp(apps, ({localconfFile, sysconfFile}) => {
      const diffArgs = shellescape(['-r', '--ignore-all-space', localconfFile, sysconfFile])
      const diff = sh.exec(`diff ${diffArgs}`)
      if (diff.stdout || diff.stderr) {
        output.push(`${localconfFile} <=> ${sysconfFile}`)
        output.push(diff.stdout || diff.stderr)
      }
    })

    return output.join('\n')
  },
}
