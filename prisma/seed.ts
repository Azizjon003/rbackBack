import bcrypt from 'bcrypt';

import { PrismaClient } from '../generated/prisma/client';

const prisma = new PrismaClient();

const roles = ['ADMIN', 'USER', 'MODERATOR', 'PAYMENT', 'REPORTS'] as const;

const resources = ['USERS', 'ROLES', 'PAYMENTS', 'REPORTS'] as const;
const actions = ['READ', 'WRITE', 'DELETE'] as const;

const rolePermissions: Record<string, { action: string; resource: string }[]> = {
  ADMIN: resources.flatMap((resource) =>
    actions.map((action) => ({ action, resource })),
  ),
  MODERATOR: [
    { action: 'READ', resource: 'USERS' },
    { action: 'WRITE', resource: 'USERS' },
    { action: 'READ', resource: 'ROLES' },
  ],
  USER: [
    { action: 'READ', resource: 'USERS' },
    { action: 'READ', resource: 'PAYMENTS' },
    { action: 'READ', resource: 'REPORTS' },
  ],
  PAYMENT: [
    { action: 'READ', resource: 'PAYMENTS' },
    { action: 'WRITE', resource: 'PAYMENTS' },
    { action: 'DELETE', resource: 'PAYMENTS' },
  ],
  REPORTS: [
    { action: 'READ', resource: 'REPORTS' },
    { action: 'WRITE', resource: 'REPORTS' },
    { action: 'DELETE', resource: 'REPORTS' },
  ],
};

async function main() {
  for (const name of roles) {
    await prisma.role.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log('Roles seeded');

  for (const resource of resources) {
    for (const action of actions) {
      await prisma.permission.upsert({
        where: { action_resource: { action, resource } },
        update: {},
        create: { action, resource },
      });
    }
  }
  console.log('Permissions seeded');

  for (const [roleName, permissions] of Object.entries(rolePermissions)) {
    const role = await prisma.role.findUnique({ where: { name: roleName } });
    if (!role) continue;

    for (const { action, resource } of permissions) {
      const permission = await prisma.permission.findUnique({
        where: { action_resource: { action, resource } },
      });
      if (!permission) continue;

      await prisma.rolePermission.upsert({
        where: {
          role_id_permission_id: {
            role_id: role.id,
            permission_id: permission.id,
          },
        },
        update: {},
        create: { role_id: role.id, permission_id: permission.id },
      });
    }
  }
  console.log('Role-permissions seeded');

  const adminEmail = 'admin@admin.com';
  const existingAdmin = await prisma.user.findFirst({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminRole = await prisma.role.findUnique({
      where: { name: 'ADMIN' },
    });

    const admin = await prisma.user.create({
      data: {
        name: 'Admin',
        surname: 'Admin',
        email: adminEmail,
        password: hashedPassword,
        roles: adminRole
          ? { create: { role_id: adminRole.id } }
          : undefined,
      },
    });
    console.log('Default admin user created:', admin.email);
  } else {
    console.log('Admin user already exists');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
