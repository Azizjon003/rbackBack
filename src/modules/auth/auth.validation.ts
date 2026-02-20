import { z } from 'zod';

import parseReq from '@src/common/utils/parseReq';

export const loginValidator = parseReq(
  z.object({ email: z.string().email(), password: z.string() }),
);

export const registerValidator = parseReq(
  z.object({
    email: z.string().email(),
    password: z.string(),
    repeatedPassword: z.string(),
    name: z.string(),
    surname: z.string(),
  }),
);
