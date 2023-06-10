exports.isLoggedIn = (req, res, next) => {
	// 로그인 되었으면 ok
	if (req.isAuthenticated()) next();
	else res.status(401).send('로그인 필요');
};
exports.isNotLoggedIn = (req, res, next) => {
	// 로그인 안되었으면 ok
	if (!req.isAuthenticated()) next();
	else {
		const message = encodeURI('로그인한 상태입니다.');
		res.redirect(`/?error=${message}`);
	}
};
