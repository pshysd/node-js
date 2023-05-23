import express from 'express';
import passport from 'passport';

import { isLoggedIn, isNotLoggedIn } from '../middlewares';
import { join, login, logout } from '../controllers/auth';

const router = express.Router();

// POST /auth/join
router.post('/join', isNotLoggedIn, join);

// POST /auth/login
router.post('/login', isNotLoggedIn, login);

// GET /auth/logout
router.get('/logout', isLoggedIn, logout);

// GET /auth/kakao
router.get('/kakao', passport.authenticate('kakao'));

// GET /auth/kakao/callback
router.get(
	'/kakao/callback',
	passport.authenticate('kakao', {
		failureRedirect: '/?error=카카오로그인 실패',
	}),
	(req, res) => {
		res.redirect('/'); // 로그인 성공 시에는 인덱스로 리다이렉트 시켜줍시다
	}
);

export default router;