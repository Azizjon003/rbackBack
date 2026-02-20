import { PrismaClient } from '../generated/prisma/client';

const prisma = new PrismaClient();

const roles = ['ADMIN', 'USER', 'MODERATOR'] as const;

const resources = ['USERS', 'ROLES'] as const;
const actions = ['READ', 'WRITE', 'DELETE'] as const;

// Har bir rolga qaysi permissionlar beriladi
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
  ],
};

async function main() {
  // 1. Rollarni yaratish
  for (const name of roles) {
    await prisma.role.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log('Roles seeded');

  // 2. Permissionlarni yaratish
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

  // 3. Rol-permission bog'lanishlarini yaratish
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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
