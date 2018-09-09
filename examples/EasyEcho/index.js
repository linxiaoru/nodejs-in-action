const net = require('net');

const server = net.createServer((socket) => {
  socket.on('data', (data) => {
    socket.write(data);
  });
});

server.listen(8888);

//usage: telnet 127.0.0.1 8888