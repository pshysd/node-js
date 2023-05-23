// 별 의미 없음 v1 == version1

const express = require('express');

const { verifyToken, deprecated } = require('../middlewares');
const { createToken, tokenTest, getMyPosts, getPostsByHashtag } = require('../controllers/v1');

const router = express.Router();


router.use(deprecated);

// POST /v1/token - 토큰 발급 요청
router.post('/token', createToken);

// GET /v1/test - 잘 발급 되었는지 테스트
router.get('/test', verifyToken, tokenTest);

// GET /v1/posts/my - 내 게시글 요청
router.get('/posts/my', verifyToken, getMyPosts);

// GET /v1/posts/hashtag/:title - 해시태그명으로 검색한 결과 요청
router.get('/posts/hashtag/:title', verifyToken, getPostsByHashtag);

module.exports = router;