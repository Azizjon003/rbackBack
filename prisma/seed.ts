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

  const paymentsCount = await prisma.payment.count();
  if (paymentsCount === 0) {
    await prisma.payment.createMany({
      data: [
        { order_id: 'ORD-001', amount: 150000, currency: 'UZS', status: 'completed', method: 'card', customer_name: 'Alisher Karimov' },
        { order_id: 'ORD-002', amount: 85000, currency: 'UZS', status: 'pending', method: 'cash', customer_name: 'Nodira Sultonova' },
        { order_id: 'ORD-003', amount: 320000, currency: 'UZS', status: 'completed', method: 'transfer', customer_name: 'Sardor Rahimov' },
        { order_id: 'ORD-004', amount: 47500, currency: 'UZS', status: 'failed', method: 'card', customer_name: 'Dilnoza Ergasheva' },
        { order_id: 'ORD-005', amount: 210000, currency: 'UZS', status: 'completed', method: 'card', customer_name: 'Bekzod Tursunov' },
      ],
    });
    console.log('Payments seeded');
  }

  const reportsCount = await prisma.report.count();
  if (reportsCount === 0) {
    await prisma.report.createMany({
      data: [
        { title: 'Oylik sotuvlar hisoboti', type: 'sales', period: '2026-01', total_amount: 1250000, total_orders: 48, status: 'ready' },
        { title: 'Foydalanuvchilar statistikasi', type: 'users', period: '2026-01', total_users: 120, active_users: 87, status: 'ready' },
        { title: 'Haftalik daromad hisoboti', type: 'revenue', period: '2026-02-W2', total_amount: 430000, total_orders: 15, status: 'ready' },
        { title: "To'lovlar tahlili", type: 'payments', period: '2026-02', total_amount: 812500, success_rate: 94.5, status: 'processing' },
        { title: 'Yillik moliyaviy hisobot', type: 'finance', period: '2025', total_amount: 15800000, total_orders: 562, status: 'ready' },
      ],
    });
    console.log('Reports seeded');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
