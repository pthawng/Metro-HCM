/**
 * Centralized Enums for MetroHCM Frontend
 * 
 * Mirrored from Backend src/shared/constants/enums.js
 */

export enum TicketCategory {
  LUOT = 'luot',
  NGAY = 'ngay',
  TUAN = 'tuan',
  THANG = 'thang',
  KHU_HOI = 'khu hoi',
  NHOM = 'nhom',
}

export enum TicketSubType {
  THUONG = 'thuong',
  SINH_VIEN = 'sinhvien',
  NGUOI_CAO_TUOI = 'nguoi_cao_tuoi',
}

export enum TicketStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum PaymentMethod {
  VNPAY = 'vnpay',
  CARD = 'card',
  QR = 'qr',
  METRO = 'metro',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
}

export enum StationStatus {
  OPERATIONAL = 'operational',
  CONSTRUCTION = 'construction',
  PLANNED = 'planned',
  CLOSED = 'closed',
}

export enum LineStatus {
  OPERATIONAL = 'operational',
  CONSTRUCTION = 'construction',
  PLANNED = 'planned',
  CLOSED = 'closed',
}
