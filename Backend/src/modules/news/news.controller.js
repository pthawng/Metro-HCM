import * as newsService from './news.service.js';
import catchAsync from '../../shared/utils/catchAsync.js';
import { sendSuccess, sendCreated } from '../../core/response/response.js';

/**
 * News Controller — Thin layer.
 */

export const getAllNews = catchAsync(async (req, res) => {
  const news = await newsService.getAllNews();
  sendSuccess(res, news);
});

export const getNewsById = catchAsync(async (req, res) => {
  const news = await newsService.getNewsById(req.params.id);
  sendSuccess(res, news);
});

export const getLatestNews = catchAsync(async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;
  const news = await newsService.getLatestNews(limit);
  sendSuccess(res, news);
});

export const getImportantNews = catchAsync(async (req, res) => {
  const news = await newsService.getImportantNews();
  sendSuccess(res, news);
});

export const createNews = catchAsync(async (req, res) => {
  const news = await newsService.createNews(req.body);
  sendCreated(res, news, 'Thêm tin tức thành công');
});

export const updateNews = catchAsync(async (req, res) => {
  const news = await newsService.updateNews(req.params.id, req.body);
  sendSuccess(res, news, { message: 'Cập nhật tin tức thành công' });
});

export const deleteNews = catchAsync(async (req, res) => {
  await newsService.deleteNews(req.params.id);
  sendSuccess(res, null, { message: 'Xóa tin tức thành công' });
});
