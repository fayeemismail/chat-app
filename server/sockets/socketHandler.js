import { Server } from 'socket.io';

const users = {};

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    const userId = socket.handshake.auth.userId;

    if (userId) {
      if (users[userId]) {
        io.sockets.sockets.get(users[userId]).disconnect(true);
      }

      users[userId] = socket.id;
      console.log('user logged in');

      socket.emit('socket_id', socket.id);
    }

    socket.on('join_room', (room) => {
      socket.join(room);
    });

    socket.on('send_message', (data) => {
      socket.to(data.room).emit('receive_message', data);
    });

    socket.on('disconnect', () => {
      delete users[userId];
    });
  });

  return io;
};

export default initializeSocket;
