import { Router } from 'express';

import authRouter from '@src/modules/auth/auth.routes';
import paymentRouter from '@src/modules/payments/payment.routes';
import reportRouter from '@src/modules/reports/report.routes';
import userRouter from '@src/modules/user/user.routes';

const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/users', userRouter);
apiRouter.use('/payments', paymentRouter);
apiRouter.use('/reports', reportRouter);

export default apiRouter;
