import mongoose from 'mongoose';
import { TicketCategory, PaymentMethod, PaymentStatus } from '../shared/constants/enums.js';

const OrderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true,
  },
  userPhone: {
    type: String,
    required: true,
  },
  ticketType: {
    type: String,
    enum: Object.values(TicketCategory),
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: Object.values(PaymentMethod),
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: Object.values(PaymentStatus),
    default: PaymentStatus.PENDING,
  },
  routes: {
    type: Array,
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  expiryDate: {
    type: Date,
  },
  usageCount: {
    type: Number,
  },
  groupSize: {
    type: Number,
  },
  qrCode: {
    type: String,
  },
  idempotencyKey: {
    type: String,
    unique: true,
    sparse: true, // Only for new orders that require deduplication
    index: true,
  },
}, { timestamps: true });

const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);
export default Order;
