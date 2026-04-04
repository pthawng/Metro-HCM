import * as stationService from './station.service.js';
import catchAsync from '../../shared/utils/catchAsync.js';
import { sendSuccess, sendCreated } from '../../core/response/response.js';

/**
 * Station Controller — Thin layer.
 */

export const getAllStations = catchAsync(async (req, res) => {
  const stations = await stationService.getAllStations();
  sendSuccess(res, stations);
});

export const getStationById = catchAsync(async (req, res) => {
  const station = await stationService.getStationById(req.params.id);
  sendSuccess(res, station);
});

export const getNearbyStations = catchAsync(async (req, res) => {
  const { latitude, longitude, maxDistance } = req.query;
  const stations = await stationService.getNearbyStations(
    parseFloat(latitude), 
    parseFloat(longitude), 
    maxDistance ? parseInt(maxDistance) : undefined
  );
  sendSuccess(res, stations);
});

export const createStation = catchAsync(async (req, res) => {
  const station = await stationService.createStation(req.body);
  sendCreated(res, station, 'Tạo ga thành công');
});

export const updateStation = catchAsync(async (req, res) => {
  const station = await stationService.updateStation(req.params.id, req.body);
  sendSuccess(res, station, { message: 'Cập nhật ga thành công' });
});

export const deleteStation = catchAsync(async (req, res) => {
  await stationService.deleteStation(req.params.id);
  sendSuccess(res, null, { message: 'Xóa ga thành công' });
});
