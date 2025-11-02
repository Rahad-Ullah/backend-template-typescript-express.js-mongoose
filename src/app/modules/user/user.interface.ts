import { Model } from 'mongoose';
import { USER_ROLES, USER_STATUS } from './user.constant';

export type IUser = {
  name: string;
  role: USER_ROLES;
  email: string;
  password: string;
  phone: string;
  image?: string;
  status: USER_STATUS;
  isVerified: boolean;
  isDeleted: boolean;
  authentication?: {
    isResetPassword: boolean;
    oneTimeCode: number;
    expireAt: Date;
  };
};

export type UserModal = {
  isExistUserById(id: string): any;
  isExistUserByEmail(email: string): any;
  isMatchPassword(password: string, hashPassword: string): boolean;
} & Model<IUser>;
