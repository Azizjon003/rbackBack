import bcrypt from 'bcrypt';

import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import Errors from '@src/common/constants/errors';
import { Role } from '@src/common/constants/rbac';
import prisma from '@src/common/prisma';
import { RouteError } from '@src/common/utils/route-errors';

import { IUser, IUserInput, IUserUpdate } from './user.model';

async function getOne(email: string): Promise<IUser | null> {
  return prisma.user.findFirst({ where: { email } });
}

async function persists(id: number): Promise<boolean> {
  const count = await prisma.user.count({ where: { id } });
  return count > 0;
}

async function getAll(): Promise<any[]> {
  const users = await prisma.user.findMany({
    include: {
      roles: {
        include: {
          role: {
            include: {
              permissions: {
                include: { permission: true },
              },
            },
          },
        },
      },
      permissions: {
        include: {
          permission: {
            include: {
              roles: {
                include: {
                  role: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return users.map((user) => ({
    ...user,
    roles: user.roles.map((ur) => ur.role.name),
    password: undefined,
    permissions: [
      ...user.permissions.map(
        (up) => `${up.permission.action}:${up.permission.resource}`,
      ),
      ...user.roles.flatMap((ur) =>
        ur.role.permissions.map(
          (rp) => `${rp.permission.action}:${rp.permission.resource}`,
        ),
      ),
    ],
  }));
}

async function getByEmail(email: string): Promise<IUser | null> {
  return prisma.user.findFirst({ where: { email } });
}

async function add(user: IUserInput): Promise<IUser> {
  const isUser = await prisma.user.findFirst({ where: { email: user.email } });
  if (isUser) {
    throw new RouteError(HttpStatusCodes.BAD_REQUEST, Errors.USER_ALREADY_EXISTS);
  }

  const saltRounds = 10;
  const hash = await bcrypt.hash(user.password, saltRounds);
  const newUser = await prisma.user.create({
    data: {
      name: user.name,
      surname: user.surname,
      email: user.email,
      password: hash,
      roles: {
        create: {
          role: {
            connect: { name: Role.USER },
          },
        },
      },
    },
  });

  return newUser;
}

async function update(user: IUserUpdate): Promise<void> {
  const existingUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (!existingUser) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, Errors.USER_NOT_FOUND);
  }

  const existEmailUser = await prisma.user.findFirst({
    where: {
      email: user.email,
      id: { not: user.id },
    },
  });
  if (existEmailUser) {
    throw new RouteError(HttpStatusCodes.BAD_REQUEST, Errors.EMAIL_ALREADY_TAKEN);
  }
  await prisma.user.update({
    where: { id: user.id },
    data: {
      name: user.name,
      email: user.email,
    },
  });
}

async function delete_(id: number): Promise<void> {
  await prisma.user.delete({ where: { id } });
}

async function deleteAllUsers(): Promise<void> {
  await prisma.user.deleteMany();
}

async function getById(id: number): Promise<IUser | null> {
  return prisma.user.findUnique({ where: { id } });
}
async function getUserPermissions(id: number): Promise<string[]> {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      roles: {
        include: {
          role: {
            include: {
              permissions: {
                include: { permission: true },
              },
            },
          },
        },
      },
      permissions: {
        include: { permission: true },
      },
    },
  });

  if (!user) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, Errors.USER_NOT_FOUND);
  }

  const rolePermissions = user.roles.flatMap((ur) =>
    ur.role.permissions.map(
      (rp) => `${rp.permission.action}:${rp.permission.resource}`,
    ),
  );

  const directPermissions = user.permissions.map(
    (up) => `${up.permission.action}:${up.permission.resource}`,
  );

  return [...new Set([...rolePermissions, ...directPermissions])];
}

async function addUserRoles(userId: number, roleIds: number[]) {
  const [user, validRoles] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      include: { roles: true },
    }),
    prisma.role.findMany({
      where: { id: { in: roleIds } },
    }),
  ]);

  if (!user) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, Errors.USER_NOT_FOUND);
  }

  const validRoleIds = validRoles.map((r) => r.id);
  const invalidRoleIds = roleIds.filter((id) => !validRoleIds.includes(id));
  if (invalidRoleIds.length > 0) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, Errors.ROLES_NOT_FOUND(invalidRoleIds));
  }

  const hasAdminRole = validRoles.some((r) => r.name === Role.ADMIN);
  if (hasAdminRole) {
    throw new RouteError(HttpStatusCodes.FORBIDDEN, Errors.ADMIN_ROLE_RESTRICTED);
  }

  const existingRoleIds = user.roles.map((ur) => ur.role_id);
  const newRoleIds = validRoleIds.filter((id) => !existingRoleIds.includes(id));

  if (newRoleIds.length > 0) {
    await prisma.userRole.createMany({
      data: newRoleIds.map((roleId) => ({
        user_id: userId,
        role_id: roleId,
      })),
    });
  }

  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      roles: { include: { role: true } },
    },
  });
}

