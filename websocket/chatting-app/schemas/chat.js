const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema;

const chatSchema = new Schema({
  room: { type: ObjectId, required: true, ref: 'Room' },
  user: { type: Stirng, required: true },
  chat: String,
  gif: String,
});

module.exports = mongoose.model('Chat', chatSchema);