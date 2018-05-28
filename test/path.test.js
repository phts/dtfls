const expect = require('expect.js')
const path = require('path')
const mock = require('mock-require')

const pathCommand = require('../commands/path').action

describe('#path', () => {
  let app
  let pathUserJsFile
  let output

  before(() => {
    app = 'my-app'
    pathUserJsFile = path.resolve(process.cwd(), 'path.user.json')
  })

  describe('when local config folder does not contain path.user.js', () => {
    before(() => {
      mock(pathUserJsFile, '/not/existing/file')
      output = pathCommand(app)
    })

    it('returns ~', () => {
      expect(output).to.equal('~')
    })
  })

  describe('when local config folder contains path.user.js', () => {
    describe('when path.user.js does not contain the specified app', () => {
      before(() => {
        mock(pathUserJsFile, {
          'other-app': 'some/path',
        })
        output = pathCommand(app)
      })

      it('returns ~', () => {
        expect(output).to.equal('~')
      })
    })

    describe('when path.user.js contains the specified app', () => {
      before(() => {
        mock(pathUserJsFile, {
          'other-app': 'some/path',
          [app]: '/path/to/my-app',
        })
        output = pathCommand(app)
      })

      it('returns specified path from path.user.js', () => {
        expect(output).to.equal('/path/to/my-app')
      })
    })
  })
})
