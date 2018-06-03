const fs = require('fs')
const path = require('path')
const sh = require('shelljs')
const shellescape = require('shell-escape')

const POSTINSTALL_USER_FILENAME = 'postinstall.user'

module.exports = {
  command: 'postinstall <app...>',
  description: 'run post-install scripts (it is being run automatically after install)',
  action: apps => {
    const postinstallUserFile = path.resolve(process.cwd(), POSTINSTALL_USER_FILENAME)

    if (!fs.existsSync(postinstallUserFile)) {
      return
    }

    apps
      .map(x => x.replace(/[/\\]/g, ''))
      .forEach(app => {
        const execArgs = shellescape([postinstallUserFile, app])
        sh.exec(`bash ${execArgs}`, {silent: false})
      })
  },
}
