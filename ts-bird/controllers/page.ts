import Post from '../models/post';
import User from '../models/user';
import Hashtag from '../models/hashtag';
import { RequestHandler } from 'express';

const renderProfile: RequestHandler = (req, res) => {
	res.render('profile', { title: '내 정보 - NodeBird' });
	/* 
    res.render() 메소드는 뷰 템플릿 엔진으로 뿌릴 때 쓰는건데
    리액트 쓸거면 사용할 일이 없다고 보면 된다
     */
};

const renderJoin: RequestHandler = (req, res) => {
	res.render('join', { title: '회원가입 - NodeBird' });
};

const renderMain: RequestHandler = async (req, res, next) => {
	try {
		const posts = await Post.findAll({
			include: {
				model: User,
				attributes: ['id', 'nick'],
			},
			order: [['createdAt', 'DESC']],
		});
		res.render('main', {
			title: 'NodeBird',
			twits: posts,
		});
	} catch (err) {
		console.error(err);
		next(err);
	}
};

const renderHashtag: RequestHandler = async (req, res, next) => {
	const query = req.query.hashtag;
	if (!query) {
		return res.redirect('/');
	}
	try {
		const hashtag = await Hashtag.findOne({ where: { title: query } });
		let posts: Post[] = [];
		if (hashtag) {
			posts = await hashtag.getPosts({
				include: [{ model: User }],
			});
		}
		res.render('main', {
			title: `${query} | NodeBird`,
			twits: posts,
		});
	} catch (err) {
		console.error(err);
		next(err);
	}
};

export { renderHashtag, renderProfile, renderMain, renderJoin };
