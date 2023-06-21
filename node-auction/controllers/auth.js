const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/user');

// 회원가입 절차
exports.join = async (req, res, next) => {
	// 유저가 입력한 정보들
	const { email, nick, password, money } = req.body;
	try {
		// 이미 존재하는 이메일 계정인지 검색
		const existUser = await User.findOne({ where: { email } });

		// 존재할 경우
		if (existUser) res.redirect('/join?error=이미 가입되었거나 탈퇴 처리된 이메일입니다. 관리자에게 문의해주세요.');

		// 비밀번호 해시화, 여기 도달하려면 위의 if문 조건에 들어가지 않아야 함
		const hash = await bcrypt.hash(password, 12);

		// DB에 입력한 정보 바탕으로 User 생성
		await User.create({ email, nick, password: hash, money });

		// 다됐으면 메인페이지로 리턴
		return res.redirect('/');
	} catch (error) {
		console.error(error);
		next(error);
	}
};

exports.login = async (req, res, next) => {
	passport.authenticate('local', (authError, user, info) => {
		// 일단 localStrategy로 가서 서버 에러는 authError가 받아오고 성공할 경우 null, user에 로그인한 유저 정보 담기고 info는 사용자가 지정한 에러정보
		if (authError) {
			console.error(authError);
			return next(authError);
		}

		// DB에 일치하는 유저가 없을 경우
		if (!user) res.redirect(`/?loginError=${info.message}`);

		return req.login(user, (loginError) => {
			if (loginError) {
				console.error(loginError);
				return next(loginError);
			}

			return res.redirect('/');
		});
	})(req, res, next);
};

exports.logout = (req, res) => {
	req.logout(() => {
		res.redirect('/');
	});
};
