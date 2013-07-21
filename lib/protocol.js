var through = require('through')
  , log = require('./logging')()

messages = 0
missed = 0

function protocol() {
  var stream = through(write)
    , checks = [
      {
        name: 'ping'
      , regex: /PING :(.*)/
      , func: ping
      }, {
        name: 'join'
      , regex: /:(.*)!.* JOIN (.*)/
      , func: join
      }, {
        name: 'privmsg'
      , regex: /:(.*)!.* PRIVMSG (.*) :(.*)/
      , func: privmsg
      }, {
        name: 'motd'
      , regex: /:.* (376|372|375) .* :(.*)/
      , func: motd()
      }
    ]

  function write(data) {
    messages++
    this.send = function() {
      var args = Object.values(arguments)
      this.emit.apply(this, args)
      args.unshift('event')
      this.emit.apply(this, args)
    }
    self = this
    var found = checks.some(function(element) {
      var args = element.regex.exec(data)
      if (args) {
        log.debug('Got: ' + element.name)
        element.func.apply(self, args)
        return true
      }
    })
    if (!found) {
      missed++
      log.error('[NYI]: ' + data)
    }
    this.queue(data)
  }
  return stream
}

module.exports = protocol

function ping(data, who) {
  this.send('ping', who)
}

function join(data, who, channel) {
  this.send('join', who, channel)
}

function privmsg(data, who, channel, message) {
  this.send('privmsg', who, channel, message)
}

function motd() {
  fullMessage = ''
  return function processMotd(data, code, message) {
    switch (code) {
      case '375':
        fullMessage = ''
        break
      case '372':
        fullMessage += message
        break
      case '376':
        this.send('motd', fullMessage)
        break
    }
  }
}
Object.values = function (obj) {
  var vals = [];
  for( var key in obj ) {
    if ( obj.hasOwnProperty(key) ) {
      vals.push(obj[key]);
    }
  }
  return vals;
}

process.on('SIGINT', function() {
  console.log('Got ' + messages + ' messages and missed ' + missed +'. (' +
              Math.floor((missed/messages)*100) + '%)')
  process.exit()
})