import type { Req, Res } from '@src/common/types';
import ApiResponse from '@src/common/utils/response';

const mockReports = [
  {
    id: 1,
    title: 'Oylik sotuvlar hisoboti',
    type: 'sales',
    period: '2026-01',
    totalAmount: 1250000,
    totalOrders: 48,
    status: 'ready',
    createdAt: '2026-02-01T08:00:00Z',
  },
  {
    id: 2,
    title: 'Foydalanuvchilar statistikasi',
    type: 'users',
    period: '2026-01',
    totalUsers: 120,
    activeUsers: 87,
    status: 'ready',
    createdAt: '2026-02-01T08:30:00Z',
  },
  {
    id: 3,
    title: 'Haftalik daromad hisoboti',
    type: 'revenue',
    period: '2026-02-W2',
    totalAmount: 430000,
    totalOrders: 15,
    status: 'ready',
    createdAt: '2026-02-10T09:00:00Z',
  },
  {
    id: 4,
    title: 'To\'lovlar tahlili',
    type: 'payments',
    period: '2026-02',
    totalAmount: 812500,
    successRate: 94.5,
    status: 'processing',
    createdAt: '2026-02-15T10:00:00Z',
  },
  {
    id: 5,
    title: 'Yillik moliyaviy hisobot',
    type: 'finance',
    period: '2025',
    totalAmount: 15800000,
    totalOrders: 562,
    status: 'ready',
    createdAt: '2026-01-05T12:00:00Z',
  },
];

async function getAll(_: Req, res: Res) {
  ApiResponse.success(res, { reports: mockReports });
}

export default {
  getAll,
} as const;
