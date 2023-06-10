const { Op } = require('sequelize');
const { Good } = require('../models/good');

exports.renderMain = async (req, res, next) => {
	try {
		const yesterday = new Date();
		yesterday.setDate(yesterday.getDate() - 1); // 어제
		const goods = await Good.findAll({
			where: { SoldId: null, createdAt: { [Op.gte]: yesterday } },
		});

		res.render('main', {
			title: 'NodeAuction',
			goods,
		});
	} catch (error) {
		console.error(error);
		next(error);
	}
};

exports.renderJoin = async (req, res, next) => {
	res.render('join', { title: '회원가입 - NodeAuction' });
};

exports.renderGood = async (req, res, next) => {
	res.render('good', { title: '상품 등록 - NodeAuction' });
};

exports.createGood = async (req, res, next) => {
	try {
		const { name, price } = req.body;
		await Good.create({
			OwnerId: req.user.id,
			name,
			img: req.file.filename,
			price,
		});
		res.redirect('/');
	} catch (error) {
		console.error(error);
		next(error);
	}
};

exports.renderAuction = async (req, res, next) => {
	try {
		const [good, auction] = await Promis.all([
			Good.findOne({
				where: { id: req.params.id },
				include: {
					model: User,
					as: 'Owner',
				},
			}),
			Auction.findAll({
				where: { GoodId: req.params.id },
				include: { model: User },
				order: [['bic', 'ASC']],
			}),
		]);

		res.render('auction', {
			title: `${good.name} - NodeAuction`,
			good,
			auction,
		});
	} catch (error) {
		console.error(error);
		next(error);
	}
};

exports.bid = async (req, res, next) => {
	try {
		const { bid, msg } = req.body;
		const good = await Good.findOne({
			where: { id: req.params.id },
			include: { model: Auction },
			order: [[{ model: Auction }, 'bid', 'DESC']],
		});

		if (!good) res.status(404).send('물건이 존재하지 않습니다.');
		if (good.price >= bid) res.status(403).send('시작가보다 높은 가격을 입력해야합니다.');
		if (new Date(good.createdAt).valueOf() + 24 * 60 * 60 * 1000 < new Date())
			res.status(403).send('이미 종료된 경매입니다.');
		if (good.Auctions?.bid >= bid) res.status(403).send('이전 입찰가보다 높은 가격을 입력해야합니다.');

		const result = await Auction.create({
			bid,
			msg,
			UserId: req.user.id,
			GoodId: req.params.id,
		});

		req.app.get('io').to(req.params.id).emit('bid', {
			bid: result.bid,
			msg: result.msg,
			nick: req.user.nick,
		});

		return res.send('ok');
	} catch (error) {
		console.error(error);
		next(error);
	}
};
