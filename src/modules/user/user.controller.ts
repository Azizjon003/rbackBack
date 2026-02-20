import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import type { Req, Res } from '@src/common/types';
import ApiResponse from '@src/common/utils/response';

import UserService from './user.service';
import {
  addOrDeleteUserRoleValidator,
  addUserRoleValidator,
  addValidator,
  deleteValidator,
  updateValidator,
} from './user.validation';

async function getAll(_: Req, res: Res) {
  const users = await UserService.getAll();
  ApiResponse.success(res, { users });
}

async function add(req: Req, res: Res) {
  const { user } = addValidator(req.body);
  await UserService.addOne(user);
  ApiResponse.success(res, null, HttpStatusCodes.CREATED);
}

async function update(req: Req, res: Res) {
  const { user } = updateValidator(req.body);
  await UserService.updateOne(user);
  ApiResponse.success(res, null);
}

async function delete_(req: Req, res: Res) {
  const { id } = deleteValidator(req.params);
  await UserService.delete(id);
  ApiResponse.success(res, null);
}

async function addUserRole(req: Req, res: Res) {
  const { userId, roleIds } = addUserRoleValidator(req.body);
  const user = await UserService.addUserRoles(userId, roleIds);
  ApiResponse.success(res, user, HttpStatusCodes.CREATED);
}

async function deleteUserRole(req: Req, res: Res) {
  const { userId, roleIds } = addUserRoleValidator(req.body);
  const user = await UserService.deleteUserRoles(userId, roleIds);
  ApiResponse.success(res, user);
}

async function addPermission(req: Req, res: Res) {
  const { userId, permissionIds } = addOrDeleteUserRoleValidator(req.body);
  const user = await UserService.addUserPermissions(userId, permissionIds);
  ApiResponse.success(res, user, HttpStatusCodes.CREATED);
}

async function deletePermission(req: Req, res: Res) {
  const { userId, permissionIds } = addOrDeleteUserRoleValidator(req.body);
  const user = await UserService.deleteUserPermissions(userId, permissionIds);
  ApiResponse.success(res, user);
}

export default {
  getAll,
  add,
  update,
  delete: delete_,
  addUserRole,
  deleteUserRole,
  addPermission,
  deletePermission,
} as const;
