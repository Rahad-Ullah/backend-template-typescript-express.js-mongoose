import { Model, Types } from 'mongoose';

export interface INotification {
  _id: Types.ObjectId;
  type: string;
  title: string;
  message: string;
  receiver: Types.ObjectId;
  referenceId: string;
  isRead: boolean;
  createdAt: Date;
}

export type NotificationModel = Model<INotification>;
