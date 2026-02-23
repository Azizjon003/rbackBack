import { IReport, IReportInput, IReportUpdate } from './report.model';
import ReportRepo from './report.repo';

function getAll(): Promise<IReport[]> {
  return ReportRepo.getAll();
}

function getById(id: number): Promise<IReport> {
  return ReportRepo.getById(id);
}

function add(data: IReportInput): Promise<IReport> {
  return ReportRepo.add(data);
}

function update(data: IReportUpdate): Promise<IReport> {
  return ReportRepo.update(data);
}

function remove(id: number): Promise<void> {
  return ReportRepo.remove(id);
}

export default {
  getAll,
  getById,
  add,
  update,
  remove,
} as const;
