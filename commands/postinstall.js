const path = require('path')

const POSTINSTALL_USER_FILENAME = 'postinstall.user.js'

module.exports = {
  command: 'postinstall <app...>',
  description: 'run post-install scripts (it is being run automatically after install)',
  action: apps => {
    const postinstallUserFile = path.resolve(process.cwd(), POSTINSTALL_USER_FILENAME)

    let userPostintall
    try {
      userPostintall = require(postinstallUserFile)
    } catch (e) {
      return
    }

    apps
      .map(x => x.replace(/[/\\]/g, ''))
      .forEach(app => {
        userPostintall(app)
      })
  },
}
