#irc-stream

A duplex stream that takes a duplex stream as its input (such as a socket connection) and streams objects out.

## Usage

```javascript
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

client.on('join', function(who, channel) {
  console.log(who+' joined '+channel)
  if (who === 'WraithBot' && channel === '#pdxbots') {
    client.privmsg('#pdxbots', 'This is super neat!')
  }
})

client.pipe(fs.createWriteStream('irc.log'))
```

## There are already so many IRC libs!

I know, but I feel like I can write a better one. 