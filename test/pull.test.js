require('./setupTests')

const expect = require('expect.js')
const path = require('path')
const sh = require('shelljs')
const sinon = require('sinon')

const {
  LOCALCONF_FOLDER,
  SYSCONF_FOLDER,
  setupFixtures,
} = require('./setupFixtures')
const pathCommand = require('../commands/path')
const pull = require('../commands/pull').action

describe('#pull', () => {
  let pathCommandStub
  let app

  before(() => {
    setupFixtures()
    pathCommandStub = sinon.stub(pathCommand, 'action').callsFake(() => SYSCONF_FOLDER)
    sh.cd(LOCALCONF_FOLDER)
  })

  after(() => {
    setupFixtures({forceLocal: true})
    pathCommandStub.restore()
    sh.cd('-')
  })

  function itCopiesFilesSuccessfully(context) {
    it('copies files which exist in local config folder from system config folder', () => {
      sh.find(path.join(LOCALCONF_FOLDER, context().app)).forEach(localconfFile => {
        if (!sh.test('-f', localconfFile)) {
          return
        }
        const localconfFileContent = sh.cat(localconfFile).stdout
        expect(localconfFileContent).not.to.equal('')
        expect(localconfFileContent).not.to.contain('local')
      })
    })

    it('does not amend system config files', () => {
      sh.find(SYSCONF_FOLDER).forEach(sysconfFile => {
        if (!sh.test('-f', sysconfFile)) {
          return
        }
        const sysconfFileContent = sh.cat(sysconfFile).stdout
        expect(sysconfFileContent).not.to.equal('')
        expect(sysconfFileContent).not.to.contain('local')
      })
    })
  }

  describe('when app has config files directly in home dir', () => {
    before(() => {
      app = 'app-with-rootdotfile'
      pull([app])
    })

    itCopiesFilesSuccessfully(() => ({app}))
  })

  describe('when app has config files in nested fodlers', () => {
    before(() => {
      app = 'app-with-nested-folders'
      pull([app])
    })

    itCopiesFilesSuccessfully(() => ({app}))
  })

  describe('when app has whitespace in file names', () => {
    before(() => {
      app = 'app-with-space'
      pull([app])
    })

    itCopiesFilesSuccessfully(() => ({app}))
  })

  describe('when app contains non-ascii characters', () => {
    before(() => {
      app = 'app-with-non-ascii'
      pull([app])
    })

    itCopiesFilesSuccessfully(() => ({app}))
  })
})
