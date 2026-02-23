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
  await UserService.delete(id, req.user!.id);
  ApiResponse.success(res, null);
}

async function addUserRole(req: Req, res: Res) {
  const { userId, roleIds } = addUserRoleValidator(req.body);
  const user = await UserService.addUserRoles(userId, roleIds, req.user!.id);
  ApiResponse.success(res, user, HttpStatusCodes.CREATED);
}

async function deleteUserRole(req: Req, res: Res) {
  const { userId, roleIds } = addUserRoleValidator(req.body);
  const user = await UserService.deleteUserRoles(userId, roleIds, req.user!.id);
  ApiResponse.success(res, user);
}

async function addPermission(req: Req, res: Res) {
  const { userId, permissionIds } = addOrDeleteUserRoleValidator(req.body);
  const user = await UserService.addUserPermissions(userId, permissionIds, req.user!.id);
  ApiResponse.success(res, user, HttpStatusCodes.CREATED);
}

async function deletePermission(req: Req, res: Res) {
  const { userId, permissionIds } = addOrDeleteUserRoleValidator(req.body);
  const user = await UserService.deleteUserPermissions(userId, permissionIds, req.user!.id);
  ApiResponse.success(res, user);
}

async function getRoles(req: Req, res: Res) {
  const roles = await UserService.getRoles();
  ApiResponse.success(res, { roles });
}
async function getPermissions(req: Req, res: Res) {
  const permissions = await UserService.getPermissions();
  ApiResponse.success(res, { permissions });
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
  getRoles,
  getPermissions,
} as const;
