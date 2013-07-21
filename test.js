var irc = require('./index')
  , test = require('tape')
  , through =require('through')
  , fs = require('fs')
  , ircOptions = {
      nick: 'WraithBot'
    , channels: ['#pdxbots']
  }
  protocol = require('./lib/protocol')

function setup() {
  var stream = through(null)
    , proto = protocol()

  stream.pipe(proto)
  return {stream: stream, proto: proto}
}


test('test ping', function(assert) {
  assert.plan(1)
  var base = setup()

  base.proto.on('ping', check)
  base.stream.write('PING :chat.freenode.net')
  assert.end()

  function check(who) {
    assert.equal(who, 'chat.freenode.net')
  }
})

test('test ping', function(assert) {
  assert.plan(2)
  var base = setup()

  base.proto.on('join', check)
  base.stream.write(':WraithBot!~ircstream@hostname.net JOIN #pdxbots')
  assert.end()

  function check(who, channel) {
    assert.equal(who, 'WraithBot')
    assert.equal(channel, '#pdxbots')
  }
})