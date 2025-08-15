'use strict'
const path = require('path')
const fs = require('fs')
const sh = require('shelljs')
const withoutSlash = require('../utils/withoutSlash')

const DEFAULT_PATH = '~'
const PATH_USER_FILENAME = 'path.user.json'

module.exports = {
  command: 'path <app>',
  description: 'print system installation path',
  action: (app) => {
    app = withoutSlash(app)

    const pathUserFile = path.resolve(process.cwd(), PATH_USER_FILENAME)
    if (!sh.test('-f', pathUserFile)) {
      return DEFAULT_PATH
    }

    const userPaths = JSON.parse(fs.readFileSync(pathUserFile))
    const userPath = userPaths && userPaths[app]
    return userPath || DEFAULT_PATH
  },
}
