import type { Req, Res } from '@src/common/types';
import ApiResponse from '@src/common/utils/response';

const mockPayments = [
  {
    id: 1,
    orderId: 'ORD-001',
    amount: 150000,
    currency: 'UZS',
    status: 'completed',
    method: 'card',
    customerName: 'Alisher Karimov',
    createdAt: '2026-01-15T10:30:00Z',
  },
  {
    id: 2,
    orderId: 'ORD-002',
    amount: 85000,
    currency: 'UZS',
    status: 'pending',
    method: 'cash',
    customerName: 'Nodira Sultonova',
    createdAt: '2026-01-16T14:20:00Z',
  },
  {
    id: 3,
    orderId: 'ORD-003',
    amount: 320000,
    currency: 'UZS',
    status: 'completed',
    method: 'transfer',
    customerName: 'Sardor Rahimov',
    createdAt: '2026-02-01T09:15:00Z',
  },
  {
    id: 4,
    orderId: 'ORD-004',
    amount: 47500,
    currency: 'UZS',
    status: 'failed',
    method: 'card',
    customerName: 'Dilnoza Ergasheva',
    createdAt: '2026-02-05T16:45:00Z',
  },
  {
    id: 5,
    orderId: 'ORD-005',
    amount: 210000,
    currency: 'UZS',
    status: 'completed',
    method: 'card',
    customerName: 'Bekzod Tursunov',
    createdAt: '2026-02-10T11:00:00Z',
  },
];

async function getAll(_: Req, res: Res) {
  ApiResponse.success(res, { payments: mockPayments });
}

export default {
  getAll,
} as const;
