import { IReport, IReportInput, IReportUpdate } from './report.model';
import ReportRepo from './report.repo';

function getAll(): Promise<IReport[]> {
  return ReportRepo.getAll();
}

function getById(id: number): Promise<IReport> {
  return ReportRepo.getById(id);
}
export default {
  getAll,
  getById,
} as const;
