const axios = require('axios');

const URL = process.env.API_URL;
axios.defaults.headers.common.origin = process.env.ORIGIN; // 요청 보내는 주소 값을 헤더에 담음

const request = async (req, api) => {
    try {
        if (!req.session.jwt) {
            const tokenResult = await axios.post(`${URL}/token`, {
                clientSecret: process.env.CLIENT_SECRET,
            });
            req.session.jwt = tokenResult.data.token;
        }
        return await axios.get(`${URL}${api}`, {
            headers: { authorization: req.session.jwt }
        });
    } catch (error) {
        if (error.response?.status === 419) {
            delete req.session.jwt; // 만료된 토큰을 지움
            return request(req, api); // 재귀 함수로 다시 호출하면 delete 되었기 때문에 발급받고 get 요청을 다시 보냄
        }
        // throw error.response; // -> 위조가 되었거나 서버에 문제가 있거나 하면 에러를 호출한 쪽으로 던짐
        return error.response; // 근데 페이지에 제대로 호출이 안돼서 그냥 리턴으로 함 ...
    }
};

exports.getMyPosts = async (req, res, next) => {
    try {
        const result = await request(req, `/posts/my`);
        res.json(result.data);
    } catch (error) { // 위에 throw한 에러는 여기서 받게 됨
        console.error(error);
        next(error);
    }
};
exports.searchByHashtag = async (req, res, next) => {
    try {
        const result = await request(req, `/posts/hashtag/${encodeURIComponent(req.params.hashtag)}`); // 한글로 된 해시태그는 인식 못 할 수도 있으니 encodeURIComponent로 감싸줌
        res.json(result.data);
    } catch (error) {
        console.error(error);
        next(error);
    }
};


exports.test = async (req, res, next) => {
    try {
        if (!req.session.jwt) {
            const tokenResult = await axios.post('http://localhost:8002/v1/token', {
                clientSecret: process.env.CLIENT_SECRET,
            });
            if (tokenResult.data?.code == 200) {
                req.session.jwt = tokenResult.data.token; // 세션에 토큰 저장함
            } else {
                return res.status(tokenResult.data?.code).json(tokenResult.data);
            }
        }

        const result = await axios.get('http://localhost:8002/v1/test', {
            headers: { authorization: req.session.jwt }
        });
        return res.json(result.data);
    } catch (err) {
        console.error(err);
        if (err.response?.status === 419) {
            return res.json(err.response.data);
        }
        return next(err);
    }
};

exports.renderMain = (req, res) => {
    res.render('main', { key: process.env.CLIENT_SECRET });
}
}