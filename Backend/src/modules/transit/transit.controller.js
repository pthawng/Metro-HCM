import * as transitService from './transit.service.js';
import catchAsync from '../../shared/utils/catchAsync.js';
import { sendSuccess, sendCreated } from '../../core/response/response.js';

/**
 * Transit Controller
 */

export const getAllLines = catchAsync(async (req, res) => {
  const lines = await transitService.getAllLines();
  sendSuccess(res, lines);
});

export const getLineById = catchAsync(async (req, res) => {
  const line = await transitService.getLineById(req.params.id);
  sendSuccess(res, line);
});

export const createLine = catchAsync(async (req, res) => {
  const line = await transitService.createLine(req.body);
  sendCreated(res, line, 'Tạo tuyến metro thành công');
});

export const updateLine = catchAsync(async (req, res) => {
  const line = await transitService.updateLine(req.params.id, req.body);
  sendSuccess(res, line, { message: 'Cập nhật tuyến metro thành công' });
});

export const deleteLine = catchAsync(async (req, res) => {
  await transitService.deleteLine(req.params.id);
  sendSuccess(res, null, { message: 'Xóa tuyến metro thành công' });
});

export const searchRoutes = catchAsync(async (req, res) => {
  const { origin, destination } = req.query;
  const result = await transitService.searchRoutes({ origin, destination });
  sendSuccess(res, result);
});
