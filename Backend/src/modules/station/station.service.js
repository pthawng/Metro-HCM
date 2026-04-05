import * as stationRepo from './station.repo.js';
import AppError from '../../core/error/AppError.js';
import { invalidateGraph } from '../transit/transit.service.js';

/**
 * Station Service — Business Logic for Station module.
 */

export const getAllStations = (filter) => 
  stationRepo.findAll(filter);

export const getStationById = async (id) => {
  const station = await stationRepo.findById(id);
  if (!station) throw new AppError('Ga không tồn tại', 404);
  return station;
};

export const createStation = (data) => 
  stationRepo.create(data);

export const updateStation = async (id, data) => {
  const station = await stationRepo.updateById(id, data);
  if (!station) throw new AppError('Ga không tồn tại', 404);
  invalidateGraph();
  return station;
};

export const deleteStation = async (id) => {
  const station = await stationRepo.deleteById(id);
  if (!station) throw new AppError('Ga không tồn tại', 404);
  invalidateGraph();
  return station;
};

export const getLinesByStation = async (stationId) => {
  const lines = await stationRepo.findLinesByStationId(stationId);
  return lines;
};

export const getNearbyStations = async (latitude, longitude, maxDistance = 5000) => {
  return stationRepo.findStationsByCriteria({
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
        $maxDistance: maxDistance,
      },
    },
  });
};
