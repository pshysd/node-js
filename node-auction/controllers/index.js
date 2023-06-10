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
	res.render('good', { title: '상품 등록 - NodAuction' });
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
