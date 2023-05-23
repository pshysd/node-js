const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { afterUploadImage, uploadPost } = require('../controllers/post');
const { isLoggedIn } = require('../middlewares');

const router = express.Router();

if (!fs.existsSync('uploads')) { // readSync를 썼더니 에러가 나네...
    console.error('uploads 폴더가 없으므로 uploads 폴더를 생성합니다.');
    fs.mkdirSync('uploads');
}

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, 'uploads/');
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname); // 파일 원본명에서 확장자만 추출 img.png -> img2023042424124.png
            cb(null, path.basename(file.originalname, ext) + Date.now() + ext); // 콜백으로 넘김
        },
    }),
    limits: { fileSize: 20 * 1024 * 1024 }
});

// POST /post/img
router.post('/img', isLoggedIn, upload.single('img'), afterUploadImage);

// POST /post
const upload2 = multer(); // 새로 만든 이유는 upload와 설정이 다르기 때문
router.post('/', isLoggedIn, upload2.none(), uploadPost);

module.exports = router;