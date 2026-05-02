import { Request, Response, NextFunction } from 'express';
import { NotificationServices } from './notification.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';

// get my notifications
export const getMyNotifications = catchAsync(
  async (req: Request, res: Response) => {
    const result = await NotificationServices.getNotificationsByUserId(
      req.user.id,
      req.query,
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Notifications retrieved successfully',
      data: { data: result?.notifications, unreadCount: result?.unreadCount },
      pagination: result?.pagination,
    });
  },
);

// read single notification by id
export const readNotification = catchAsync(
  async (req: Request, res: Response) => {
    const result = await NotificationServices.readNotification(req.params.id);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Notification read successfully',
      data: result,
    });
  },
);

// read all notifications by user id
export const readAllNotifications = catchAsync(
  async (req: Request, res: Response) => {
    const result = await NotificationServices.readAllNotifications(req.user.id);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'All notifications read successfully',
      data: result,
    });
  },
);

export const NotificationController = {
  getMyNotifications,
  readNotification,
  readAllNotifications,
};
