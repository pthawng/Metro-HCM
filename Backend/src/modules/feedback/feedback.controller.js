import * as feedbackService from './feedback.service.js';
import catchAsync from '../../shared/utils/catchAsync.js';
import { sendSuccess, sendCreated } from '../../core/response/response.js';

/**
 * Feedback Controller
 */

export const getAllFeedbacks = catchAsync(async (req, res) => {
  const feedbacks = await feedbackService.getAllFeedbacks(req.query);
  sendSuccess(res, feedbacks);
});

export const getFeedbackById = catchAsync(async (req, res) => {
  const feedback = await feedbackService.getFeedbackById(req.params.id);
  sendSuccess(res, feedback);
});

export const createFeedback = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  const feedback = await feedbackService.createFeedback(userId, req.body);
  sendCreated(res, feedback, 'Gửi phản hồi thành công');
});

export const updateFeedback = catchAsync(async (req, res) => {
  const feedback = await feedbackService.updateFeedback(req.params.id, req.body);
  sendSuccess(res, feedback, { message: 'Cập nhật phản hồi thành công' });
});

export const deleteFeedback = catchAsync(async (req, res) => {
  await feedbackService.deleteFeedback(req.params.id);
  sendSuccess(res, null, { message: 'Xóa phản hồi thành công' });
});

export const getStats = catchAsync(async (req, res) => {
  const stats = await feedbackService.getFeedbackStats();
  sendSuccess(res, stats);
});
