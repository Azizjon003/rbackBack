import { z } from 'zod';

import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import ApiResponse from '@src/common/utils/response';
import AuthService from '@src/services/AuthService';

import { Req, Res } from './common/express-types';
import parseReq from './common/parseReq';

const reqValidators = {
  login: parseReq(
    z.object({ email: z.string().email(), password: z.string() }),
  ),
  register: parseReq(
    z.object({
      email: z.string().email(),
      password: z.string(),
      repeatedPassword: z.string(),
      name: z.string(),
      surname: z.string(),
    }),
  ),
} as const;

const login = async (req: Req, res: Res) => {
  const { email, password } = reqValidators.login(req.body);
  const result = await AuthService.login(email, password);

  ApiResponse.success(res, result);
};

const register = async (req: Req, res: Res) => {
  const { email, password, repeatedPassword, name, surname } =
    reqValidators.register(req.body);

  if (password !== repeatedPassword) {
    return ApiResponse.error(res, 'Passwords do not match');
  }

  const result = await AuthService.register({
    email,
    password,
    name,
    surname,
  });

  ApiResponse.success(res, result, HttpStatusCodes.CREATED);
};

const me = async (req: Req, res: Res) => {
  if (!req.user) {
    return ApiResponse.error(res, 'Unauthorized', HttpStatusCodes.UNAUTHORIZED);
  }

  const user = await AuthService.getUserById(req.user.id);
  ApiResponse.success(res, { user });
};

export default {
  login,
  register,
  me,
} as const;
