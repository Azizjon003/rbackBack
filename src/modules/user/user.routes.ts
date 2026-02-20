import { Router } from 'express';

import { Action, Resource } from '@src/common/constants/rbac';
import authMiddleware from '@src/middleware/authMiddleware';
import checkPermission from '@src/middleware/checkPermission';

import UserController from './user.controller';

const userRouter = Router();

userRouter.use(authMiddleware);
userRouter.get(
  '/all',
  checkPermission(Action.READ, Resource.USERS),
  UserController.getAll,
);
userRouter.post(
  '/add',
  checkPermission(Action.WRITE, Resource.USERS),
  UserController.add,
);
userRouter.put(
  '/update',
  checkPermission(Action.WRITE, Resource.USERS),
  UserController.update,
);
userRouter.delete(
  '/delete/:id',
  checkPermission(Action.DELETE, Resource.USERS),
  UserController.delete,
);
userRouter.post(
  '/role/add',
  checkPermission(Action.WRITE, Resource.ROLES),
  UserController.addUserRole,
);
userRouter.post(
  '/role/delete',
  checkPermission(Action.WRITE, Resource.ROLES),
  UserController.deleteUserRole,
);
userRouter.post(
  '/permission/add',
  checkPermission(Action.WRITE, Resource.ROLES),
  UserController.addPermission,
);
userRouter.post(
  '/permission/delete',
  checkPermission(Action.WRITE, Resource.ROLES),
  UserController.deletePermission,
);

export default userRouter;
