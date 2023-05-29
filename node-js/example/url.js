const url = require('url');
const { URL } = url; // 내장 객체라 반드시 가져올 필요는 없음

const myURL = new URL('http://www.google.com/');
console.log('new URL():', myURL);
console.log('url.format(): ', url.format(myURL));
