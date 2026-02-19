import { Response } from 'express';

import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';

function success<T>(res: Response, data: T, status: number = HttpStatusCodes.OK) {
  return res.status(status).json({ success: true, data });
}

function error(res: Response, message: string, status: number = HttpStatusCodes.BAD_REQUEST) {
  return res.status(status).json({ success: false, message });
}

export default { success, error } as const;
