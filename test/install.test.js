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

const BACKUP_FILE_EXT = '.bak'

describe('#install', () => {
  let program
  let install
  let app
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
    program = {}
  })

  after(() => {
    pathCommand.action.restore()
    postinstallCommand.action = originalPostinstallCommand
    sh.cd('-')
  })

  function itCopiesFilesSuccessfully(context) {
    function getFilesInSysconfSubfolder() {
      const sysSubfolder = path.join(SYSCONF_FOLDER, context().subfolder)
      return sh.find(sysSubfolder)
        .filter(f => sh.test('-f', f))
        .filter(f => path.dirname(f).replace(/\\/g, '/') === sysSubfolder.replace(/\\/g, '/'))
    }

    it('copies local config files to system config folder', () => {
      let fileCount = 0
      getFilesInSysconfSubfolder()
        .filter(f => !context().withBackup || context().withBackup && !f.includes(BACKUP_FILE_EXT))
        .forEach(sysconfFile => {
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

    it('calls postinstall script only once', () => {
      expect(postinstallCommand.action.called).to.be(true)
      expect(postinstallCommand.action.calledOnce).to.be(true)
    })

    it('calls postinstall script for this app only', () => {
      const args = postinstallCommand.action.getCall(0).args
      expect(args[0]).to.eql([context().app])
    })

    if (context().withBackup) {
      it(`creates a file with ${BACKUP_FILE_EXT} extension near original file with original content`, () => {
        getFilesInSysconfSubfolder()
          .filter(f => !f.includes(BACKUP_FILE_EXT))
          .forEach(sysconfFile => {
            const bakFile = sysconfFile + BACKUP_FILE_EXT
            expect(sh.test('-f', bakFile)).to.be(true)

            const bakFileContent = fs.readFileSync(bakFile).toString()
            expect(bakFileContent).not.to.equal('')
            expect(bakFileContent).not.to.contain('local')
          })
      })
    }
  }

  function testAllCases(opts = {}) {
    describe('when app has config files directly in home dir', () => {
      before(() => {
        postinstallCommand.action.resetHistory()
        app = 'app-with-rootdotfile'
        install([app], program)
      })

      itCopiesFilesSuccessfully(() => ({
        app,
        subfolder: '',
        totalFiles: 3,
        withBackup: opts.withBackup,
      }))
    })

    describe('when app has config files in nested fodlers', () => {
      before(() => {
        postinstallCommand.action.resetHistory()
        app = 'app-with-nested-folders'
        install([app], program)
      })

      itCopiesFilesSuccessfully(() => ({
        app,
        subfolder: path.join('app-with-nested-folders', 'nested1', 'nested2'),
        totalFiles: 4,
        withBackup: opts.withBackup,
      }))
    })

    describe('when app has whitespace in file names', () => {
      before(() => {
        postinstallCommand.action.resetHistory()
        app = 'app-with-space'
        install([app], program)
      })

      itCopiesFilesSuccessfully(() => ({
        app,
        subfolder: 'configs with space',
        totalFiles: 4,
        withBackup: opts.withBackup,
      }))
    })

    describe('when app contains non-ascii characters', () => {
      before(() => {
        postinstallCommand.action.resetHistory()
        app = 'app-with-non-ascii'
        install([app], program)
      })

      itCopiesFilesSuccessfully(() => ({
        app,
        subfolder: 'приложение',
        totalFiles: 4,
        withBackup: opts.withBackup,
      }))
    })

    describe('when command is called with a slash in the app name', () => {
      before(() => {
        postinstallCommand.action.resetHistory()
        app = 'app-with-slash/'
        install([app], program)
      })

      itCopiesFilesSuccessfully(() => ({
        app,
        subfolder: 'app-with-slash',
        totalFiles: 4,
        withBackup: opts.withBackup,
      }))
    })
  }

  describe('when command called without --backup option', () => {
    after(() => {
      setupFixtures({forceSystem: true})
    })

    testAllCases()
  })

  describe('when command called with --backup option', () => {
    before(() => {
      app = 'anyapp'
      program.backup = true
    })

    after(() => {
      setupFixtures({forceSystem: true})
      sh.find(path.join(SYSCONF_FOLDER))
        .filter(f => f.includes(BACKUP_FILE_EXT))
        .forEach(file => {
          fs.unlinkSync(file)
        })
    })

    testAllCases({withBackup: true})
  })
})
