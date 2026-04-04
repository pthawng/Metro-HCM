import * as progressService from './progress.service.js';
import catchAsync from '../../shared/utils/catchAsync.js';
import { sendSuccess, sendCreated } from '../../core/response/response.js';

/**
 * Progress Controller
 */

export const getAllProgress = catchAsync(async (req, res) => {
  const progressEntries = await progressService.getAllProgress(req.query);
  sendSuccess(res, progressEntries);
});

export const getProgressById = catchAsync(async (req, res) => {
  const progress = await progressService.getProgressById(req.params.id);
  sendSuccess(res, progress);
});

export const getProgressByLine = catchAsync(async (req, res) => {
  const progress = await progressService.getProgressByLine(req.params.lineId);
  sendSuccess(res, progress);
});

export const createProgress = catchAsync(async (req, res) => {
  const progress = await progressService.createProgress(req.body);
  sendCreated(res, progress, 'Thêm dữ liệu tiến độ thành công');
});

export const updateProgress = catchAsync(async (req, res) => {
  const progress = await progressService.updateProgress(req.params.id, req.body);
  sendSuccess(res, progress, { message: 'Cập nhật tiến độ thành công' });
});

export const deleteProgress = catchAsync(async (req, res) => {
  await progressService.deleteProgress(req.params.id);
  sendSuccess(res, null, { message: 'Xóa dữ liệu tiến độ thành công' });
});

export const getOverall = catchAsync(async (req, res) => {
  const progress = await progressService.getLatestProgressByLine(req.params.lineId);
  sendSuccess(res, progress);
});
