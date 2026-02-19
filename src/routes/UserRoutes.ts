import { z } from 'zod';

import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import ApiResponse from '@src/common/utils/response';
import { UserSchema } from '@src/models/User.model';
import UserService from '@src/services/UserService';

import { Req, Res } from './common/express-types';
import parseReq from './common/parseReq';

/******************************************************************************
                                Constants
******************************************************************************/

const reqValidators = {
  add: parseReq(z.object({ user: UserSchema })),
  update: parseReq(z.object({ user: UserSchema.extend({ id: z.number() }) })),
  delete: parseReq(z.object({ id: z.coerce.number() })),
} as const;

/******************************************************************************
                                Functions
******************************************************************************/

async function getAll(_: Req, res: Res) {
  const users = await UserService.getAll();
  ApiResponse.success(res, { users });
}

async function add(req: Req, res: Res) {
  const { user } = reqValidators.add(req.body);
  await UserService.addOne(user);
  ApiResponse.success(res, null, HttpStatusCodes.CREATED);
}

async function update(req: Req, res: Res) {
  const { user } = reqValidators.update(req.body);
  await UserService.updateOne(user);
  ApiResponse.success(res, null);
}

async function delete_(req: Req, res: Res) {
  const { id } = reqValidators.delete(req.params);
  await UserService.delete(id);
  ApiResponse.success(res, null);
}

export default {
  getAll,
  add,
  update,
  delete: delete_,
} as const;
