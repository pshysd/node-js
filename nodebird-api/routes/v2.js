const express = require('express');
const { verifyToken, apiLimiter, corsWhenDomainMatches } = require('../middlewares');
const { createToken, tokenTest, getMyPosts, getPostsByHashtag } = require('../controllers/v2');
const cors = require('cors');

const router = express.Router();


router.use(corsWhenDomainMatches);

// POST /v2/token - 토큰 발급 요청
router.post('/token', apiLimiter, createToken);

// GET /v2/test - 잘 발급 되었는지 테스트
router.get('/test', apiLimiter, verifyToken, tokenTest);

// GET /v2/posts/my - 내 게시글 요청
router.get('/posts/my', verifyToken, apiLimiter, getMyPosts);

// GET /v2/posts/hashtag/:title - 해시태그명으로 검색한 결과 요청
router.get('/posts/hashtag/:title', verifyToken, apiLimiter, getPostsByHashtag);

module.exports = router;