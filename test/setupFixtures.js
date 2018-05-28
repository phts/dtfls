const path = require('path')
const fs = require('fs')
const sh = require('shelljs')

const LOCALCONF_FOLDER = path.join(__dirname, '__fixtures', 'local config mocks')
const SYSCONF_FOLDER = path.join(sh.tempdir(), 'dtfls - user home config mocks')

module.exports = {
  LOCALCONF_FOLDER,
  SYSCONF_FOLDER,
  setupFixtures() {
    if (!sh.test('-e', LOCALCONF_FOLDER)) {
      sh.mkdir('-p', LOCALCONF_FOLDER)

      const appWithDotfileFolder = path.join(LOCALCONF_FOLDER, 'app-with-rootdotfile')
      sh.mkdir('-p', appWithDotfileFolder)
      fs.writeFileSync(path.join(LOCALCONF_FOLDER, 'app-with-rootdotfile', '.eq-rootconfig'), 'eq-line1\neq-line2\neq-line3')
      fs.writeFileSync(path.join(LOCALCONF_FOLDER, 'app-with-rootdotfile', '.df1-rootconfig'), 'eq-line1\neq-line2\napp-with-rootdotfile local new line\neq-line3')
      fs.writeFileSync(path.join(LOCALCONF_FOLDER, 'app-with-rootdotfile', '.df2-rootconfig'), 'eq-line1\neq-line2\neq-line3')

      const appWithNestedFolders = path.join(LOCALCONF_FOLDER, 'app-with-nested-folders', 'app-with-nested-folders', 'nested1', 'nested2')
      sh.mkdir('-p', appWithNestedFolders)
      fs.writeFileSync(path.join(appWithNestedFolders, 'eqfile.txt'), 'eq-line1\neq-line2\neq-line3')
      fs.writeFileSync(path.join(appWithNestedFolders, 'dffile1.txt'), 'eq-line1\neq-line2\napp-with-nested-folders local new line\neq-line3')
      fs.writeFileSync(path.join(appWithNestedFolders, 'dffile2.txt'), 'eq-line1\neq-line2\neq-line3')
      fs.writeFileSync(path.join(appWithNestedFolders, 'newfile.txt'), 'eq-line1\neq-line2\neq-line3')

      const appWithSpace = path.join(LOCALCONF_FOLDER, 'app-with-space', 'configs with space')
      sh.mkdir('-p', appWithSpace)
      fs.writeFileSync(path.join(appWithSpace, 'eq file.txt'), 'eq-line1\neq-line2\neq-line3')
      fs.writeFileSync(path.join(appWithSpace, 'df file1.txt'), 'eq-line1\neq-line2\napp-with-space local new line\neq-line3')
      fs.writeFileSync(path.join(appWithSpace, 'df file2.txt'), 'eq-line1\neq-line2\neq-line3')
      fs.writeFileSync(path.join(appWithSpace, 'new file.txt'), 'eq-line1\neq-line2\neq-line3')

      const appWithNonAscii = path.join(LOCALCONF_FOLDER, 'app-with-non-ascii', 'приложение')
      sh.mkdir('-p', appWithNonAscii)
      fs.writeFileSync(path.join(appWithNonAscii, 'eq конфиг.txt'), 'eq-line1\neq-line2\neq-line3')
      fs.writeFileSync(path.join(appWithNonAscii, 'df конфиг1.txt'), 'eq-line1\neq-line2\napp-with-non-ascii local new line\neq-line3')
      fs.writeFileSync(path.join(appWithNonAscii, 'df конфиг2.txt'), 'eq-line1\neq-line2\neq-line3')
      fs.writeFileSync(path.join(appWithNonAscii, 'new конфиг.txt'), 'eq-line1\neq-line2\neq-line3')
    }

    if (!sh.test('-e', SYSCONF_FOLDER)) {
      sh.mkdir('-p', SYSCONF_FOLDER)

      fs.writeFileSync(path.join(SYSCONF_FOLDER, '.eq-rootconfig'), 'eq-line1\neq-line2\neq-line3')
      fs.writeFileSync(path.join(SYSCONF_FOLDER, '.df1-rootconfig'), 'eq-line1\neq-line2\neq-line3')
      fs.writeFileSync(path.join(SYSCONF_FOLDER, '.df2-rootconfig'), 'eq-line1\neq-line2\napp-with-rootdotfile sys new line\neq-line3')

      const appWithNestedFolders = path.join(SYSCONF_FOLDER, 'app-with-nested-folders', 'nested1', 'nested2')
      sh.mkdir('-p', appWithNestedFolders)
      fs.writeFileSync(path.join(appWithNestedFolders, 'eqfile.txt'), 'eq-line1\neq-line2\neq-line3')
      fs.writeFileSync(path.join(appWithNestedFolders, 'dffile1.txt'), 'eq-line1\neq-line2\neq-line3')
      fs.writeFileSync(path.join(appWithNestedFolders, 'dffile2.txt'), 'eq-line1\neq-line2\napp-with-nested-folders sys new line\neq-line3')

      sh.mkdir('-p', path.join(SYSCONF_FOLDER, 'configs with space'))
      fs.writeFileSync(path.join(SYSCONF_FOLDER, 'configs with space', 'eq file.txt'), 'eq-line1\neq-line2\neq-line3')
      fs.writeFileSync(path.join(SYSCONF_FOLDER, 'configs with space', 'df file1.txt'), 'eq-line1\neq-line2\neq-line3')
      fs.writeFileSync(path.join(SYSCONF_FOLDER, 'configs with space', 'df file2.txt'), 'eq-line1\neq-line2\napp-with-space sys new line\neq-line3')

      const appWithNonAscii = path.join(SYSCONF_FOLDER, 'приложение')
      sh.mkdir('-p', appWithNonAscii)
      fs.writeFileSync(path.join(appWithNonAscii, 'eq конфиг.txt'), 'eq-line1\neq-line2\neq-line3')
      fs.writeFileSync(path.join(appWithNonAscii, 'df конфиг1.txt'), 'eq-line1\neq-line2\neq-line3')
      fs.writeFileSync(path.join(appWithNonAscii, 'df конфиг2.txt'), 'eq-line1\neq-line2\napp-with-non-ascii sys new line\neq-line3')
    }

    return {
      LOCALCONF_FOLDER,
      SYSCONF_FOLDER,
    }
  },
  cleanFixtures() {
    sh.rm('-r', LOCALCONF_FOLDER, SYSCONF_FOLDER)
  },
}