async function deleteUserRoles(userId: number, roleIds: number[]) {
  const [user, validRoles] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      include: { roles: true },
    }),
    prisma.role.findMany({
      where: { id: { in: roleIds } },
    }),
  ]);

  if (!user) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, Errors.USER_NOT_FOUND);
  }

  const validRoleIds = validRoles.map((r) => r.id);
  const invalidRoleIds = roleIds.filter((id) => !validRoleIds.includes(id));
  if (invalidRoleIds.length > 0) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, Errors.ROLES_NOT_FOUND(invalidRoleIds));
  }

  const hasAdminRole = validRoles.some((r) => r.name === Role.ADMIN);
  if (hasAdminRole) {
    throw new RouteError(HttpStatusCodes.FORBIDDEN, Errors.ADMIN_ROLE_PROTECTED);
  }

  const deleteRoleIds = user.roles
    .filter((ur) => validRoleIds.includes(ur.role_id))
    .map((ur) => ur.role_id);
  await prisma.userRole.deleteMany({
    where: {
      user_id: userId,
      role_id: { in: deleteRoleIds },
    },
  });

  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      roles: { include: { role: true } },
    },
  });
}

async function addUserPermissions(userId: number, permissionIds: number[]) {
  const [user, validPermissions] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      include: { permissions: true },
    }),
    prisma.permission.findMany({
      where: { id: { in: permissionIds } },
    }),
  ]);

  if (!user) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, Errors.USER_NOT_FOUND);
  }

  const validPermissionIds = validPermissions.map((p) => p.id);
  const invalidPermissionIds = permissionIds.filter(
    (id) => !validPermissionIds.includes(id),
  );
  if (invalidPermissionIds.length > 0) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, Errors.PERMISSIONS_NOT_FOUND(invalidPermissionIds));
  }

  const hasNonReadPermission = validPermissions.some((p) => p.action !== 'READ');
  if (hasNonReadPermission) {
    throw new RouteError(HttpStatusCodes.FORBIDDEN, Errors.ONLY_READ_PERMISSIONS_ALLOWED);
  }

  const existingPermissionIds = user.permissions.map((up) => up.permission_id);
  const newPermissionIds = validPermissionIds.filter(
    (id) => !existingPermissionIds.includes(id),
  );

  if (newPermissionIds.length > 0) {
    await prisma.userPermission.createMany({
      data: newPermissionIds.map((permissionId) => ({
        user_id: userId,
        permission_id: permissionId,
      })),
    });
  }

  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      permissions: { include: { permission: true } },
    },
  });
}

async function deleteUserPermissions(userId: number, permissionIds: number[]) {
  const [user, validPermissions] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      include: { permissions: true },
    }),
    prisma.permission.findMany({
      where: { id: { in: permissionIds } },
    }),
  ]);

  if (!user) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, Errors.USER_NOT_FOUND);
  }

  const validPermissionIds = validPermissions.map((p) => p.id);
  const invalidPermissionIds = permissionIds.filter(
    (id) => !validPermissionIds.includes(id),
  );
  if (invalidPermissionIds.length > 0) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, Errors.PERMISSIONS_NOT_FOUND(invalidPermissionIds));
  }

  const deletePermissionIds = user.permissions
    .filter((up) => validPermissionIds.includes(up.permission_id))
    .map((up) => up.permission_id);
  await prisma.userPermission.deleteMany({
    where: {
      user_id: userId,
      permission_id: { in: deletePermissionIds },
    },
  });

  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      permissions: { include: { permission: true } },
    },
  });
}
async function getUserRoles(userId: number) {
  const userRoles = await prisma.userRole.findMany({
    where: { user_id: userId },
    include: { role: true },
  });
  return userRoles.map((ur) => ur.role.name);
}
async function getRoles() {
  const roles = await prisma.role.findMany();
  return roles;
}
async function getPermissions() {
  const permissions = await prisma.permission.findMany();
  return permissions;
}
export default {
  getOne,
  persists,
  getAll,
  add,
  update,
  delete: delete_,
  deleteAllUsers,
  deleteUserRoles,
  getByEmail,
  getById,
  getUserPermissions,
  addUserRoles,
  addUserPermissions,
  deleteUserPermissions,
  getUserRoles,
  getRoles,
  getPermissions,
} as const;
