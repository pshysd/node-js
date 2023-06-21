const { Op } = require('sequelize');
const { Good, Auction, User, sequelize } = require('../models');
const schedule = require('node-schedule');

// 메인 페이지 렌더링
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

// 회원가입 페이지 렌더링
exports.renderJoin = async (req, res) => {
	res.render('join', { title: '회원가입 - NodeAuction' });
};

// 상품 등록 페이지 렌더링
exports.renderGood = async (req, res) => {
	res.render('good', { title: '상품 등록 - NodeAuction' });
};

// 상품 등록
exports.createGood = async (req, res, next) => {
	try {
		const { name, price } = req.body;
		const good = await Good.create({
			OwnerId: req.user.id,
			name,
			img: req.file.filename,
			price,
		});

		const end = new Date();
		end.setDate(end.getDate() + 1); // 하루 뒤
		const job = schedule.scheduleJob(end, async () => {
			// 이건 근데 서버 죽으면 같이 날아감

			// 낙찰자
			const success = await Auction.findOne({
				where: { GoodId: good.id },
				order: [['bid', 'DESC']], // 입찰가 내림차순으로 하면 맨 위에 가장 높은 한 사람이 올라올 것
			});
			await good.setSold(success.userId); // 낙찰
			await User.update(
				{
					// SET money = money - 10000000
					money: sequelize.literal(`money - ${success.bid}`),
				},
				{
					where: { id: success.UserId },
				}
			);
		}); // end 되는 시간에 실행할 함수를 만들어준다

		job.on('error', (error) => {
			console.error('스케줄링 에러', error);
		});

		job.on('success', () => {
			console.log(`${good.id} 스케줄링 성공`);
		});

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

// 경매 페이지 렌더링
exports.renderAuction = async (req, res, next) => {
	try {
		const [good, auction] = await Promis.all([
			// 일단 상품 찾아줌
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
				order: [['bid', 'ASC']],
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
		if (good.Auctions[0]?.bid >= bid) res.status(403).send('이전 입찰가보다 높은 가격을 입력해야합니다.');

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

exports.renderList = async (req, res, next) => {
	try {
		const goods = await Good.findAll({
			where: { SoldId: req.user.id },
			include: { model: Auction },
			order: [[{ mode: Auction }, 'bid', 'DESC']],
		});
		res.render('list', { title: '낙찰 목록 - NodeAuction', goods });
	} catch (error) {
		console.error(error);
		next(error);
	}
};
