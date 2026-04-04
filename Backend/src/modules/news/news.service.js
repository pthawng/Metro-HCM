import * as newsRepo from './news.repo.js';
import AppError from '../../core/error/AppError.js';

/**
 * News Service — Business Logic for News module.
 */

export const getAllNews = (filter) => 
  newsRepo.findAll(filter);

export const getNewsById = async (id) => {
  const news = await newsRepo.findById(id);
  if (!news) throw new AppError('Tin tức không tồn tại', 404);
  return news;
};

export const getLatestNews = (limit) => 
  newsRepo.findLatest(limit);

export const getImportantNews = () => 
  newsRepo.findImportant();

export const createNews = (data) => 
  newsRepo.create(data);

export const updateNews = async (id, data) => {
  const news = await newsRepo.updateById(id, data);
  if (!news) throw new AppError('Tin tức không tồn tại', 404);
  return news;
};

export const deleteNews = async (id) => {
  const news = await newsRepo.deleteById(id);
  if (!news) throw new AppError('Tin tức không tồn tại', 404);
  return news;
};
