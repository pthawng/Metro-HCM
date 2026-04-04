import * as feedbackRepo from './feedback.repo.js';
import AppError from '../../core/error/AppError.js';

/**
 * Feedback Service — Business Logic for Feedback module.
 */

export const getAllFeedbacks = (filter) => 
  feedbackRepo.findAll(filter);

export const getFeedbackById = async (id) => {
  const feedback = await feedbackRepo.findById(id);
  if (!feedback) throw new AppError('Phản hồi không tồn tại', 404);
  return feedback;
};

export const createFeedback = (userId, data) => 
  feedbackRepo.create({ ...data, userId }); // Fixed field name to userId to match repo usage

export const updateFeedback = async (id, data) => {
  const feedback = await feedbackRepo.updateById(id, data);
  if (!feedback) throw new AppError('Phản hồi không tồn tại', 404);
  return feedback;
};

export const deleteFeedback = async (id) => {
  const feedback = await feedbackRepo.deleteById(id);
  if (!feedback) throw new AppError('Phản hồi không tồn tại', 404);
  return feedback;
};

export const getFeedbackStats = async () => {
  const [total, ratings] = await Promise.all([
    feedbackRepo.countByCriteria({}),
    feedbackRepo.aggregateByRating(),
  ]);

  const ratingSummary = ratings.reduce((acc, curr) => {
    acc[curr._id] = curr.count;
    return acc;
  }, {});

  return { total, ratingSummary };
};
