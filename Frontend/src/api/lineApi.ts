import api from './axiosInstance';
import { MetroLineSchema, MetroLine } from '../types/schema';
import { z } from 'zod';

/**
 * Line API Module
 * Standardized with Zod for production-grade type safety.
 */

export const getAllLines = async (): Promise<MetroLine[]> => {
  const data = await api.get('/lines');
  return z.array(MetroLineSchema).parse(data);
};

export const getLineById = async (id: string): Promise<MetroLine> => {
  const data = await api.get(`/lines/${id}`);
  return MetroLineSchema.parse(data);
};

export const searchRoutes = async (startId: string, endId: string): Promise<any> => {
  return await api.get('/lines/search', { params: { startId, endId } });
};

export const createLine = async (lineData: Partial<MetroLine>): Promise<MetroLine> => {
  const data = await api.post('/lines', lineData);
  return MetroLineSchema.parse(data);
};

export const updateLine = async (id: string, lineData: Partial<MetroLine>): Promise<MetroLine> => {
  const data = await api.put(`/lines/${id}`, lineData);
  return MetroLineSchema.parse(data);
};

export const deleteLine = async (id: string): Promise<{ message: string }> => {
  return await api.delete(`/lines/${id}`);
};