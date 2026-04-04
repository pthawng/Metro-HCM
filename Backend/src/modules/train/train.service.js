import * as trainRepo from './train.repo.js';
import AppError from '../../core/error/AppError.js';

/**
 * Train Service — Business Logic for Train module.
 */

export const getAllTrains = (filter) => 
  trainRepo.findAll(filter);

export const getTrainById = async (id) => {
  const train = await trainRepo.findById(id);
  if (!train) throw new AppError('Tàu không tồn tại', 404);
  return train;
};

export const getTrainsByLine = (lineId) => 
  trainRepo.findTrainsByLine(lineId);

export const createTrain = (data) => 
  trainRepo.create(data);

export const updateTrain = async (id, data) => {
  const train = await trainRepo.updateById(id, data);
  if (!train) throw new AppError('Tàu không tồn tại', 404);
  return train;
};

export const deleteTrain = async (id) => {
  const train = await trainRepo.deleteById(id);
  if (!train) throw new AppError('Tàu không tồn tại', 404);
  return train;
};

/**
 * Simulation Logic: Cập nhật vị trí tàu mô phỏng
 */
export const simulateTrainPositions = async (lineId) => {
  const trains = await trainRepo.findTrainsByLine(lineId);
  if (!trains.length) return [];

  const updatedTrains = await Promise.all(trains.map(async (train) => {
    const line = train.currentLine;
    if (!line || !line.stations) return train;

    const currentStationIndex = line.stations.findIndex(s => s.station.toString() === train.nextStation?.toString());
    const nextIndex = (currentStationIndex + 1) % line.stations.length;
    const nextStationId = line.stations[nextIndex].station;

    return trainRepo.updateById(train._id, {
      lastStation: train.nextStation,
      nextStation: nextStationId,
      status: 'moving',
      lastUpdate: new Date()
    });
  }));

  return updatedTrains;
};
