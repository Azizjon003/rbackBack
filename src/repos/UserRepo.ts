import prisma from '@src/common/prisma';
import { IUser } from '@src/models/User.model';

async function getOne(email: string): Promise<IUser | null> {
  return prisma.user.findFirst({ where: { email } });
}

async function persists(id: number): Promise<boolean> {
  const count = await prisma.user.count({ where: { id } });
  return count > 0;
}

async function getAll(): Promise<IUser[]> {
  return prisma.user.findMany();
}

async function add(user: IUser): Promise<void> {
  await prisma.user.create({
    data: {
      name: user.name,
      email: user.email,
    },
  });
}

async function update(user: IUser): Promise<void> {
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

async function insertMultiple(
  users: IUser[] | readonly IUser[],
): Promise<IUser[]> {
  const created: IUser[] = [];
  for (const user of users) {
    const u = await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
      },
    });
    created.push(u);
  }
  return created;
}

/******************************************************************************
                                Export default
******************************************************************************/

export default {
  getOne,
  persists,
  getAll,
  add,
  update,
  delete: delete_,
  deleteAllUsers,
  insertMultiple,
} as const;
