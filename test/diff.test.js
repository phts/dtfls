'use strict'
require('./setupTests')

const expect = require('expect.js')
const sh = require('shelljs')
const sinon = require('sinon')

const pathCommand = require('../commands/path')
const diff = require('../commands/diff').action
const {LOCALCONF_FOLDER, SYSCONF_FOLDER, setupFixtures} = require('./setupFixtures')

const isWindows = process.platform === 'win32'

describe('#diff', () => {
  let app
  let output

  before(() => {
    setupFixtures()
    sinon.stub(pathCommand, 'action').callsFake(() => SYSCONF_FOLDER)
    sh.cd(LOCALCONF_FOLDER)
  })

  after(() => {
    pathCommand.action.restore()
    sh.cd('-')
  })

  function itPrintsDifference(context, disabled) {
    it(
      'prints different lines from local files',
      disabled
        ? null
        : () => {
            expect(context().output).to.contain(`< ${context().app} local new line`)
          }
    )

    it(
      'prints different lines from system files',
      disabled
        ? null
        : () => {
            expect(context().output).to.contain(`> ${context().app} sys new line`)
          }
    )

    it(
      'does not print equal lines',
      disabled
        ? null
        : () => {
            expect(context().output).not.to.contain('eq-line1')
            expect(context().output).not.to.contain('eq-line2')
            expect(context().output).not.to.contain('eq-line3')
          }
    )
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
      it(
        'does not support non-ascii characters',
        isWindows
          ? () => {
              expect(output).to.contain('No such file or directory')
              expect(output).not.to.contain(`< ${app} local new line`)
              expect(output).not.to.contain(`> ${app} sys new line`)
            }
          : null
      )
    })

    describe('when running on *nix', () => {
      itPrintsDifference(() => ({output, app}), isWindows)
    })
  })

  describe('when command is called with a slash in the app name', () => {
    before(() => {
      app = 'app-with-slash'
      output = diff([`${app}/`])
    })

    itPrintsDifference(() => ({output, app}))
  })
})
