const { Post, User, Hashtag } = require('../models');

exports.renderProfile = (req, res) => {
    res.render('profile', { title: '내 정보 - NodeBird' });
    /* 
    res.render() 메소드는 뷰 템플릿 엔진으로 뿌릴 때 쓰는건데
    리액트 쓸거면 사용할 일이 없다고 보면 된다
     */
};

exports.renderJoin = (req, res) => {
    res.render('join', { title: '회원가입 - NodeBird' });
};

exports.renderMain = async (req, res, next) => {
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

exports.renderHashtag = async (req, res, next) => {
    const query = req.query.hashtag;
    if (!query) {
        return res.redirect('/');
    }
    try {
        const hashtag = await Hashtag.findOne({ where: { title: query } });
        let posts = [];
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