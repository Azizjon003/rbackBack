import bcrypt from 'bcrypt';

import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import Jwt from '@src/common/utils/jwt';
import { RouteError } from '@src/common/utils/route-errors';
import { IUser, IUserInput, IUserSafe } from '@src/modules/user/user.model';
import UserRepo from '@src/modules/user/user.repo';

const Errors = {
  USER_NOT_FOUND: 'User not found',
} as const;

function excludePassword(user: IUser): IUserSafe {
  const { password, ...safeUser } = user;
  return safeUser;
}

async function login(email: string, password: string) {
  const user = await UserRepo.getByEmail(email);

  if (!user) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, Errors.USER_NOT_FOUND);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new RouteError(HttpStatusCodes.UNAUTHORIZED, 'Invalid credentials');
  }

  const token = Jwt.generateToken({ id: user.id });
  return { user: excludePassword(user), token };
}

async function register(
  userInput: IUserInput,
): Promise<{ user: IUserSafe; token: string }> {
  const newUser = await UserRepo.add(userInput);
  const token = Jwt.generateToken({ id: newUser.id });
  return { user: excludePassword(newUser), token };
}

async function getUserById(id: number): Promise<IUserSafe> {
  const user = await UserRepo.getById(id);
  if (!user) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, Errors.USER_NOT_FOUND);
  }
  return excludePassword(user);
}

async function getUserPermission(id: number): Promise<string[]> {
  const permissions = await UserRepo.getUserPermissions(id);
  return permissions;
}
async function getUserRoles(id: number): Promise<string[]> {
  const roles = await UserRepo.getUserRoles(id);
  return roles;
}
export default {
  login,
  register,
  getUserById,
  getUserPermission,
  getUserRoles,
} as const;
