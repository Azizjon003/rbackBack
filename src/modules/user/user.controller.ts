import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import ApiResponse from '@src/common/utils/response';

import UserService from './user.service';
import { addValidator, deleteValidator, updateValidator } from './user.validation';

import type { Req, Res } from '@src/common/types';

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

export default {
  getAll,
  add,
  update,
  delete: delete_,
} as const;
