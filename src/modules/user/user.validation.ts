import { z } from 'zod';

import parseReq from '@src/common/utils/parseReq';

import { UserSchema } from './user.model';

export const addValidator = parseReq(z.object({ user: UserSchema }));

export const updateValidator = parseReq(
  z.object({ user: UserSchema.extend({ id: z.number() }) }),
);

export const deleteValidator = parseReq(z.object({ id: z.coerce.number() }));
