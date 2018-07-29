require('./setupTests')

const expect = require('expect.js')
const path = require('path')
const fs = require('fs')
const sh = require('shelljs')

const {
  LOCALCONF_FOLDER,
  setupFixtures,
} = require('./setupFixtures')
const pathCommand = require('../commands/path').action

describe('#path', () => {
  let app
  let pathUserJsFile
  let output

  function writePathUserJsFile(appPath) {
    const myAppJson = appPath ? `"${app}": "${appPath}",` : ''
    const contents = `
    {
      ${myAppJson}
      "other-app": "some/path"
    }
    `
    fs.writeFileSync(pathUserJsFile, contents)
  }

  function deletePathUserJsFile() {
    try {
      fs.unlinkSync(pathUserJsFile)
    } catch (e) {
      // ignore
    }
  }

  before(() => {
    setupFixtures()
    sh.cd(LOCALCONF_FOLDER)
  })

  before(() => {
    app = 'my-app'
    pathUserJsFile = path.resolve(process.cwd(), 'path.user.json')
  })

  after(() => {
    deletePathUserJsFile()
  })

  describe('when local config folder does not contain path.user.js', () => {
    before(() => {
      deletePathUserJsFile()
      output = pathCommand(app)
    })

    it('returns ~', () => {
      expect(output).to.equal('~')
    })
  })

  describe('when local config folder contains path.user.js', () => {
    describe('when path.user.js does not contain the specified app', () => {
      before(() => {
        writePathUserJsFile()
        output = pathCommand(app)
      })

      it('returns ~', () => {
        expect(output).to.equal('~')
      })
    })

    describe('when path.user.js contains the specified app', () => {
      before(() => {
        writePathUserJsFile('/path/to/my-app')
        output = pathCommand(app)
      })

      it('returns specified path from path.user.js', () => {
        expect(output).to.equal('/path/to/my-app')
      })

      it('ignores slashes in app name', () => {
        app = 'my-app/'
        output = pathCommand(app)
        expect(output).to.equal('/path/to/my-app')
      })
    })
  })
})
