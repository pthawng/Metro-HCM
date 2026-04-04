import api from './axiosInstance';
import { ProgressSchema, Progress } from '../types/schema';
import { z } from 'zod';

/**
 * Progress API Module 
 * Standardized with Zod parsing.
 */

export const getAllProgress = async (): Promise<Progress[]> => {
  const data = await api.get('/progress');
  return z.array(ProgressSchema).parse(data);
};

export const getProgressByLine = async (lineId: string): Promise<Progress[]> => {
  const data = await api.get(`/progress/line/${lineId}`);
  return z.array(ProgressSchema).parse(data);
};

export const getOverallProgress = async (lineId: string): Promise<any> => {
  return await api.get(`/progress/overall/${lineId}`);
};

export const createProgress = async (progressData: Partial<Progress>): Promise<Progress> => {
  const data = await api.post('/progress', progressData);
  return ProgressSchema.parse(data);
};

export const updateProgress = async (id: string, progressData: Partial<Progress>): Promise<Progress> => {
  const data = await api.put(`/progress/${id}`, progressData);
  return ProgressSchema.parse(data);
};

export const deleteProgress = async (id: string): Promise<{ message: string }> => {
  return await api.delete(`/progress/${id}`);
};
