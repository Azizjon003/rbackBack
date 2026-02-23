import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import Errors from '@src/common/constants/errors';
import prisma from '@src/common/prisma';
import { RouteError } from '@src/common/utils/route-errors';

import { IReport, IReportInput, IReportUpdate } from './report.model';

async function getAll(): Promise<IReport[]> {
  return prisma.report.findMany({ orderBy: { created_at: 'desc' } });
}

async function getById(id: number): Promise<IReport> {
  const report = await prisma.report.findUnique({ where: { id } });
  if (!report) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, Errors.REPORT_NOT_FOUND);
  }
  return report;
}

async function add(data: IReportInput): Promise<IReport> {
  return prisma.report.create({ data });
}

async function update(data: IReportUpdate): Promise<IReport> {
  const { id, ...updateData } = data;
  const existing = await prisma.report.findUnique({ where: { id } });
  if (!existing) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, Errors.REPORT_NOT_FOUND);
  }
  return prisma.report.update({ where: { id }, data: updateData });
}

async function remove(id: number): Promise<void> {
  const existing = await prisma.report.findUnique({ where: { id } });
  if (!existing) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, Errors.REPORT_NOT_FOUND);
  }
  await prisma.report.delete({ where: { id } });
}

export default {
  getAll,
  getById,
  add,
  update,
  remove,
} as const;
