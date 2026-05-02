import { INotification } from '../app/modules/notification/notification.interface';
import { Notification } from '../app/modules/notification/notification.model';

export const sendNotifications = async (
  data: Partial<INotification>,
  options: { saveToDB?: boolean } = { saveToDB: true },
): Promise<string> => {
  // Only create the notification if the flag is enabled
  if (options.saveToDB !== false) {
    await Notification.create(data);
  }

  //@ts-ignore
  const io = global.io;

  try {
    if (io && data.receiver) {
      io.to(`user:${data.receiver.toString()}`).emit('getNotification', data);
    }
  } catch (error) {
    console.error(`Error while sending notification: ${error}`);
    io.emit('error', error);
  }

  return 'Notification sent successfully';
};
