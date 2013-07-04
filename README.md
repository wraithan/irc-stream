#irc-stream

A duplex stream that takes a duplex stream as its input (such as a socket connection) and streams objects out.

## Usage

```javascript
var irc = require('irc-stream')
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
  , client = new irc(ircOptions)

client.socket.pipe(tcp).pipe(client.socket)

client.emitter.on('join', function(msg) {
  if (msg.channel === '#pdxbots') {
    client.write({
      type: 'privmsg'
    , target: '#pdxbots'
    , message: 'This is super neat!'
    })
  }
})

client.pipe(fs.createWriteStream('irc.log'))
```

## There are already so many IRC libs!

I know, but I feel like I can write a better one. 