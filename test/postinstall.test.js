'use strict'
require('./setupTests')

const path = require('path')
const fs = require('fs')
const expect = require('expect.js')
const sh = require('shelljs')
const sinon = require('sinon')

const postinstall = require('../commands/postinstall').action
const {LOCALCONF_FOLDER, SYSCONF_FOLDER, setupFixtures} = require('./setupFixtures')

const POSTINSTALL_FILENAME = 'postinstall.user'
const POSTINSTALL_FILE_PATH = path.join(LOCALCONF_FOLDER, POSTINSTALL_FILENAME)
const TMP_FILENAME = 'postinstall_result_file.tmp'
const TMP_FILE_PATH = path.join(SYSCONF_FOLDER, TMP_FILENAME)
const POSTINSTALL_CONTENT = `app="$1"
case $app in
  existing-app)
    cd "${SYSCONF_FOLDER}"
    touch ${TMP_FILENAME}
    cd -
    ;;
esac
`

describe('#postinstall', () => {
  let apps

  before(() => {
    setupFixtures()
    sh.cd(LOCALCONF_FOLDER)
  })

  after(() => {
    sh.cd('-')
  })

  describe(`when local config folder does not contain ${POSTINSTALL_FILENAME} file`, () => {
    beforeEach(() => {
      sinon.stub(fs, 'existsSync').returns(false)
      sinon.stub(sh, 'exec').returns(false)
    })

    afterEach(() => {
      fs.existsSync.restore()
      sh.exec.restore()
    })

    it('does not call any postinstall scripts', () => {
      expect(sh.exec.called).to.be(false)
    })
  })

  describe(`when local config folder contains ${POSTINSTALL_FILENAME} file`, () => {
    before(() => {
      fs.writeFileSync(POSTINSTALL_FILE_PATH, POSTINSTALL_CONTENT)
    })

    after(() => {
      fs.unlinkSync(POSTINSTALL_FILE_PATH)
      fs.unlinkSync(TMP_FILE_PATH)
    })

    beforeEach(() => {
      sinon.spy(sh, 'exec')
    })

    afterEach(() => {
      sh.exec.restore()
    })

    describe(`when ${POSTINSTALL_FILENAME} file does not contain the specified app`, () => {
      beforeEach(() => {
        apps = ['not-existing-app']
        postinstall(apps)
      })

      it('calls this postinstall file', () => {
        expect(sh.exec.called).to.be(true)
      })

      it('does not amend file system by postinstall file', () => {
        expect(fs.existsSync(path.join(SYSCONF_FOLDER, TMP_FILENAME))).to.be(false)
      })
    })

    describe(`when ${POSTINSTALL_FILENAME} file contains the specified app`, () => {
      beforeEach(() => {
        apps = ['existing-app']
        postinstall(apps)
      })

      it('calls this postinstall file', () => {
        expect(sh.exec.called).to.be(true)
      })

      it('amends file system by postinstall file', () => {
        expect(fs.existsSync(path.join(SYSCONF_FOLDER, TMP_FILENAME))).to.be(true)
      })
    })
  })
})
