import express from 'express';
import { isLoggedIn, isNotLoggedIn } from '../middlewares';
import { renderProfile, renderJoin, renderMain, renderHashtag } from '../controllers/page';

const router = express.Router();

router.use((req, res, next) => {
	res.locals.user = req.user;
	res.locals.followerCount = req.user?.Followers.length || 0;
	res.locals.followingCount = req.user?.Followings.length || 0;
	res.locals.followingIdList = req.user?.Followings?.map((f) => f.id) || [];
	next();
});

// GET /profile
router.get('/profile', isLoggedIn, renderProfile);

// GET /join
router.get('/join', isNotLoggedIn, renderJoin);

// GET /hashtag
router.get('/hashtag', renderHashtag); // hashtag?hasgtag=asd

// GET /
router.get('/', renderMain);

export default router;
