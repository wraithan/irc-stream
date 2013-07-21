var EventEmitter = require('events').EventEmitter
  , through = require('through')
  , split = require('split')
  , protocol = require('./lib/protocol')


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

  send.pipe(chunk('send'))
    .pipe(newline())
    .pipe(conn)

  conn.pipe(split())
    .pipe(chunk('recv'))
    .pipe(recv)
    .pipe(stream)

  recv.on('ping', function(who) {
    send.write('PONG :' + who)
  })

  recv.on('event', function(data) {
    stream.emit.apply(stream, data)
  })

  stream.privmsg = function privmsg(target, msg) {
    console.log(['privmsg', target, msg])
    send.write('PRIVMSG ' + target + ' :' + msg)
  }

  return stream
}

function chunk(name) {
  return through(function write(data) {
    this.queue(data)
//    console.log('(' + name + ')[' + data + ']')
  })
}

function newline() {
  return through(function write(data) {
    if (data[data.length-1] !== '\n') {
      data += '\n'
    }
    this.queue(data)
  })
}

module.exports = irc