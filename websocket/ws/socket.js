const WebSocket = require('ws');

module.exports = (server) => {
	const wss = new WebSocket.Server({ server }); // 실제로 연결하는 과정

	wss.on('connection', (ws, req) => {
		const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress; // 옛날엔 req.connection.remoteAddress를 사용했음
		console.log('새로운 클라이언트 접속, ip: ', ip);
		// 수신
		ws.on('message', (message) => {
			console.log(message.toString()); // 7버전에서는 String이었으나 8버전에서 Buffer로 바뀌었기 때문에 toString()을 사용해서 parse 해줘야 함
		});

		ws.on('error', console.error);
		ws.on('close', () => {
			console.log(`${ip} 클라이언트 접속 해제`);
			clearInterval(ws.interval); // 접속이 끊어졌을 경우 3초마다 보내는 작업을 중단해야 함
		});

		ws.interval = setInterval(() => {
			// OPEN일 때만 메시지를 보낼 수 있음
			if (ws.readyState === ws.OPEN) {
				// 발신
				ws.send('서버에서 클라이언트로 3초마다 메시지를 보냅니다.');
			}
		}, 3000);
	});
};

/* 
  client -> server 메시지 보내는 경우(== 서버가 메시지를 받는 경우) -> ws.on
  server -> client 메시지 보내는 경우(== 사용자가 메시지를 받는 경우) -> ws.send
 */

/* 
          웹 소켓의 네가지 상태
          1. CONNECTING(연결 중)
          2. OPEN(열림)
          3. CLOSING(닫는 중)
          4. CLOSED(닫힘)
*/
