import { NextFunction, Request, Response } from 'express';

import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import Errors from '@src/common/constants/errors';
import Jwt, { JwtPayload } from '@src/common/utils/jwt';

declare module 'express' {
  interface Request {
    user?: JwtPayload;
  }
}

function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    res
      .status(HttpStatusCodes.UNAUTHORIZED)
      .json({ success: false, message: Errors.TOKEN_NOT_PROVIDED });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = Jwt.verifyToken(token);
    req.user = payload;
    next();
  } catch {
    res
      .status(HttpStatusCodes.UNAUTHORIZED)
      .json({ success: false, message: Errors.INVALID_OR_EXPIRED_TOKEN });
  }
}

export default authMiddleware;
