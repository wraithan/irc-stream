var irc = require('./index')
  , net = require('net')
  , fs = require('fs')
  , serverOptions = {
      host: 'chat.freenode.net'
    , port: 6667
    }
  , ircOptions = {
      nick: 'WraithBot'
    , channels: ['#pdxbots']
  }
  , tcp = net.createConnection(serverOptions)
  , client = irc(tcp, ircOptions)
  , utils = require('./lib/utils')

client.on('join', function(who, channel) {
  if (who === 'WraithBot' && channel === '#pdxbots') {
    client.privmsg('#pdxbots', 'This is super neat!')
  }
})

client.on('privmsg', function(who, channel, message) {

})

client.pipe(utils.newline())
  .pipe(fs.createWriteStream('irc.log'))
