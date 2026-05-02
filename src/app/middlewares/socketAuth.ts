import jwt from 'jsonwebtoken';
import { Socket } from 'socket.io';
import ApiError from '../../errors/ApiError';
import { StatusCodes } from 'http-status-codes';
import { USER_ROLES } from '../modules/user/user.constant';

interface JwtPayload {
  id: string;
  role: USER_ROLES;
  email?: string;
  iat: number;
  exp: number;
}

export const socketAuth = (socket: Socket, next: (err?: Error) => void) => {
  try {
    // Check both handshake.auth and handshake.headers
    const token =
      socket.handshake.auth?.token || socket.handshake.headers?.token;

    if (!token) {
      return next(
        new ApiError(StatusCodes.UNAUTHORIZED, 'Authentication error'),
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as JwtPayload;

    socket.data.userId = decoded.id; // attach userId
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.UNAUTHORIZED, 'Authentication error'));
  }
};
