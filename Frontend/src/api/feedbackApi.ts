import api from './axiosInstance';
import { FeedbackSchema, Feedback } from '../types/schema';
import { z } from 'zod';

/**
 * Feedback API Module
 * Standardized with Zod for production-grade type safety.
 */

export const createFeedback = async (feedbackData: Partial<Feedback>): Promise<Feedback> => {
  const data = await api.post('/feedbacks', feedbackData);
  return FeedbackSchema.parse(data);
};

export const getAllFeedbacks = async (): Promise<Feedback[]> => {
  const data = await api.get('/feedbacks');
  return z.array(FeedbackSchema).parse(data);
};

export const getFeedbackById = async (id: string): Promise<Feedback> => {
  const data = await api.get(`/feedbacks/${id}`);
  return FeedbackSchema.parse(data);
};

export const updateFeedback = async (id: string, updateData: Partial<Feedback>): Promise<Feedback> => {
  const data = await api.patch(`/feedbacks/${id}`, updateData);
  return FeedbackSchema.parse(data);
};

export const deleteFeedback = async (id: string): Promise<{ message: string }> => {
  return await api.delete(`/feedbacks/${id}`);
};

export const getFeedbackStats = async (): Promise<any> => {
  return await api.get('/feedbacks/stats');
};
