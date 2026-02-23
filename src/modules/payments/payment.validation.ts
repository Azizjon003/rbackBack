import { z } from 'zod';

import parseReq from '@src/common/utils/parseReq';

import { PaymentSchema } from './payment.model';

export const addPaymentValidator = parseReq(PaymentSchema);

export const updatePaymentValidator = parseReq(
  PaymentSchema.partial().extend({ id: z.number() }),
);

export const deletePaymentValidator = parseReq(
  z.object({ id: z.coerce.number() }),
);
