const mongoose = require('mongoose');

const connect = () => {
  if (process.env.NODE_ENV !== 'production') {
    mongoose.set('debug', true);
  }

  mongoose.connect(`mongodb://${process.env.MONGO_ID}:${process.env.MONGO_PWD}@localhost:27017/admin`, {
    dbName: 'chatApp',
    useNewUrlParser: true,
  }, (error) => {
    if (errer) {
      console.log('몽고디비 연결 에러', error);
    } else {
      console.log('몽고디비 연결됨');
    }
  });
};

module.exports = connect;