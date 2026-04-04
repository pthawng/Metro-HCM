import * as progressRepo from './progress.repo.js';
import AppError from '../../core/error/AppError.js';

/**
 * Progress Service — Business Logic for Construction Progress module.
 */

export const getAllProgress = (filter) => 
  progressRepo.findAll(filter);

export const getProgressById = async (id) => {
  const progress = await progressRepo.findById(id);
  if (!progress) throw new AppError('Dữ liệu tiến độ không tồn tại', 404);
  return progress;
};

export const getProgressByLine = (lineId) => 
  progressRepo.findByLine(lineId);

export const createProgress = (data) => 
  progressRepo.create(data);

export const updateProgress = async (id, data) => {
  const progress = await progressRepo.updateById(id, data);
  if (!progress) throw new AppError('Dữ liệu tiến độ không tồn tại', 404);
  return progress;
};

export const deleteProgress = async (id) => {
  const progress = await progressRepo.deleteById(id);
  if (!progress) throw new AppError('Dữ liệu tiến độ không tồn tại', 404);
  return progress;
};

export const getLatestProgressByLine = async (lineId) => {
  const progress = await progressRepo.getOverallProgress(lineId);
  if (!progress) return { lineId, overallPercentage: 0, status: 'No data' };
  return progress;
};
