var EventEmitter = require('events').EventEmitter
  , through = require('through')
  , split = require('split')
  , protocol = require('./lib/protocol')
  , utils = require('./lib/utils')


var irc = function(conn, options) {
  var stream = through(null)
    , send = through(null)
    , recv = protocol()

  conn.once('data', function() {
    console.log('connected')
    send.write('NICK ' + options.nick)
    send.write('USER ircstream 0 * :ircstream')
    send.write('JOIN :'+ options.channels[0])
  })

  send.pipe(utils.chunk('send'))
    .pipe(utils.newline())
    .pipe(conn)

  conn.pipe(split())
    .pipe(utils.chunk('recv'))
    .pipe(recv)
    .pipe(stream)

  recv.on('ping', function(who) {
    send.write('PONG :' + who)
  })

  recv.on('event', function() {
    stream.emit.apply(stream, arguments)
  })

  stream.privmsg = function privmsg(target, msg) {
    send.write('PRIVMSG ' + target + ' :' + msg)
  }

  stream.raw = function raw(data) {
    send.write(data)
  }

  return stream
}

module.exports = irc