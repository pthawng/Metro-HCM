import Order from '../../models/order.model.js';

/**
 * Payment Repository
 */

export const createOrder = (data) => 
  Order.create(data);

export const findByOrderId = (orderId) => 
  Order.findOne({ orderId });

export const findById = (id) => 
  Order.findById(id);

export const updateStatus = (orderId, status) => 
  Order.findOneAndUpdate({ orderId }, { paymentStatus: status }, { new: true });

export const saveOrder = (order) => 
  order.save();

export const findUserPaidOrders = (userId) => 
  Order.find({ 
    userId, 
    paymentStatus: 'paid' 
  }).sort({ createdAt: -1 }).lean();
