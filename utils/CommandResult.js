'use strict'
module.exports = class CommandResult {
  constructor() {
    this.output = []
  }

  addString(str) {
    this.output.push(str)
  }

  addShellOutput(output, opts = {}) {
    const text = output.stdout || output.stderr
    if (text) {
      if (opts.prepend) {
        this.output.push(opts.prepend)
      }
      this.output.push(text)
    }
  }

  toString() {
    return this.output.join('\n')
  }
}
