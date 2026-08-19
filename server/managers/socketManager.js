const connectedUsers = new Map();

export function socketManager(io) {
  io.on('connection', (socket) => {
    console.log('🟢 Cliente conectado:', socket.id);

    socket.on('register-user', (userId) => {
      connectedUsers.set(String(userId), socket.id);

      console.log(`👤 Usuario ${userId} → ${socket.id}`);
    });

    socket.on('disconnect', () => {
      for (const [userId, socketId] of connectedUsers.entries()) {
        if (socketId === socket.id) {
          connectedUsers.delete(userId);
          break;
        }
      }

      console.log('🔴 Cliente desconectado:', socket.id);
    });
  });
}

export function getUserSocket(userId) {
  return connectedUsers.get(String(userId));
}