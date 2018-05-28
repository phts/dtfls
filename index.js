#!/usr/bin/env node

const packageJson = require('./package.json')
const program = require('commander')

const sh = require('shelljs')
sh.config.silent = true
sh.config.verbose = false

const commands = require('./commands')

program
  .name(packageJson.name)
  .version(packageJson.version)
  .allowUnknownOption(false)
  .usage('<command> [options] <app...>')
  .action(() => program.help())

for (const command in commands) {
  const data = commands[command]
  const cmd = program
    .command(data.command)
    .description(data.description)

  if (data.options) {
    data.options.forEach(opts => {
      cmd.option(...opts)
    })
  }

  cmd.action((...args) => {
    const output = data.action(...args)
    if (output) {
      console.info(output)
    }
  })
}

program.parse(process.argv)

if (program.args.length < 1 ) {
  program.help()
}
