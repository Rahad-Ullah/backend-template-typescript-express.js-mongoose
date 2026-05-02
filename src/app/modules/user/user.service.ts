import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../../errors/ApiError';
import { emailHelper } from '../../../helpers/emailHelper';
import { emailTemplate } from '../../../shared/emailTemplate';
import unlinkFile from '../../../shared/unlinkFile';
import generateOTP from '../../../utils/generateOTP';
import { IUser } from './user.interface';
import { User } from './user.model';
import { USER_ROLES } from './user.constant';

const createUserToDB = async (payload: Partial<IUser>): Promise<IUser> => {
  //set role
  payload.role = USER_ROLES.USER;

  const createdUser = await User.create(payload);
  if (!createdUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create user');
  }

  //send email
  const otp = generateOTP(6);
  const values = {
    name: createdUser.name,
    otp: otp,
    email: createdUser.email!,
  };
  const createAccountTemplate = emailTemplate.createAccount(values);
  emailHelper.sendEmail(createAccountTemplate);

  //save to DB
  const authentication = {
    oneTimeCode: otp,
    expireAt: new Date(Date.now() + 5 * 60 * 1000), // 5 min
  };
  await User.findOneAndUpdate(
    { _id: createdUser._id },
    { $set: { authentication } },
  );

  // remove password
  createdUser.password = '';

  return createdUser;
};

const getSingleUserFromDB = async (id: string): Promise<Partial<IUser>> => {
  const isExistUser = await User.isExistUserById(id);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  return isExistUser;
};

const updateProfileToDB = async (
  user: JwtPayload,
  payload: Partial<IUser>
): Promise<Partial<IUser | null>> => {
  const { id } = user;
  const isExistUser = await User.isExistUserById(id);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  //unlink file here
  if (payload.image && isExistUser.image) {
    unlinkFile(isExistUser.image);
  }

  const updateDoc = await User.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });

  return updateDoc;
};

export const UserService = {
  createUserToDB,
  getSingleUserFromDB,
  updateProfileToDB,
};
