import api from './axiosInstance';
import { OrderSchema, Order } from '../types/schema';
import { z } from 'zod';

/**
 * Order/Payment API Module
 * Built with Zod for robust data integrity.
 */

export const createPaymentOrder = async (orderForm: Partial<Order>): Promise<Order> => {
  const data = await api.post('/order', orderForm);
  return OrderSchema.parse(data);
};

export const updatePaymentStatus = async (orderId: string, paymentStatus: string): Promise<{ message: string }> => {
  return await api.post('/order/update-status', { orderId, paymentStatus });
};

export const getPaymentById = async (orderId: string): Promise<Order> => {
  const data = await api.get(`/order/${orderId}`);
  return OrderSchema.parse(data);
};

export const getOrderHistory = async (): Promise<Order[]> => {
  const data = await api.get('/order/history');
  return z.array(OrderSchema).parse(data);
};

export const generateQRCode = async (orderId: string): Promise<string> => {
  const data = await api.post<{ qrCode: string }>(`/order/${orderId}/qr`);
  return (data as any).qrCode;
};
