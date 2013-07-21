var debug = require('debug')
  , levels = ['debug', 'info', 'warn', 'error']

function getLoggers() {
  var loggers = {}
  levels.forEach(function(e) {
    loggers[e] = debug(e)
  })
  return loggers
}

module.exports = getLoggers