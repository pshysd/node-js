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
console.log(
	'.path.format(): ',
	path.format({
		// path.parse()한 객체를 파일 경로로 합침.
		dir: 'C:\\users\\SH',
		name: 'path',
		ext: '.js',
	})
);
console.log('path.normalize(): ', path.normalize('C;//users\\SH\\//\\path.js')); // /나 \를 실수로 여러 번 사용했거나 혼용했을 때 정상적인 경로로 변환.
console.log('path.isAbsolute(C:\\):', path.isAbsolute('C:\\')); // 파일의 경로가 절대경로인지 상대경로인지 알림.
console.log('path.isAbsolute(./home):', path.isAbsolute('./home'));
console.log('------------------------------');
console.log('path.relative(기준경로, 비교경로):', path.relative('C:\\users\\SH\\path.js', 'C:\\')); // 경로를 두 개 넣으면 첫 번째 경로에서 두 번째 경로로 가는 방법을 알립니다.
console.log('path.join(경로, ...):', path.join(__dirname, '..', '..', '/users', '.', '/SH')); // 여러 인수를 넣으면 하나의 경로로 합침. 상대경로인 ..(부모 디렉터리)과 .(현 위치)도 알아서 처리.
console.log('path.resolve(경로, ...):', path.resolve(__dirname, '..', 'users', '.', '/SH')); // join과 비슷해보이나 다름

// 다른점: /를 만나면 path.resolve는 절대경로로 인식해서 앞의 경로를 무시하고, path.join은 상대경로로 처리

/* 
  ex) path.join('/a', '/b', 'c') // /a/b/c/ 
      path.resolve('/a', '/b', 'c'); // /b/c 
*/
