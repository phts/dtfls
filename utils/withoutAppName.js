module.exports = function withoutAppName(filepath) {
  return filepath.replace(/^[^/]*\//, '')
}
