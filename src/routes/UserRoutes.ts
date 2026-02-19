import { z } from 'zod';

import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
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
  res.status(HttpStatusCodes.OK).json({ users });
}

async function add(req: Req, res: Res) {
  const { user } = reqValidators.add(req.body);
  await UserService.addOne(user);
  res.status(HttpStatusCodes.CREATED).end();
}

async function update(req: Req, res: Res) {
  const { user } = reqValidators.update(req.body);
  await UserService.updateOne(user);
  res.status(HttpStatusCodes.OK).end();
}

async function delete_(req: Req, res: Res) {
  const { id } = reqValidators.delete(req.params);
  await UserService.delete(id);
  res.status(HttpStatusCodes.OK).end();
}

export default {
  getAll,
  add,
  update,
  delete: delete_,
} as const;
