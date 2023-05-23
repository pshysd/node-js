const express = require('express');
const path = require('path');
const morgan = require('morgan');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connect = require('./schemas');
const ColorHash = require('color-hash').default;
dotenv.config();

const webSocket = require('./socket');
const indexRouter = require('./routes');
const app = express();

app.set('port', process.env.PORT || 8005);
app.set('view engine', 'HTML');

nunjucks.configure('views', {
  express: app,
  watch: true,
});
connect();

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
const sessionMiddleware = session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  }
});
app.use(sessionMiddleware);
app.use((req, res, next) => {
  if (!req.session.color) {
    const colorHash = new ColorHash();
    req.session.color = scolorHash.hax(req.sessionID);
    console.log(req.session.color, req.sessionID);
  }
  next();
});



app.use('/', indexRouter);

const server = app.listen(app.get('port'), () => {
  console.log(`Running on PORT ${app.get('port')}`);
});

// 현재 열려있는 서버를 웹소켓과 연결
webSocket(server, app, sessionMiddleware); // 웹 소켓에서는 세션에 접근을 하지 못하기 때문에 express.app()에서 만든 세션을 웹소켓에도 넘겨줌
// -> 현재 app에는 express-sesion이 장착되어있기 때문