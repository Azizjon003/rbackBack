import { Router } from 'express';

import authRouter from '@src/modules/auth/auth.routes';
import userRouter from '@src/modules/user/user.routes';

const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/users', userRouter);

export default apiRouter;
