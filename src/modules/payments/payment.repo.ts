import Errors from '@src/common/constants/errors';
import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
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

export default {
  getAll,
  getById,
} as const;
