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

test('test join', function(assert) {
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

test('test privmsg', function(assert) {
  assert.plan(3)
  var base = setup()

  base.proto.on('privmsg', check)
  base.stream.write(':WraithBot!~ircstream@hostname.net PRIVMSG #pdxbots :lol')
  assert.end()

  function check(who, channel, message) {
    assert.equal(who, 'WraithBot')
    assert.equal(channel, '#pdxbots')
    assert.equal(message, 'lol')
  }
})

test('test motd', function(assert) {
  assert.plan(1)
  var base = setup()

  base.proto.on('motd', check)
  base.stream.write(':pratchett.freenode.net 375 WraithBot :- pratchett.freenode.net Message of the Day -')
  base.stream.write(':pratchett.freenode.net 372 WraithBot :- Please read http://blog.freenode.net/2010/11/be-safe-out-there/')
  base.stream.write(':pratchett.freenode.net 376 WraithBot :End of /MOTD command.')
  assert.end()
  function check(message) {
    assert.equal(message,
      '- Please read http://blog.freenode.net/2010/11/be-safe-out-there/')
  }
})

test('test names', function(assert) {
  assert.plan(2)
  var base = setup()

  base.proto.on('names', check)
  base.stream.write(':hitchcock.freenode.net 353 WraithBot = #pdxbots :various names that could exist')
  base.stream.write(':hitchcock.freenode.net 366 WraithBot #pdxbots :End of /NAMES list.')
  assert.end()

  function check(channel, names) {
    assert.equal(channel, '#pdxbots')
    assert.deepEqual(names, ['various', 'names', 'that', 'could', 'exist'])
  }
})
