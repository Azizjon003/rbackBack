import { IPayment, IPaymentInput, IPaymentUpdate } from './payment.model';
import PaymentRepo from './payment.repo';

function getAll(): Promise<IPayment[]> {
  return PaymentRepo.getAll();
}

function getById(id: number): Promise<IPayment> {
  return PaymentRepo.getById(id);
}

export default {
  getAll,
  getById,
} as const;
