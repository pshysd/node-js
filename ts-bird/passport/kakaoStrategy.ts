import passport from 'passport';
import { Strategy as KakaoStrategy } from 'passport-kakao';
import User from '../models/user';

export default () => {
	passport.use(
		new KakaoStrategy(
			{
				clientID: process.env.KAKAO_ID!,
				callbackURL: '/auth/kakao/callback',
			},
			async (accessToken, refreshToken, profile, done) => {
				// accessToken, refreshToken -> OAuth2
				console.log('kakao profile: ', profile);
				try {
					const exUser = await User.findOne({
						where: { snsId: profile.id, provider: 'kakao' },
					});
					if (exUser) {
						done(null, exUser);
					} else {
						const newUser = await User.create({
							email: profile._json?.kakao_account?.email,
							nick: profile.displayName,
							snsId: profile.id,
							provider: 'kakao',
						});
						done(null, newUser);
					}
				} catch (err) {
					console.error(err);
					done(err);
				}
			}
		)
	);
};
