import { Router } from 'express';

import { Action, Resource } from '@src/common/constants/rbac';
import authMiddleware from '@src/middleware/authMiddleware';
import checkPermission from '@src/middleware/checkPermission';

import ReportController from './report.controller';

const reportRouter = Router();

reportRouter.use(authMiddleware);
reportRouter.get(
  '/all',
  checkPermission(Action.READ, Resource.REPORTS),
  ReportController.getAll,
);
reportRouter.post(
  '/add',
  checkPermission(Action.WRITE, Resource.REPORTS),
  ReportController.add,
);
reportRouter.put(
  '/update',
  checkPermission(Action.WRITE, Resource.REPORTS),
  ReportController.update,
);
reportRouter.delete(
  '/delete/:id',
  checkPermission(Action.DELETE, Resource.REPORTS),
  ReportController.remove,
);

export default reportRouter;
