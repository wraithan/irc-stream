var through = require('through')

function chunk(name) {
  return through(function write(data) {
    this.queue(data)
    // console.log('(' + name + ')[' + data + ']')
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

module.exports = {
  chunk: chunk
, newline: newline
}