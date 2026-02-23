import { z } from 'zod';

import parseReq from '@src/common/utils/parseReq';

import { ReportSchema } from './report.model';

export const addReportValidator = parseReq(ReportSchema);

export const updateReportValidator = parseReq(
  ReportSchema.partial().extend({ id: z.number() }),
);

export const deleteReportValidator = parseReq(
  z.object({ id: z.coerce.number() }),
);
