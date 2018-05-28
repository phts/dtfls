const path = require('path')

const DEFAULT_PATH = '~'
const PATH_USER_FILENAME = 'path.user.json'

module.exports = {
  command: 'path <app>',
  description: 'print system installation path',
  action: app => {
    const pathUserFile = path.resolve(process.cwd(), PATH_USER_FILENAME)
    let userPaths
    try {
      userPaths = require(pathUserFile)
    } catch (e) {
      userPaths = null
    }

    if (!userPaths || !userPaths[app]) {
      return DEFAULT_PATH
    }

    return userPaths[app]
  },
}
