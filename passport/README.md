# PASSPORT

Passport.js 패키지를 사용하면 회원가입, 로그인 기능을 간편하게 구현할 수 있다...

카카오 페이스북 구글 네이버 같은것도 가능 ㄷ ㄷ

## passport.js

```js
const passport = require('passport');
const LocalStratgy = require('passport-local').Strategy;
const Users = require('./user');

module.exports = () => {
	// Strategy 성공 시 호출됨
	passport.serializeUser((user, done) => {
		done(null, user); // 여기의 user가 deserializeUser의 첫번째 매개 변수로 이동
	});

	// 매개 변수 user는 serializeUser의 done의 user를 받은 것
	passport.deserializeUser((user, done) => {
		done(null, user); // 여기의 user가 req.user가 된다.
	});
};

// local 전략을 세운다. LocalStrategy 파일로 빼서 import 시켜도 됨
passport.use(
	new LocalStrategy(
		{
			usernameField: 'id',
			passowrdField: 'pw',
			session: true, // 세션에 저장 여부
			passReqToCallback: false,
		},
		// 여기서부터 실제 검증 로직
		(id, password, done) => {
			// 일단 아이디로 유저를 찾아봄
			Users.findOne({ id: id }, (findError, user) => {
				// 비교 과정에서 서버 에러가 발생할 경우 여기서 걸림
				if (findError) done(findError);
				// 아이디가 없을 경우 여기서 걸림
				if (!user) done(null, false, { message: '존재하지 않는 아이디입니다.' }); // 임의 에러 처리
				// 아이디가 있을 경우 비밀번호 대조
				return user.comparePassword(password, (passError, isMatch) => {
					// 비밀번호 일치할 경우 두번째 매개 변수의 user 객체를 전송해줌 -> Sequelize나 Mongoose같은걸로 만들어둔 스키마 객체
					if (ismatch) done(null, user);

					// 비번 틀림
					return done(null, false, { message: '비밀번호가 틀렸습니다.' });
				});
			});
		}
	)
);
```

passport는 `Strategy`라는 것을 사용한다. 모든 passport의 플러그인들은 사용하려면 `Strategy`를 만들어줘야함 (위의 경우는 local의 경우)

### LocalStrategy

`usernameField`와 `passwordField`는 어떤 폼 필드로부터 아이디와 비밀번호를 전달받을지 설정하는 옵션

`session`: 세션 사용 여부

`passReqToCallback`은 true로 두면 뒤의 콜백이

`(req, id, password, done) => {}; `

로 바뀐다. id 앞에 `**req**` 매개 변수가 추가되었다. 이것을 통해서 express의 req 객체에 접근할 수 있다.

-> 그니까 req로 받아온 값을 인증하는데에 사용할 수 있다는 소리

### done

인자를 세개나 받는 더러운 놈

- 첫번째: DB조회 같은 때 발생하는 서버 에러를 넣음. 무조건 실패하는 경우에만 사용됨
- 두번째: 성공했을 때 return할 값을 넣음. <- 성공했으니 첫번째 인자는 당연히 null일 것
- 세번째: 사용자가 임의로 실패를 만들고 싶을 때 사용 <- ?? 비밀번호가 틀렸거나 하는 경우에 임의로 실패를 만들어야 하기 때문 (비번 틀렸을 때 리턴해주는 구문보면 알 수 있음)

### serializeUser와 deserializeUser

얘넨 패스포트 쓰려면 필수임

- serializeUser: 로그인 성공 시 실행되는 `done(null, user);`에서 `user` 객체를 전달받아 세션(req.session.passport.user)에 저장한다
- deserializeuser: 실제 서버로 들어오는 요청마다 세션 정보(serializeUser에서 저장된거)를 실제 DB의 데이터와 비교하여 있으면 done의 두번째 인자를 `req.user`에 저장, 요청을 처리할 때 유저의 정보를 `req.user`를 통해 넘겨줌

위의 예시에서는 아무런 처리 과정 없이 그냥 넘겨줌

## user.js

```js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
	id: String,
	password: String,
});

userSchema.methods.comparePassword = function (inputPassword, cb) {
	if (inputPassword === this.password) cb(null, true); // 실제로는 password를 암호화하는 과정을 한번 더 거친 후에 비교함
	else cb('error');
};

module.exports = mongoose.model('users', userSchema);
```

## server.js

```js
const express = require('express');
const path = require('path');
const session = require('express-session');
const db = require('./db');
const passport = require('passport'); <-
const passportConfig = require('./passport'); <-

const authRouter = require('./routes/auth');

~

const app = express();
app.set('port', process.env.PORT || 1234);
app.set('view engine', 'html');

~

app.use(passport.initialize()); <- // passport 구동
app.use(passport.session());  <- // session 연결

~

passportConfig(); <- // 패스포트 설정

~

app.listen(app.get('port'), () => {
	console.log(`Server on port ${app.get('port')}`);
})
```

## auth.js (routes/auth.js)

```js
const passport = require('passport');

~

router.post('/login', isNotLoggedIn, passport.authenticate('local', {
		failureRedirect: '/',
	}),(req, res) => {
		res.redirect('/');
	}
);
```

이제 `/auth/login`으로 POST 요청을 보내면 passport에서 local에 대한 인증 작업을 시작한다.

`failureRedirect`와 `res.redirect`는 각각 실패했을 경우와 성공했을 경우에 어디로 보낼지 지정한다

디렉토리 나누는 방식이나 passport 버전 바뀌면서 조금씩 달라지긴 하는거같은데 큰 틀은 비슷한듯
