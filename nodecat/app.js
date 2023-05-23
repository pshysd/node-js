// app.js에서 사용할 라이브러리들 불러오기
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
dotenv.config();
const indexRouter = require('./routes');
const app = express();

// app에서 사용할 포트번호, 템플릿엔진 설정
app.set('port', process.env.PORT || 4000);
app.set('view engine', 'html');
nunjucks.configure('views', {
    express: app,
    watch: true,
});

// 나머지 설정
app.use(morgan('dev'));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    }
}));

// 라우터 연결
app.use('/', indexRouter);

// 라우터에 연결되지 않은 경로로 접근하는 경우 404 에러 처리
app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
});


// 에러가 발생하면 마지막에 결국 여기로 옴
app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production';
    res.status(err.status || 500);
    res.render('error');
});

// 포트 연결해주고 서버 열기
app.listen(app.get('port'), () => {
    console.log(`${app.get('port')}번 포트에서 실행됨`);
});