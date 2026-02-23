import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import type { Req, Res } from '@src/common/types';
import ApiResponse from '@src/common/utils/response';

import PaymentService from './payment.service';
import {
  addPaymentValidator,
  deletePaymentValidator,
  updatePaymentValidator,
} from './payment.validation';

async function getAll(_: Req, res: Res) {
  const payments = await PaymentService.getAll();
  ApiResponse.success(res, { payments });
}

export default {
  getAll,
} as const;
