import { NextFunction, Request, Response } from 'express';

import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import { Action, Resource } from '@src/common/constants/rbac';
import prisma from '@src/common/prisma';

function checkPermission(action: Action, resource: Resource) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res
        .status(HttpStatusCodes.UNAUTHORIZED)
        .json({ success: false, message: 'Unauthorized' });
      return;
    }

    const userId = req.user.id;

    // User ga to'g'ridan-to'g'ri berilgan permission
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

    // User ning rollari orqali berilgan permission
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
      .json({ success: false, message: 'Forbidden: insufficient permission' });
  };
}

export default checkPermission;
