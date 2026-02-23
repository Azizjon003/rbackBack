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

async function add(req: Req, res: Res) {
  const data = addPaymentValidator(req.body);
  const payment = await PaymentService.add(data);
  ApiResponse.success(res, { payment }, HttpStatusCodes.CREATED);
}

async function update(req: Req, res: Res) {
  const data = updatePaymentValidator(req.body);
  const payment = await PaymentService.update(data);
  ApiResponse.success(res, { payment });
}

async function remove(req: Req, res: Res) {
  const { id } = deletePaymentValidator(req.params);
  await PaymentService.remove(id);
  ApiResponse.success(res, null);
}

export default {
  getAll,
  add,
  update,
  remove,
} as const;
