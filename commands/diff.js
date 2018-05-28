const path = require('path')
const sh = require('shelljs')
const pathCommand = require('./path')
const shellescape = require('shell-escape')
const untildify = require('untildify')

function withoutAppName(filepath) {
  return filepath.replace(/^[^/]*\//, '')
}

module.exports = {
  command: 'diff <app...>',
  description: 'print difference between local and outside configs',
  action: apps => {
    const output = []
    const cwd = process.cwd()

    apps.forEach(app => {
      const sysconfFolder = untildify(pathCommand.action(app))
      const localconfFodler = path.relative(cwd, path.resolve(app))
      const findArgs = shellescape([localconfFodler, '-type', 'f'])
      sh.exec(`find ${findArgs}`).stdout
        .split('\n')
        .filter(x => !!x)
        .map(localconfFile => ({localconfFile, relativeFile: withoutAppName(localconfFile)}))
        .forEach(({localconfFile, relativeFile}) => {
          const sysconfFile = path.join(sysconfFolder, relativeFile)
          const diffArgs = shellescape(['-r', '--ignore-all-space', localconfFile, sysconfFile])
          const diff = sh.exec(`diff ${diffArgs}`)
          if (diff.stdout || diff.stderr) {
            output.push(`${localconfFile} <=> ${sysconfFile}`)
            output.push(diff.stdout || diff.stderr)
          }
        })
    })
    return output.join('\n')
  },
}
