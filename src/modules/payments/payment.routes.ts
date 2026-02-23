import { Router } from 'express';

import { Action, Resource } from '@src/common/constants/rbac';
import authMiddleware from '@src/middleware/authMiddleware';
import checkPermission from '@src/middleware/checkPermission';

import PaymentController from './payment.controller';

const paymentRouter = Router();

paymentRouter.use(authMiddleware);
paymentRouter.get(
  '/all',
  checkPermission(Action.READ, Resource.PAYMENTS),
  PaymentController.getAll,
);

export default paymentRouter;
