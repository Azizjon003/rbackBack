import { z } from 'zod';

import { Entity } from '@src/common/types';

export const ReportSchema = z.object({
  title: z.string().min(1),
  type: z.enum(['sales', 'users', 'revenue', 'payments', 'finance']),
  period: z.string().min(1),
  total_amount: z.number().nullable().optional(),
  total_orders: z.number().int().nullable().optional(),
  total_users: z.number().int().nullable().optional(),
  active_users: z.number().int().nullable().optional(),
  success_rate: z.number().nullable().optional(),
  status: z.enum(['ready', 'processing']),
});

export type IReportInput = z.infer<typeof ReportSchema>;

export interface IReport extends Entity {
  title: string;
  type: string;
  period: string;
  total_amount: number | null;
  total_orders: number | null;
  total_users: number | null;
  active_users: number | null;
  success_rate: number | null;
  status: string;
}

export type IReportUpdate = Partial<IReportInput> & { id: number };
