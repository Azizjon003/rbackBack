import { NextFunction, Request, Response } from 'express';

import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import { Role } from '@src/common/constants/rbac';
import prisma from '@src/common/prisma';

function checkRole(...roles: Role[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res
        .status(HttpStatusCodes.UNAUTHORIZED)
        .json({ success: false, message: 'Unauthorized' });
      return;
    }

    const userRoles = await prisma.userRole.findMany({
      where: { user_id: req.user.id },
      include: { role: true },
    });

    const userRoleNames = userRoles.map((ur) => ur.role.name);
    const hasRole = roles.some((role) => userRoleNames.includes(role));

    if (!hasRole) {
      res
        .status(HttpStatusCodes.FORBIDDEN)
        .json({ success: false, message: 'Forbidden: insufficient role' });
      return;
    }

    next();
  };
}

export default checkRole;
