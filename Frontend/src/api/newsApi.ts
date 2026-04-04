import api from './axiosInstance';
import { NewsSchema, News } from '../types/schema';
import { z } from 'zod';

/**
 * News API Module
 * Standardized with Zod for production-grade type safety.
 */

export const getAllNews = async (params = {}): Promise<News[]> => {
  const data = await api.get('/news', { params });
  return z.array(NewsSchema).parse(data);
};

export const getNewsById = async (id: string): Promise<News> => {
  const data = await api.get(`/news/${id}`);
  return NewsSchema.parse(data);
};

export const getLatestNews = async (): Promise<News[]> => {
  const data = await api.get('/news/latest');
  return z.array(NewsSchema).parse(data);
};

export const getImportantNews = async (): Promise<News[]> => {
  const data = await api.get('/news/important');
  return z.array(NewsSchema).parse(data);
};

export const createNews = async (newsData: Partial<News>): Promise<News> => {
  const data = await api.post('/news', newsData);
  return NewsSchema.parse(data);
};

export const updateNews = async (id: string, newsData: Partial<News>): Promise<News> => {
  const data = await api.put(`/news/${id}`, newsData);
  return NewsSchema.parse(data);
};

export const deleteNews = async (id: string): Promise<{ message: string }> => {
  return await api.delete(`/news/${id}`);
};
