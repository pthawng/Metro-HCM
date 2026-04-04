import MetroLine from '../../models/line.model.js';
import Station from '../../models/station.model.js';

/**
 * Transit Repository
 * Tất cả DB queries cho transit domain tập trung tại đây.
 * Service layer KHÔNG biết Mongoose tồn tại.
 */

export const findAllLines = () =>
  MetroLine.find().populate('stations.station').lean();

export const findLineById = (id) =>
  MetroLine.findById(id).populate('stations.station').lean();

export const findOperationalLines = () =>
  MetroLine.find({ status: 'operational' }).populate('stations.station').lean();

export const findStationById = (id) =>
  Station.findById(id).lean();

export const findStationsByIds = (ids) =>
  Station.find({ _id: { $in: ids } }).lean();

export const createLine = (data) =>
  MetroLine.create(data);

export const updateLineById = (id, data) =>
  MetroLine.findByIdAndUpdate(id, data, { new: true, runValidators: true });

export const deleteLineById = (id) =>
  MetroLine.findByIdAndDelete(id);

export const addLineToStations = (stationIds, lineId) =>
  Station.updateMany(
    { _id: { $in: stationIds } },
    { $addToSet: { lines: lineId } }
  );

export const removeLineFromStations = (stationIds, lineId) =>
  Station.updateMany(
    { _id: { $in: stationIds } },
    { $pull: { lines: lineId } }
  );
