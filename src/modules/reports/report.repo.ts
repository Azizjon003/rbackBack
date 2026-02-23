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
export default {
  getAll,
  getById,
} as const;
