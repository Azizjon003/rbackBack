import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import { RouteError } from '@src/common/utils/route-errors';
import { IUser, IUserInput } from '@src/models/User.model';
import UserRepo from '@src/repos/UserRepo';

const Errors = {
  USER_NOT_FOUND: 'User not found',
} as const;

function getAll(): Promise<IUser[]> {
  return UserRepo.getAll();
}

function addOne(user: IUserInput): Promise<IUser> {
  return UserRepo.add(user);
}

async function updateOne(user: IUserInput & { id: number }): Promise<void> {
  const persists = await UserRepo.persists(user.id);
  if (!persists) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, Errors.USER_NOT_FOUND);
  }
  return UserRepo.update(user);
}

async function deleteOne(id: number): Promise<void> {
  const persists = await UserRepo.persists(id);
  if (!persists) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, Errors.USER_NOT_FOUND);
  }
  return UserRepo.delete(id);
}

export default {
  Errors,
  getAll,
  addOne,
  updateOne,
  delete: deleteOne,
} as const;
