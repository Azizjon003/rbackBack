import { z } from 'zod';

import { Entity } from './common/types';

export const UserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(7),
});

export type IUserInput = z.infer<typeof UserSchema>;

export interface IUser extends Entity {
  name: string;
  email: string;
  password: string;
}
