import { z } from 'zod';

import parseReq from '@src/common/utils/parseReq';

import { UserSchema } from './user.model';

export const addValidator = parseReq(z.object({ user: UserSchema }));

export const updateValidator = parseReq(
  z.object({
    user: UserSchema.extend({ id: z.number() }).omit({ password: true }),
  }),
);

export const deleteValidator = parseReq(z.object({ id: z.coerce.number() }));

export const addUserRoleValidator = parseReq(
  z.object({
    userId: z.coerce.number(),
    roleIds: z.array(z.coerce.number()),
  }),
);

export const addOrDeleteUserRoleValidator = parseReq(
  z.object({
    userId: z.coerce.number(),
    permissionIds: z.array(z.coerce.number()),
  }),
);
