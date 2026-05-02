import colors from 'colors';
import { Server } from 'socket.io';
import { logger } from '../shared/logger';
import { socketAuth } from '../app/middlewares/socketAuth';
import { User } from '../app/modules/user/user.model';

const socket = (io: Server) => {
  // authenticate by jwt auth middleware
  io.use(socketAuth);

  // socket events
  io.on('connection', async socket => {
    const userId = socket.data.userId;

    logger.info(colors.blue(`User connected: ${userId}`));
    
    // update user status to online
    await User.findByIdAndUpdate(userId, { isOnline: true });

    // join personal room
    socket.join(`user:${userId}`);

    // ----- join chat room -----
    // socket.on('room:join', async (chatId: string) => {
    //   if (!chatId || !chatId.match(/^[0-9a-fA-F]{24}$/)) {
    //     return socket.emit('error', 'Invalid chatId');
    //   }
    //   const chat = await Chat.exists({
    //     _id: chatId,
    //     isDeleted: false,
    //     participants: { $in: [userId] },
    //   });

    //   if (!chat) {
    //     return socket.emit(
    //       'error',
    //       'Chat not found or you are not a participant of this chat!',
    //     );
    //   }

    //   socket.join(`chat:${chatId}`);
    //   logger.info(colors.blue(`User:${userId} joined chat:${chatId}`));
    // });

    // ----- leave chat -----
    socket.on('room:leave', (chatId: string) => {
      if (!chatId || !chatId.match(/^[0-9a-fA-F]{24}$/)) {
        return socket.emit('error', 'Invalid chatId');
      }
      socket.leave(`chat:${chatId}`);
    });

    // ----- disconnect -----
    socket.on('disconnect', async () => {
      // update user status to offline
      await User.findByIdAndUpdate(userId, { isOnline: false });
      logger.info(colors.red(`User disconnected: ${userId}`));
    });
  });
};

export const socketHelper = { socket };
