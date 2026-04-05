import { z } from 'zod';

/**
 * Staff-level Payment Validation (Zod)
 * Ensures structural and domain integrity before hitting the service layer.
 */

export const createOrderSchema = z.object({
  ticketType: z.enum(['ngay', 'tuan', 'thang', 'luot', 'khu hoi', 'nhom']),
  totalPrice: z.number().positive(),
  paymentMethod: z.enum(['vnpay', 'momo', 'zalopay', 'ebank']),
  userName: z.string().min(2),
  userPhone: z.string().regex(/^[0-9+]{10,12}$/),
  groupSize: z.number().optional(),
  routes: z.array(z.string()).optional(),
  idempotencyKey: z.string().uuid().or(z.string().min(16)), // Required for reliability
});

export const updateStatusSchema = z.object({
  orderId: z.string().min(1),
  paymentStatus: z.enum(['pending', 'paid', 'failed', 'refunded']),
});
