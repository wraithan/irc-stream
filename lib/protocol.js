var through = require('through')

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
      }
    ]

  function write(data) {
    this.send = function() {
      var args = Object.values(arguments)
      this.emit('event', args)
      this.emit(args.shift(), args)
    }
    self = this
    checks.forEach(function(element) {
      var args = element.regex.exec(data)
      if (args) {
        console.log('Got: ' + element.name)
        element.func.apply(self, args)
      }
    })
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

Object.values = function (obj) {
  var vals = [];
  for( var key in obj ) {
    if ( obj.hasOwnProperty(key) ) {
      vals.push(obj[key]);
    }
  }
  return vals;
}