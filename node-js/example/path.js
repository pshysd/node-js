const path = require('path');

const string = __filename; // C:\부터 파일까지 모든 경로

console.log('path.sep:', path.sep); // 구분자 표시
console.log('path.delimeter', path.delimiter); // 환경 변수의 구분자

console.log('-------------------------------------------');

console.log('path.dirname(): ', path.dirname(string)); // string의 디렉토리 경로 추출
console.log('path.extname(): ', path.extname(string)); // string의 확장자 (.js) 추출
console.log('path.basename(): ', path.basename(string)); // == string의 파일명만 추출(path.js)
console.log('path.basename - extname: ', path.basename(string, path.extname(string))); // == string의 파일명만 추출(path.js)

console.log('-------------------------------------------');

console.log('path.parse(): ', path.parse(string));