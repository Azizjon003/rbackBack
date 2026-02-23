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
paymentRouter.post(
  '/add',
  checkPermission(Action.WRITE, Resource.PAYMENTS),
  PaymentController.add,
);
paymentRouter.put(
  '/update',
  checkPermission(Action.WRITE, Resource.PAYMENTS),
  PaymentController.update,
);
paymentRouter.delete(
  '/delete/:id',
  checkPermission(Action.DELETE, Resource.PAYMENTS),
  PaymentController.remove,
);

export default paymentRouter;
