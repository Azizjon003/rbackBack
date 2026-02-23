import { IPayment, IPaymentInput, IPaymentUpdate } from './payment.model';
import PaymentRepo from './payment.repo';

function getAll(): Promise<IPayment[]> {
  return PaymentRepo.getAll();
}

function getById(id: number): Promise<IPayment> {
  return PaymentRepo.getById(id);
}

function add(data: IPaymentInput): Promise<IPayment> {
  return PaymentRepo.add(data);
}

function update(data: IPaymentUpdate): Promise<IPayment> {
  return PaymentRepo.update(data);
}

function remove(id: number): Promise<void> {
  return PaymentRepo.remove(id);
}

export default {
  getAll,
  getById,
  add,
  update,
  remove,
} as const;
