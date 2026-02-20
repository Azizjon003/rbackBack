import { Router } from 'express';

import { Action, Resource } from '@src/common/constants/rbac';
import authMiddleware from '@src/middleware/authMiddleware';
import checkPermission from '@src/middleware/checkPermission';

import UserController from './user.controller';

const userRouter = Router();

userRouter.use(authMiddleware);
userRouter.get('/all', checkPermission(Action.READ, Resource.USERS), UserController.getAll);
userRouter.post('/add', checkPermission(Action.WRITE, Resource.USERS), UserController.add);
userRouter.put('/update', checkPermission(Action.WRITE, Resource.USERS), UserController.update);
userRouter.delete('/delete/:id', checkPermission(Action.DELETE, Resource.USERS), UserController.delete);

export default userRouter;
