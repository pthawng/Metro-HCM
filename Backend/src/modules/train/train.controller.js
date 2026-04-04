import * as trainService from './train.service.js';
import catchAsync from '../../shared/utils/catchAsync.js';
import { sendSuccess, sendCreated } from '../../core/response/response.js';

/**
 * Train Controller
 */

export const getAllTrains = catchAsync(async (req, res) => {
  const trains = await trainService.getAllTrains(req.query);
  sendSuccess(res, trains);
});

export const getTrainById = catchAsync(async (req, res) => {
  const train = await trainService.getTrainById(req.params.id);
  sendSuccess(res, train);
});

export const getTrainsByLine = catchAsync(async (req, res) => {
  const trains = await trainService.getTrainsByLine(req.params.lineId);
  sendSuccess(res, trains);
});

export const createTrain = catchAsync(async (req, res) => {
  const train = await trainService.createTrain(req.body);
  sendCreated(res, train, 'Tạo tàu thành công');
});

export const updateTrain = catchAsync(async (req, res) => {
  const train = await trainService.updateTrain(req.params.id, req.body);
  sendSuccess(res, train, { message: 'Cập nhật tàu thành công' });
});

export const deleteTrain = catchAsync(async (req, res) => {
  await trainService.deleteTrain(req.params.id);
  sendSuccess(res, null, { message: 'Xóa tàu thành công' });
});

export const simulatePositions = catchAsync(async (req, res) => {
  const updatedTrains = await trainService.simulateTrainPositions(req.params.lineId);
  sendSuccess(res, updatedTrains, { message: 'Mô phỏng vị trí tàu thành công' });
});
