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

async function add(req: Req, res: Res) {
  const data = addReportValidator(req.body);
  const report = await ReportService.add(data);
  ApiResponse.success(res, { report }, HttpStatusCodes.CREATED);
}

async function update(req: Req, res: Res) {
  const data = updateReportValidator(req.body);
  const report = await ReportService.update(data);
  ApiResponse.success(res, { report });
}

async function remove(req: Req, res: Res) {
  const { id } = deleteReportValidator(req.params);
  await ReportService.remove(id);
  ApiResponse.success(res, null);
}

export default {
  getAll,
  add,
  update,
  remove,
} as const;
