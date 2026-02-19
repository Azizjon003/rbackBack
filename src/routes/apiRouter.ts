import { Router } from 'express';

import Paths from '@src/common/constants/Paths';
import authMiddleware from '@src/middleware/authMiddleware';

import AuthRoutes from './AuthRoutes';
import UserRoutes from './UserRoutes';

const apiRouter = Router();

const userRouter = Router();
const authRouter = Router();

authRouter.post(Paths.Auth.Login, AuthRoutes.login);
authRouter.post(Paths.Auth.Register, AuthRoutes.register);

userRouter.use(authMiddleware);
authRouter.get(Paths.Auth.Me, authMiddleware, AuthRoutes.me);
userRouter.get(Paths.Users.Get, UserRoutes.getAll);
userRouter.post(Paths.Users.Add, UserRoutes.add);
userRouter.put(Paths.Users.Update, UserRoutes.update);
userRouter.delete(Paths.Users.Delete, UserRoutes.delete);

apiRouter.use(Paths.Auth._, authRouter);
apiRouter.use(Paths.Users._, userRouter);

export default apiRouter;
