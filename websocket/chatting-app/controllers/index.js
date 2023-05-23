const Room = require('../schemas/room');
const Chat = require('../schemas/chat');
const { removeRoom: removeRoomService } = require('../services');

exports.renderMain = async (req, res, next) => {
  try {
    const rooms = await Room.find({});
    res.render('main', { rooms, title: 'GIF 채팅방' });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.renderRoom = async (req, res, next) => {
  res.render('room', { title: 'GIF 채팅방 생성' });
};

exports.createRoom = async (req, res, next) => {
  try {
    await Room.create({
      title: req.body.title,
      max: req.body.max,
      owner: req.session.color,
      password: req.body.password
    });

    const io = req.app.get('io');
    io.of('/room').emit('newRoom', newRoom);

    // 방에 비번 걸려있을 경우
    if (req.body.password) {
      res.redirect(`/room/${newRoom._id}?password=${req.body.password}`);
    } else {
      res.redirect(`/room/${newRoom._id}`);
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.enterRoom = async (req, res, next) => {
  try {
    const room = await Room.findOne({ _id: req.params.id });
    if (!room) {
      return res.redirect('?error=존재하지 않는 채팅방입니다.');
    }
    // 비번 걸려있는 방에 비번 입렸했는데 틀렸을 경우
    if (room.password && room.password !== req.query.password) {
      return res.redirect('?error=비밀번호가 틀렸습니다.');
    }

    const io = req.get.app('io');
    const { rooms } = io.of('/chat').adapter;

    // 풀방일 경우
    if (room.max <= rooms.get(req.params.id)?.size) {
      return res.redirect('/?error=정원이 가득 찼습니다.');
    }
    res.render('chat', { title: 'GIF 채팅방 생성', chats: [], user: req.session.color });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.removeRoom = async (req, res, next) => {
  try {
    await removeRoomService(req.params.id);
    res.send('ok');
  } catch (error) {
    console.error(error);
    next(error);
  }
};