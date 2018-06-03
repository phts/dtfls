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
const pull = require('../commands/pull').action

const isWindows = process.platform === 'win32'

describe('#pull', () => {
  let app
  let output

  before(() => {
    setupFixtures()
    sinon.stub(pathCommand, 'action').callsFake(() => SYSCONF_FOLDER)
    sh.cd(LOCALCONF_FOLDER)
  })

  after(() => {
    setupFixtures({forceLocal: true})
    pathCommand.action.restore()
    sh.cd('-')
  })

  function itCopiesFilesSuccessfully(context, disabled) {
    it('copies files which exist in local config folder from system config folder', disabled ? null : () => {
      sh.find(path.join(LOCALCONF_FOLDER, context().app)).forEach(localconfFile => {
        if (!sh.test('-f', localconfFile)) {
          return
        }
        const localconfFileContent = fs.readFileSync(localconfFile).toString()
        expect(localconfFileContent).not.to.equal('')
        expect(localconfFileContent).not.to.contain('local')
      })
    })

    it('does not amend system config files', disabled ? null : () => {
      sh.find(SYSCONF_FOLDER).forEach(sysconfFile => {
        if (!sh.test('-f', sysconfFile)) {
          return
        }
        const sysconfFileContent = fs.readFileSync(sysconfFile).toString()
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
      output = pull([app])
    })

    describe('when running on Windows', () => {
      it('does not support non-ascii characters', isWindows ? () => {
        expect(output).to.contain('no such file or directory')
        expect(output).not.to.contain(`< ${app} local new line`)
        expect(output).not.to.contain(`> ${app} sys new line`)
      } : null)
    })

    describe('when running on *nix', () => {
      itCopiesFilesSuccessfully(() => ({app}), isWindows)
    })
  })
})
