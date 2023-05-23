const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit'); // API 호출 요청 제한두게 해주는 라이브러리
const cors = require('cors');
const { Domain } = require('../models');
exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(403).send('로그인 필요');
    }
};

exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        next();
    } else {
        const message = encodeURIComponent('이미 로그인한 상태입니다.');
        res.redirect(`/?error=${message}`);
    }
};

exports.verifyToken = (req, res, next) => {
    try {
        res.locals.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
        // res.locals: Express에 내장되어있는 응답을 생성할 때 사용되는 변수를 담아놓는 객체
        return next();
    } catch (err) {
        if (err.name === 'TokenExpriedError') { // 유효기간 초과
            return res.status(419).json({
                code: 419,
                message: '토큰이 만료되었습니다.',
            });
        }
        return res.status(401).json({
            code: 401,
            message: '유효하지 않은 토큰입니다.'
        });
    }
};

exports.apiLimiter = async (req, res, next) => { // 얘는 근데 DDOS 공격엔 큰 의미 없음.. 어쨌든 요청을 받은거기 때문에 이걸 방지하려면 방패막이 세워야 함 cloudflare같은
    let user;
    if (res.locals.decoded.id) {
        user = await User.findOne({ where: { id: req.locals.decoded.id } }); // 요청한 사용자 정보 가져와서
    }
    rateLimit({
        windowMs: 60 * 1000,
        max: user?.type === 'premium' ? 1000 : 10, // premium 이용자라면 요청횟수 최대 1000회, 아니라면 10회
        handler(req, res) {
            res.status(this.statusCode).json({
                code: this.statusCode,
                message: '1분에 한번만 요청할 수 있습니다.',
            });
        }
    })(req, res, next); // 미들웨어 확장 패턴
};

exports.deprecated = (req, res) => {
    res.status(410).json({
        code: 410,
        message: '새로운 버전이 나왔습니다. 업데이트 해주세요.'
    });
};

exports.corsWhenDomainMatches = async (req, res, next) => {
    const domain = await Domain.findOne({
        where: { host: new URL(req.get('origin').host) }
    });
    if (domain) {
        cors({
            origin: req.get('origin'),
            Credentials: true,
        })(req, res, next);
    } else {
        next();
    }
};