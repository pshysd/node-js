const SocketIO = require('socket.io');

module.exports = (server) => {
  const io = SocketIO(server, { path: '/socket.io' });

  io.on('connection', (socket) => {
    const req = socket.request;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress; // 옛날엔 req.connection.remoteAddress를 사용했음
    console.log('새로운 클라이언트 접속, ip: ', ip, socket.id, req.ip);
    socket.on('disconnect', () => {
      console.log('클라이언트 접속 해제', ip, socket.id);
    });
    socket.on('message', (message) => {
      console.log(message.toString()); // 7버전에서는 String이었으나 8버전에서 Buffer로 바뀌었기 때문에 toString()을 사용해서 parse 해줘야 함
    });

    socket.on('error', console.error);
    socket.on('close', () => {
      console.log(`${ip} 클라이언트 접속 해제`);
      clearInterval(socket.interval); // 접속이 끊어졌을 경우 3초마다 보내는 작업을 중단해야 함
    });
    socket.interval = setInterval(() => {
      // socket.io에서는 따로 소켓의 상태를
    }, 3000);
  });
};