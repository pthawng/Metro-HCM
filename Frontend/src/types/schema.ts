import { z } from 'zod';
import { 
  TicketCategory, 
  TicketSubType, 
  TicketStatus, 
  PaymentMethod, 
  PaymentStatus, 
  StationStatus, 
  LineStatus 
} from './enums';

// User Schema
export const UserSchema = z.object({
  id: z.string().optional(),
  _id: z.string().optional(),
  name: z.string(),
  email: z.string().email().nullable().optional(),
  phoneNumber: z.string().optional(),
  role: z.enum(['admin', 'user', 'staff']),
  status: z.enum(['active', 'inactive', 'suspended']),
  signupType: z.enum(['google', 'phone']),
  avatar: z.string().optional(),
});

export type User = z.infer<typeof UserSchema>;

// Ticket Schema
export const TicketSchema = z.object({
  id: z.string().optional(),
  _id: z.string().optional(),
  name: z.string(),
  code: z.string(),
  category: z.nativeEnum(TicketCategory),
  sub_type: z.nativeEnum(TicketSubType),
  price: z.number(),
  description: z.string().optional(),
  availableFrom: z.string().or(z.date()).optional(),
  availableUntil: z.string().or(z.date()).optional(),
  validityPeriod: z.number().nullable().optional(),
  status: z.nativeEnum(TicketStatus),
});

export type Ticket = z.infer<typeof TicketSchema>;

// Station Schema
export const StationSchema = z.object({
  id: z.string().optional(),
  _id: z.string().optional(),
  name: z.string(),
  nameVi: z.string(),
  coordinates: z.array(z.number()).length(2), // [longitude, latitude]
  address: z.string(),
  lines: z.array(z.string()).optional(),
  facilities: z.array(z.string()).default([]),
  dailyPassengers: z.number().default(0),
  isInterchange: z.boolean().default(false),
  isDepot: z.boolean().default(false),
  isUnderground: z.boolean().default(false),
  status: z.nativeEnum(StationStatus),
  hasWifi: z.boolean().default(false),
  hasParking: z.boolean().default(false),
  hasTicketMachine: z.boolean().default(false),
  hasAccessibility: z.boolean().default(false),
  hasBathroom: z.boolean().default(false),
});

export type Station = z.infer<typeof StationSchema>;

// Order Schema
export const OrderSchema = z.object({
  id: z.string().optional(),
  _id: z.string().optional(),
  orderId: z.string(),
  userId: z.string(),
  userName: z.string(),
  userPhone: z.string(),
  ticketType: z.nativeEnum(TicketCategory),
  totalPrice: z.number(),
  paymentMethod: z.nativeEnum(PaymentMethod),
  paymentStatus: z.nativeEnum(PaymentStatus),
  routes: z.array(z.string()).default([]),
  createdAt: z.string().or(z.date()).optional(),
  expiryDate: z.string().or(z.date()).optional(),
  usageCount: z.number().optional(),
  groupSize: z.number().optional(),
  qrCode: z.string().optional(),
});

export type Order = z.infer<typeof OrderSchema>;

// News Schema
export const NewsSchema = z.object({
  id: z.string().optional(),
  _id: z.string().optional(),
  title: z.string(),
  content: z.string(),
  summary: z.string(),
  image: z.string().optional(),
  category: z.enum(['announcement', 'event', 'promotion', 'update', 'other']),
  tags: z.array(z.string()).default([]),
  publishedDate: z.string().or(z.date()).optional(),
  author: z.string(),
  isPublished: z.boolean().default(true),
});

export type News = z.infer<typeof NewsSchema>;

// Feedback Schema
export const FeedbackSchema = z.object({
  id: z.string().optional(),
  _id: z.string().optional(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
  source: z.enum(['app', 'website', 'mobile', 'kiosk', 'customer-service', 'other']),
  userEmail: z.string().email().optional().nullable(),
  userName: z.string().optional().nullable(),
  status: z.enum(['new', 'reviewed', 'resolved', 'archived']).default('new'),
  createdAt: z.string().or(z.date()).optional(),
  updatedAt: z.string().or(z.date()).optional(),
});

export type Feedback = z.infer<typeof FeedbackSchema>;

// Progress Schema
export const ProgressSchema = z.object({
  id: z.string().optional(),
  _id: z.string().optional(),
  title: z.string(),
  description: z.string(),
  lineId: z.string(),
  startDate: z.string().or(z.date()),
  estimatedCompletionDate: z.string().or(z.date()),
  actualCompletionDate: z.string().or(z.date()).optional().nullable(),
  status: z.enum(['not-started', 'in-progress', 'completed', 'delayed']).default('not-started'),
  completionPercentage: z.number().min(0).max(100).default(0),
  location: z.string(),
  images: z.array(z.string()).default([]),
  milestones: z.array(z.object({
    title: z.string(),
    date: z.string().or(z.date()),
    description: z.string().optional(),
    isCompleted: z.boolean().default(false),
  })).default([]),
  updates: z.array(z.object({
    date: z.string().or(z.date()).default(() => new Date().toISOString()),
    description: z.string(),
    percentageChange: z.number().optional(),
  })).default([]),
});

export type Progress = z.infer<typeof ProgressSchema>;

// MetroLine Schema
export const MetroLineSchema = z.object({
  id: z.string().optional(),
  _id: z.string().optional(),
  name: z.string(),
  color: z.string(),
  stations: z.array(z.object({
    station: z.string().or(z.any()), // Can be ID or populated Station
    order: z.number(),
  })).default([]),
  operatingHours: z.object({
    weekday: z.string(),
    weekend: z.string(),
  }).optional(),
  frequency: z.object({
    peakHours: z.string(),
    offPeakHours: z.string(),
  }).optional(),
  status: z.enum(['operational', 'construction', 'planned', 'closed']),
  openingDate: z.string().optional(),
  length: z.number().optional(),
  alerts: z.array(z.object({
    type: z.enum(['delay', 'closure', 'maintenance', 'info']),
    message: z.string(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    active: z.boolean().default(true),
  })).default([]),
});

export type MetroLine = z.infer<typeof MetroLineSchema>;
