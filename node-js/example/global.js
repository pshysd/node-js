/* 
  노드에는 DOM, BOM이 없기 때문에 window와 document 객체를 사용할 수 없다
  따라서 이 둘을 아우르는 globalThis 객체가 만들어졌고, 이것은 브라우저 환경에서 자동으로 window, 노드 환경에서 자동으로 global이 된다.
 */