import bcrypt from 'bcrypt';
import passport from 'passport';
import User from '../models/user';
import { RequestHandler } from 'express';

const join: RequestHandler = async (req, res, next) => {
	const { email, nick, password } = req.body;
	try {
		const exUser = await User.findOne({ where: { email } });
		if (exUser) {
			return res.redirect(`/join?error=exist`);
			1;
		}
		const hash = await bcrypt.hash(password, 12);
		await User.create({
			email,
			nick: nick,
			password: hash,
		});
		return res.redirect('/');
	} catch (err) {
		console.error(err);
		return next(err);
	}
};

const login:RequestHandler = (req, res, next) => {
	passport.authenticate('local', (authError, user, info) => {
		if (authError) {
			console.error(authError);
			return next(authError);
		}
		if (!user) {
			return res.redirect(`/?loginError=${info.message}`);
		}
		return req.login(user, (loginError) => {
			if (loginError) {
				console.error(loginError);
				return next(loginError);
			}
			return res.redirect('/');
		});
	})(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙여야 한다.
};

const logout: RequestHandler = (req, res) => {
	req.logout(() => {
		res.redirect('/');
	});
};

export {
	login,
	logout,
	join,
};
