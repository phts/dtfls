module.exports = {
  command: 'install <app...>',
  description: 'install local configs to the system',
  options: [
    ['--backup', 'create backups of original files'],
  ],
  action: apps => {
    return 'TODO: install'
  },
}
