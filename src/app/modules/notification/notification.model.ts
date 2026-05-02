import { Schema, model } from 'mongoose';
import { INotification, NotificationModel } from './notification.interface';

const notificationSchema = new Schema<INotification, NotificationModel>(
  {
    type: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, default: '' },
    receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    referenceId: { type: String, default: '' },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Notification = model<INotification, NotificationModel>(
  'Notification',
  notificationSchema
);
