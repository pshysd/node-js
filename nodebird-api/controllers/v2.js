const jwt = require('jsonwebtoken');
const { Domain, User, Post, Hashtag } = require('../models');

exports.createToken = async (req, res) => {
    const { clientSecret } = req.body;
    try {
        const domain = await Domain.findOne({
            where: { clientSecret },
            include: {
                model: User,
                attribute: ['nick', 'id'],
            },
        });
        if (!domain) {
            return res.status(401).json({
                code: 401,
                message: '등록되지 않은 도메인입니다. 먼저 도메인을 등록하세요.',
            });
        }
        const token = jwt.sign({
            id: domain.User.id,
            nick: domain.User.nick,
        }, process.env.JWT_SECRET, {
            expiresIn: '30m', // 1분 -> 30분으로 늘림
            issuer: 'nodebird',
        });
        return res.json({
            code: 200,
            message: '토큰이 발급되었습니다',
            token,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            code: 500,
            message: 'Server Internal Error',
        });
    }
};

exports.tokenTest = (req, res) => {
    res.json(res.locals.decoded);
};

exports.getMyPosts = (req, res) => {
    Post.findAll({ where: { userId: req.locals.decoded.id } }) // middlewares/verifyToken에서 토큰 검증하고 유저 데이터 받아왔음 
        .then((posts) => { // Post.findAll({...})한 결과를 posts라는 이름으로 사용하겠다는 것
            res.json({
                code: 200,
                payload: posts, // payload == 응답할 때 보내줄 데이터 (여기서는 내 게시글들(위에 findAll 이용해서 받아온 myPosts))
            });
        })
        .catch((err) => {
            return res.status(500).json({
                code: 500,
                message: 'Server Internal Error',
            });
        });
};

exports.getPostsByHashtag = async (req, res) => {
    try {
        const hashtag = await Hashtag.findOne({ where: { title: req.params.title } }); // request 보낼 때 /v1/posts/hashtag/:title <- 라우터의 매개변수임 쿼리스트링x
        if (!hashtag) {
            return res.status(404).json({
                code: 404,
                message: '검색 결과가 없습니다',
            });
        }
        const posts = await hashtag.getPosts();
        if (posts.length === 0) {
            return res.status(404).json({
                code: 404,
                message: '검색 결과가 없습니다.',
            });
        }

        return res.json({
            code: 200,
            payload: posts,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            code: 500,
            message: 'Server Internal Error',
        });
    }
};