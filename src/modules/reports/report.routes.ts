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
export default reportRouter;
