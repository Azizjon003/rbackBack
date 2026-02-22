import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import Errors from '@src/common/constants/errors';
import type { Req, Res } from '@src/common/types';
import ApiResponse from '@src/common/utils/response';

import AuthService from './auth.service';
import { loginValidator, registerValidator } from './auth.validation';

const login = async (req: Req, res: Res) => {
  const { email, password } = loginValidator(req.body);
  const result = await AuthService.login(email, password);

  ApiResponse.success(res, result);
};

const register = async (req: Req, res: Res) => {
  const { email, password, repeatedPassword, name, surname } =
    registerValidator(req.body);

  if (password !== repeatedPassword) {
    return ApiResponse.error(res, Errors.PASSWORDS_DO_NOT_MATCH);
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
    return ApiResponse.error(res, Errors.UNAUTHORIZED, HttpStatusCodes.UNAUTHORIZED);
  }

  const user = await AuthService.getUserById(req.user.id);
  const userPermissions = await AuthService.getUserPermission(req.user.id);
  const userRoles = await AuthService.getUserRoles(req.user.id);

  ApiResponse.success(res, {
    user,
    permissions: userPermissions,
    roles: userRoles,
  });
};

export default {
  login,
  register,
  me,
} as const;
