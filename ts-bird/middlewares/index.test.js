/* 
    파일명.확장자 사이에 test나 spec
    index.spec.js
    index.test.js
    이면 테스트 파일로 친다
 */

test('1+1은 2입니다.', () => {
    expect(1 + 1).toEqual(2);
});