import dns from 'dns/promises';

const ip = await dns.lookup('google.co.kr');
console.log('IP', ip);

const a = await dns.resolve('google.co.kr', 'A'); // ipv4, 'AAAA' -> ipv6
console.log('A', a);

const mx = await dns.resolve('google.co.kr', 'MX'); // 메일 서버 == 레코드
console.log('mx', mx);

const cname = await dns.resolve('www.google.com', 'CNAME'); // CNAME(별칭, 주로 www가 붙은 주소는 별칭인 경우가 많다
console.log('CNAME', cname);

const any = await dns.resolve('google.co.kr', 'ANY');
console.log('ANY', any);
