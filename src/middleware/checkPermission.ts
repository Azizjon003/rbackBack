import { NextFunction, Request, Response } from 'express';

import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import Errors from '@src/common/constants/errors';
import { Action, Resource } from '@src/common/constants/rbac';
import prisma from '@src/common/prisma';

function checkPermission(action: Action, resource: Resource) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res
        .status(HttpStatusCodes.UNAUTHORIZED)
        .json({ success: false, message: Errors.UNAUTHORIZED });
      return;
    }

    const userId = req.user.id;

    const directPermission = await prisma.userPermission.findFirst({
      where: {
        user_id: userId,
        permission: { action, resource },
      },
    });

    if (directPermission) {
      next();
      return;
    }

    const rolePermission = await prisma.rolePermission.findFirst({
      where: {
        permission: { action, resource },
        role: {
          users: { some: { user_id: userId } },
        },
      },
    });

    if (rolePermission) {
      next();
      return;
    }

    res
      .status(HttpStatusCodes.FORBIDDEN)
      .json({ success: false, message: Errors.FORBIDDEN });
  };
}

export default checkPermission;
