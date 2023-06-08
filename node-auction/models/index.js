const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const fs = require('fs');
const path = require('path');
const config = require('../config/config')[env];

const db = {};
const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = Sequelize;

const basename = path.basename(__filename);
console.log(basename);
