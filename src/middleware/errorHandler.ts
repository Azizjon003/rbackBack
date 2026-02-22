import { NextFunction, Request, Response } from 'express';

import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import EnvVars, { NodeEnvs } from '@src/common/constants/env';
import { RouteError } from '@src/common/utils/route-errors';

function errorHandler(err: Error, _: Request, res: Response, next: NextFunction) {
  if (EnvVars.NodeEnv !== NodeEnvs.TEST.valueOf()) {
    console.error(err);
  }
  let status: HttpStatusCodes = HttpStatusCodes.BAD_REQUEST;
  if (err instanceof RouteError) {
    status = err.status;
    res.status(status).json({ success: false, message: err.errorMessage });
    return next(err);
  }
  res.status(status).json({
    success: false,
    message: { uz: err.message, eng: err.message },
  });
  return next(err);
}

export default errorHandler;
