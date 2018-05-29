const path = require('path')
const sh = require('shelljs')
const shellescape = require('shell-escape')
const untildify = require('untildify')

const pathCommand = require('../commands/path')
const withoutAppName = require('./withoutAppName')

module.exports = function forEachFileOfEachApp(apps, callback) {
  const cwd = process.cwd()

  apps.forEach(app => {
    const sysconfFolder = untildify(pathCommand.action(app))
    const localconfFodler = path.relative(cwd, path.resolve(app))
    const findArgs = shellescape([localconfFodler, '-type', 'f'])
    sh.exec(`find ${findArgs}`).stdout
      .split('\n')
      .filter(x => !!x)
      .forEach(localconfFile => {
        const relativeFile = withoutAppName(localconfFile)
        const sysconfFile = path.join(sysconfFolder, relativeFile)

        callback({
          localconfFile,
          relativeFile,
          sysconfFile,
        })
      })
  })
}
