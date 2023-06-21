const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const { renderMain, renderJoin, renderGood, createGood, renderAuction, renderList, bid } = require('../controllers');

const router = express.Router();

// 모든 라우터들은 일단 여기를 거쳐감
router.use((req, res, next) => {
	res.locals.user = req.user;
	next();
});

router.get('/', renderMain);

router.get('/join', isNotLoggedIn, renderJoin);

router.get('/good', isLoggedIn, renderGood);

const uploadsFolderPath = path.join(__dirname, 'uploads');

try {
	if (!fs.existsSync(uploadsFolderPath)) {
		fs.mkdirSync(uploadsFolderPath);
		console.log('uploads 폴더가 생성되었습니다.');
	} else {
		console.log('uploads 폴더가 이미 존재합니다.');
	}
} catch (error) {
	console.error('uploads 폴더 생성 중 오류가 발생했습니다:', error);
}

const upload = multer({
	storage: multer.diskStorage({
		destination(req, file, cb) {
			cb(null, 'uploads/');
		},
		filename(req, file, cb) {
			const ext = path.extname(file.originalname);
			cb(null, path.basename(file.originalname, ext) + new Date().valueOf() + ext);
		},
	}),

	limits: { fileSize: 5 * 1024 * 1024 },
});

router.post('/good', isLoggedIn, upload.single('img'), createGood);

router.get('/good/:id', isLoggedIn, renderAuction);

router.get('/good/:ib/bid', isLoggedIn, bid);

router.get('/list', isLoggedIn, renderList);

module.exports = router;
