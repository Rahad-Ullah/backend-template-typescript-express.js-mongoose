import { Types } from 'mongoose';
import ApiError from '../errors/ApiError';
import { StatusCodes } from 'http-status-codes';

/**
 * Convert string to ObjectId
 * @param id - String id
 * @returns {ObjectId} - Mongoose ObjectId
 */

export const toObjectId = (id: unknown) => {
  if (!Types.ObjectId.isValid(id as string)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid object id');
  }
  return new Types.ObjectId(id as string);
};
