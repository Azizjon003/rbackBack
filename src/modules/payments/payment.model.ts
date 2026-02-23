import { z } from 'zod';

import { Entity } from '@src/common/types';

export const PaymentSchema = z.object({
  order_id: z.string().min(1),
  amount: z.number().positive(),
  currency: z.string().default('UZS'),
  status: z.enum(['completed', 'pending', 'failed']),
  method: z.enum(['card', 'cash', 'transfer']),
  customer_name: z.string().min(1),
});

export type IPaymentInput = z.infer<typeof PaymentSchema>;

export interface IPayment extends Entity {
  order_id: string;
  amount: number;
  currency: string;
  status: string;
  method: string;
  customer_name: string;
}

export type IPaymentUpdate = Partial<IPaymentInput> & { id: number };
