import * as paymentRepo from './payment.repo.js';
import AppError from '../../core/error/AppError.js';
import QRCode from 'qrcode';

/**
 * Helper: Tính ngày hết hạn dựa trên loại vé
 */
export const getExpiryDate = (ticketType) => {
  const now = new Date();
  switch (ticketType) {
    case 'ngay':
      return new Date(now.setDate(now.getDate() + 1));
    case 'tuan':
      return new Date(now.setDate(now.getDate() + 7));
    case 'thang':
      return new Date(now.setMonth(now.getMonth() + 1));
    default:
      return now;
  }
};

/**
 * Payment Service — Business Logic for Payment module.
 */

export const createPayment = async (userId, data) => {
  const { ticketType, groupSize, ...rest } = data;
  
  const payload = {
    ...rest,
    userId,
    ticketType,
    createdAt: new Date(),
  };

  if (['ngay', 'tuan', 'thang'].includes(ticketType)) {
    payload.expiryDate = getExpiryDate(ticketType);
  } else if (ticketType === 'luot') {
    payload.usageCount = 1;
  } else if (ticketType === 'khu hoi') {
    payload.usageCount = 2;
  } else if (ticketType === 'nhom') {
    payload.groupSize = groupSize;
    payload.usageCount = 1;
  }

  return paymentRepo.createOrder(payload);
};

export const updatePaymentStatus = async (orderId, paymentStatus) => {
  const order = await paymentRepo.findByOrderId(orderId);
  if (!order) throw new AppError('Đơn hàng không tồn tại!', 404);

  if (order.paymentStatus === paymentStatus) {
    throw new AppError('Trạng thái thanh toán đã được cập nhật trước đó!', 400);
  }

  order.paymentStatus = paymentStatus;
  return paymentRepo.saveOrder(order);
};

export const getPaymentByOrderId = async (orderId) => {
  const order = await paymentRepo.findByOrderId(orderId);
  if (!order) throw new AppError('Đơn hàng không tồn tại!', 404);
  return order;
};

export const generateQRCode = async (orderId) => {
  const order = await paymentRepo.findByOrderId(orderId);
  if (!order) throw new AppError('Không tìm thấy đơn hàng!', 404);

  const qrData = {
    orderId: order.orderId,
    ticketType: order.ticketType,
    userName: order.userName,
    expiryDate: order.expiryDate,
  };

  const qrCode = await QRCode.toDataURL(JSON.stringify(qrData));
  order.qrCode = qrCode;
  await paymentRepo.saveOrder(order);

  return qrCode;
};

export const getTicketHistory = async (userId) => {
  const tickets = await paymentRepo.findUserPaidOrders(userId);

  return tickets.map(ticket => ({
    id: ticket._id.toString(),
    orderId: ticket.orderId,
    purchaseDate: ticket.createdAt,
    ticketType: ticket.ticketType,
    price: ticket.totalPrice,
    status: new Date() > new Date(ticket.expiryDate) ? 'expired' : 'active',
    validFrom: ticket.createdAt,
    validTo: ticket.expiryDate || ticket.createdAt,
    qrCode: ticket.qrCode,
    routes: ticket.routes,
    usageCount: ticket.usageCount,
    groupSize: ticket.groupSize
  }));
};
