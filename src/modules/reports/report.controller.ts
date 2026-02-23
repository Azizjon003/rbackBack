import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import type { Req, Res } from '@src/common/types';
import ApiResponse from '@src/common/utils/response';

import ReportService from './report.service';
import {
  addReportValidator,
  deleteReportValidator,
  updateReportValidator,
} from './report.validation';

async function getAll(_: Req, res: Res) {
  const reports = await ReportService.getAll();
  ApiResponse.success(res, { reports });
}

export default {
  getAll,
} as const;
