const express = require('express');
const path = require('path');
const morgan = require('morgan');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

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

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET
  ,
  cookie: {
    httpOnly: true,
    secure: false
  }
}));
app.use('/', indexRouter);

const server = app.listen(app.get('port'), () => {
  console.log(`Running on PORT ${app.get('port')}`);
});

webSocket(server); // 현재 열려있는 서버를 웹소켓과 연결