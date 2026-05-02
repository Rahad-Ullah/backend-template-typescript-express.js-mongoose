import { timeAgo } from '../../../utils/timeAgo';
import QueryBuilder from '../../builder/QueryBuilder';
import { Notification } from './notification.model';
import { Types } from 'mongoose';

// get notifications by user id
const getNotificationsByUserId = async (
  userId: string,
  query: Record<string, any>,
): Promise<{ notifications: any; pagination: any; unreadCount: number }> => {
  const notificationQuery = new QueryBuilder(
    Notification.find({ receiver: userId }).sort('-createdAt'),
    query,
  ).paginate();

  const [notifications, pagination, unreadCount] = await Promise.all([
    notificationQuery.modelQuery.lean().exec(),
    notificationQuery.getPaginationInfo(),
    Notification.countDocuments({ receiver: userId, isRead: false }),
  ]);

  return {
    notifications: notifications.map((notification: any) => {
      return {
        ...notification,
        timeAgo: timeAgo(notification.createdAt),
      };
    }),
    pagination,
    unreadCount,
  };
};

// read single notification by id
const readNotification = async (id: string) => {
  // check if the notification exists
  const existingNotification = await Notification.exists({ _id: id });
  if (!existingNotification) {
    throw new Error('Notification not found');
  }

  const result = await Notification.findByIdAndUpdate(
    id,
    { isRead: true },
    {
      new: true,
    },
  );
  return result;
};

// read all notifications by user id
const readAllNotifications = async (userId: string) => {
  const result = await Notification.bulkWrite([
    {
      updateMany: {
        filter: { receiver: new Types.ObjectId(userId), isRead: false },
        update: { $set: { isRead: true } },
        upsert: false,
      },
    },
  ]);
  return result;
};

export const NotificationServices = {
  getNotificationsByUserId,
  readNotification,
  readAllNotifications,
};
