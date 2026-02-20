import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import { RouteError } from '@src/common/utils/route-errors';

import { IUser, IUserInput } from './user.model';
import UserRepo from './user.repo';

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
async function addUserRole(userId: number, roleIds: number[]) {
  const persists = await UserRepo.persists(userId);
  if (!persists) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, Errors.USER_NOT_FOUND);
  }
  return UserRepo.addUserRoles(userId, roleIds);
}

async function deleteUserRole(userId: number, roleIds: number[]) {
  const persists = await UserRepo.persists(userId);
  if (!persists) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, Errors.USER_NOT_FOUND);
  }
  return UserRepo.deleteUserRoles(userId, roleIds);
}

async function addUserPermissions(userId: number, permissionIds: number[]) {
  const persists = await UserRepo.persists(userId);
  if (!persists) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, Errors.USER_NOT_FOUND);
  }
  return UserRepo.addUserPermissions(userId, permissionIds);
}

async function deleteUserPermissions(userId: number, permissionIds: number[]) {
  const persists = await UserRepo.persists(userId);
  if (!persists) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, Errors.USER_NOT_FOUND);
  }
  return UserRepo.deleteUserPermissions(userId, permissionIds);
}

export default {
  getAll,
  addOne,
  updateOne,
  delete: deleteOne,
  addUserRoles: addUserRole,
  deleteUserRoles: deleteUserRole,
  addUserPermissions,
  deleteUserPermissions,
} as const;
