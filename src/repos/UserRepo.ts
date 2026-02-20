import bcyrypt from 'bcrypt';

import { Role } from '@src/common/constants/rbac';
import prisma from '@src/common/prisma';
import { IUser, IUserInput } from '@src/models/User.model';

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

async function getByEmail(email: string): Promise<IUser | null> {
  return prisma.user.findFirst({ where: { email } });
}
async function add(user: IUserInput): Promise<IUser> {
  const isUser = await prisma.user.findFirst({ where: { email: user.email } });
  if (isUser) {
    throw new Error('User with this email already exists');
  }

  const passHash = user.password;
  const saltRounds = 10;
  const hash = await bcyrypt.hash(passHash, saltRounds);
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

async function update(user: IUserInput & { id: number }): Promise<void> {
  const existingUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (!existingUser) {
    throw new Error('User not found');
  }

  const existEmailUser = await prisma.user.findFirst({
    where: {
      email: user.email,
      id: { not: user.id },
    },
  });
  if (existEmailUser) {
    throw new Error('Another user with this email already exists');
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
  getByEmail,
  getById,
} as const;
