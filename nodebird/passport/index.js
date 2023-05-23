const passport = require('passport');
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const { User } = require('../models');

module.exports = () => {
    passport.serializeUser((user, done) => {
        done(null, user.id); // 세션에 user의 id만 저장
    });

    passport.deserializeUser((id, done) => {
        User.findOne({
            where: { id },
            include: [
                {
                    model: User,
                    attributes: ['id', 'nick'],
                    as: 'Followers',
                }, // 팔로잉
                {
                    model: User,
                    attributes: ['id', 'nick'],
                    as: 'Followings',
                }, // 팔로워
            ]
        })
            .then(user => done(null, user)) // 결과 값에 req.user로 접근할 수 있게 됨. req.isAuthenticated()를 호출하면 true
            .catch(err => done(err));
    });

    local();
    kakao();
};

/* 
    serializeUser(): 사용자 객체를 세션에 저장할 때 어떤 정보를 저장할지 정하는 메서드
    보통 pk인 id를 저장함. 이후 요청이 들어올 때마다 deserializeUser()를 통해 세션에 저장된 사용자 객체를 가져와 인증 작업을 처리

    deserializeUser(): 세션에 저장된 사용자 객체를 데이터베이스에서 찾아 변환하는 메서드
    serializeUser()에서 저장한 userId를 바탕으로 데이터베이스에서 해당 사용자 정보를 찾아 사용자 객체를 생성함
    생성된 사용자 객체는 req.user에 저장되어 router에서 사용할 수 있다
    -> 그니까 DB에서 꺼내와서 done()에 user 넘겨주면 다음 미들웨어로 넘어갈 때 req에 들어있단 소리
 */
