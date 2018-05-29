require('./setupTests')

const expect = require('expect.js')
const sh = require('shelljs')
const sinon = require('sinon')

const setupFixtures = require('./setupFixtures').setupFixtures
const pathCommand = require('../commands/path')
const diff = require('../commands/diff').action

const isWindows = process.platform === 'win32'

describe('#diff', () => {
  let pathCommandStub
  let sysconfFolder
  let localconfFolder
  let app
  let output

  before(() => {
    const fixtures = setupFixtures()
    localconfFolder = fixtures.LOCALCONF_FOLDER
    sysconfFolder = fixtures.SYSCONF_FOLDER
    pathCommandStub = sinon.stub(pathCommand, 'action').callsFake(() => sysconfFolder)
    sh.cd(localconfFolder)
  })

  after(() => {
    pathCommandStub.restore()
    sh.cd('-')
  })

  function itPrintsDifference(context, disabled) {
    it('prints different lines from local files', disabled ? undefined : () => {
      expect(context().output).to.contain(`< ${context().app} local new line`)
    })

    it('prints different lines from system files', disabled ? undefined : () => {
      expect(context().output).to.contain(`> ${context().app} sys new line`)
    })

    it('does not print equal lines', disabled ? undefined : () => {
      expect(context().output).not.to.contain('eq-line1')
      expect(context().output).not.to.contain('eq-line2')
      expect(context().output).not.to.contain('eq-line3')
    })
  }

  describe('when app has config files directly in home dir', () => {
    before(() => {
      app = 'app-with-rootdotfile'
      output = diff([app])
    })

    itPrintsDifference(() => ({output, app}))
  })

  describe('when app has config files in nested fodlers', () => {
    before(() => {
      app = 'app-with-nested-folders'
      output = diff([app])
    })

    itPrintsDifference(() => ({output, app}))
  })

  describe('when app has whitespace in file names', () => {
    before(() => {
      app = 'app-with-space'
      output = diff([app])
    })

    itPrintsDifference(() => ({output, app}))
  })

  describe('when app contains non-ascii characters', () => {
    before(() => {
      app = 'app-with-non-ascii'
      output = diff([app])
    })

    describe('when running on Windows', () => {
      it('does not support non-ascii characters', isWindows ? () => {
        expect(output).to.contain('No such file or directory')
        expect(output).not.to.contain(`< ${app} local new line`)
        expect(output).not.to.contain(`> ${app} sys new line`)
      } : undefined);
    });

    describe('when running on Unix', () => {
      itPrintsDifference(() => ({output, app}), isWindows)
    });
  })
})
