import { Response } from 'express';

import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import { ErrorMessage } from '@src/common/constants/errors';

function success<T>(res: Response, data: T, status: number = HttpStatusCodes.OK) {
  return res.status(status).json({ success: true, data });
}

function error(res: Response, message: ErrorMessage, status: number = HttpStatusCodes.BAD_REQUEST) {
  return res.status(status).json({ success: false, message });
}

export default { success, error } as const;
