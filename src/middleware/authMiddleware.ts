import { NextFunction, Request, Response } from 'express';

import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
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
      .json({ success: false, message: 'Token not provided' });
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
      .json({ success: false, message: 'Invalid or expired token' });
  }
}

export default authMiddleware;
