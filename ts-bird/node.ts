import fs from 'fs/promises';

fs.readFile('package.json')
	.then((data) => {
		// @types <- 가 붙은 모듈들을 따로 설치를 해줘야함 ex) @types/express-session, @types/node
		console.log(data);
	})
	.catch(() => {});
