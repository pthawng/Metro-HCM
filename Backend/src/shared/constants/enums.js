/**
 * Centralized Enums for MetroHCM
 * 
 * Shared constants between validation, models, and controllers.
 */

export const TicketCategory = {
  LUOT: 'luot',
  NGAY: 'ngay',
  TUAN: 'tuan',
  THANG: 'thang',
  KHU_HOI: 'khu hoi',
  NHOM: 'nhom',
};

export const TicketSubType = {
  THUONG: 'thuong',
  SINH_VIEN: 'sinhvien',
  NGUOI_CAO_TUOI: 'nguoi_cao_tuoi',
};

export const TicketStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
};

export const PaymentMethod = {
  VNPAY: 'vnpay',
  CARD: 'card',
  QR: 'qr',
  METRO: 'metro',
};

export const PaymentStatus = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
};

export const StationStatus = {
  OPERATIONAL: 'operational',
  CONSTRUCTION: 'construction',
  PLANNED: 'planned',
  CLOSED: 'closed',
};

export const LineStatus = {
  OPERATIONAL: 'operational',
  CONSTRUCTION: 'construction',
  PLANNED: 'planned',
  CLOSED: 'closed',
};
