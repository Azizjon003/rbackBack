import { Router } from 'express';

import Paths from '@src/common/constants/Paths';
import { Action, Resource } from '@src/common/constants/rbac';
import authMiddleware from '@src/middleware/authMiddleware';
import checkPermission from '@src/middleware/checkPermission';

import AuthRoutes from './AuthRoutes';
import UserRoutes from './UserRoutes';

const apiRouter = Router();

const authRouter = Router();
const userRouter = Router();

// Auth routes (public)
authRouter.post(Paths.Auth.Login, AuthRoutes.login);
authRouter.post(Paths.Auth.Register, AuthRoutes.register);
authRouter.get(Paths.Auth.Me, authMiddleware, AuthRoutes.me);

// User routes (protected)
userRouter.use(authMiddleware);
userRouter.get(Paths.Users.Get, checkPermission(Action.READ, Resource.USERS), UserRoutes.getAll);
userRouter.post(Paths.Users.Add, checkPermission(Action.WRITE, Resource.USERS), UserRoutes.add);
userRouter.put(Paths.Users.Update, checkPermission(Action.WRITE, Resource.USERS), UserRoutes.update);
userRouter.delete(Paths.Users.Delete, checkPermission(Action.DELETE, Resource.USERS), UserRoutes.delete);

apiRouter.use(Paths.Auth._, authRouter);
apiRouter.use(Paths.Users._, userRouter);

export default apiRouter;
