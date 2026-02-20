import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import ApiResponse from '@src/common/utils/response';

import AuthService from './auth.service';
import { loginValidator, registerValidator } from './auth.validation';

import type { Req, Res } from '@src/common/types';

const login = async (req: Req, res: Res) => {
  const { email, password } = loginValidator(req.body);
  const result = await AuthService.login(email, password);

  ApiResponse.success(res, result);
};

const register = async (req: Req, res: Res) => {
  const { email, password, repeatedPassword, name, surname } =
    registerValidator(req.body);

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
