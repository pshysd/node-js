const Sequelize = require('sequelize');

class Good extends Sequelize.Model {
	static initiate(sequelize) {
		Good.init(
			{
				name: {
					type: Sequelize.STRING(40),
					allowNull: false,
				},
				img: {
					type: Sequelize.STRING(200),
					allowNull: true,
				},
				price: {
					type: Sequelize.INTEGER,
					allowNull: false,
					defaultValue: 0,
				},
			},
			{
				sequelize,
				timestamps: true,
				modelName: 'Good',
				tableName: 'goods',
				paranoid: true,
				charset: 'utf8mb4',
				collate: 'utf8mb4_general_ci',
			}
		);
	}
	static associate(db) {
		db.Good.belongsTo(db.User, { as: 'Owner' });
		db.Good.belongsTo(db.User, { as: 'Sold' });
		db.Good.hasMany(db.Auction);
	}
}

module.exports = Good;
