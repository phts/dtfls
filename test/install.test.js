require('./setupTests')

const expect = require('expect.js')
const path = require('path')
const fs = require('fs')
const sh = require('shelljs')
const sinon = require('sinon')

const {
  LOCALCONF_FOLDER,
  SYSCONF_FOLDER,
  setupFixtures,
} = require('./setupFixtures')
const pathCommand = require('../commands/path')
const postinstallCommand = require('../commands/postinstall')

describe('#install', () => {
  let program
  let install
  let app
  let output
  let originalPostinstallCommand

  before(() => {
    setupFixtures()
    sinon.stub(pathCommand, 'action').callsFake(() => SYSCONF_FOLDER)
    originalPostinstallCommand = postinstallCommand.action
    postinstallCommand.action = sinon.stub()
    sh.cd(LOCALCONF_FOLDER)
  })

  before(() => {
    install = require('../commands/install').action
  })

  after(() => {
    setupFixtures({forceSystem: true})
    pathCommand.action.restore()
    postinstallCommand.action = originalPostinstallCommand
    sh.cd('-')
  })

  beforeEach(() => {
    program = {}
    postinstallCommand.action.resetHistory()
  })

  function itCopiesFilesSuccessfully(context) {
    it('copies local config files to system config folder', () => {
      const sysSubfolder = path.join(SYSCONF_FOLDER, context().subfolder)
      let fileCount = 0
      sh.find(sysSubfolder).forEach(sysconfFile => {
        if (!sh.test('-f', sysconfFile)) {
          return
        }
        if (path.dirname(sysconfFile).replace(/\\/g, '/') !== sysSubfolder.replace(/\\/g, '/')) {
          return
        }
        const sysconfFileContent = fs.readFileSync(sysconfFile).toString()
        expect(sysconfFileContent).not.to.equal('')
        expect(sysconfFileContent).not.to.contain('sys')
        fileCount++
      })
      expect(fileCount).to.be(context().totalFiles)
    })

    it('does not amend local config files', () => {
      sh.find(LOCALCONF_FOLDER).forEach(localconfFile => {
        if (!sh.test('-f', localconfFile)) {
          return
        }
        const localconfFileContent = fs.readFileSync(localconfFile).toString()
        expect(localconfFileContent).not.to.equal('')
        expect(localconfFileContent).not.to.contain('sys')
      })
    })

    it('calls postinstall script for this app', () => {
      expect(postinstallCommand.action.called).to.be(true)
      expect(postinstallCommand.action.calledOnce).to.be(true)

      const args = postinstallCommand.action.getCall(0).args
      expect(args[0]).to.eql([context().app])
    })
  }

  describe('when command called without --backup option', () => {
    describe('when app has config files directly in home dir', () => {
      beforeEach(() => {
        app = 'app-with-rootdotfile'
        install([app], program)
      })

      itCopiesFilesSuccessfully(() => ({app, subfolder: '', totalFiles: 3}))
    })

    describe('when app has config files in nested fodlers', () => {
      beforeEach(() => {
        app = 'app-with-nested-folders'
        install([app], program)
      })

      itCopiesFilesSuccessfully(() => ({app, subfolder: path.join('app-with-nested-folders', 'nested1', 'nested2'), totalFiles: 4}))
    })

    describe('when app has whitespace in file names', () => {
      beforeEach(() => {
        app = 'app-with-space'
        install([app], program)
      })

      itCopiesFilesSuccessfully(() => ({app, subfolder: 'configs with space', totalFiles: 4}))
    })

    describe('when app contains non-ascii characters', () => {
      beforeEach(() => {
        app = 'app-with-non-ascii'
        install([app], program)
      })

      itCopiesFilesSuccessfully(() => ({app, subfolder: 'приложение', totalFiles: 4}))
    })
  })

  describe('when command called with --backup option', () => {
    beforeEach(() => {
      app = 'anyapp'
      program.backup = true
      output = install([app], program)
    })

    it('is not implemented yet', () => {
      expect(output).to.contain('is not implemented yet')
    })
  })
})
