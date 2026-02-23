import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import Errors from '@src/common/constants/errors';
import prisma from '@src/common/prisma';
import { RouteError } from '@src/common/utils/route-errors';

import { IPayment, IPaymentInput, IPaymentUpdate } from './payment.model';

async function getAll(): Promise<IPayment[]> {
  return prisma.payment.findMany({ orderBy: { created_at: 'desc' } });
}

async function getById(id: number): Promise<IPayment> {
  const payment = await prisma.payment.findUnique({ where: { id } });
  if (!payment) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, Errors.PAYMENT_NOT_FOUND);
  }
  return payment;
}

async function add(data: IPaymentInput): Promise<IPayment> {
  const existing = await prisma.payment.findUnique({ where: { order_id: data.order_id } });
  if (existing) {
    throw new RouteError(HttpStatusCodes.BAD_REQUEST, Errors.PAYMENT_ORDER_EXISTS);
  }
  return prisma.payment.create({ data });
}

async function update(data: IPaymentUpdate): Promise<IPayment> {
  const { id, ...updateData } = data;
  const existing = await prisma.payment.findUnique({ where: { id } });
  if (!existing) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, Errors.PAYMENT_NOT_FOUND);
  }
  return prisma.payment.update({ where: { id }, data: updateData });
}

async function remove(id: number): Promise<void> {
  const existing = await prisma.payment.findUnique({ where: { id } });
  if (!existing) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, Errors.PAYMENT_NOT_FOUND);
  }
  await prisma.payment.delete({ where: { id } });
}

export default {
  getAll,
  getById,
  add,
  update,
  remove,
} as const;
