import Station from '../../models/station.model.js';
import MetroLine from '../../models/line.model.js';

/**
 * Station Repository
 */

export const findAll = (filter = {}) => 
  Station.find(filter).lean();

export const findById = (id) => 
  Station.findById(id).lean();

export const findOneByCriteria = (criteria) => 
  Station.findOne(criteria).lean();

export const create = (data) => 
  Station.create(data);

export const updateById = (id, data) => 
  Station.findByIdAndUpdate(id, data, { new: true, runValidators: true });

export const deleteById = (id) => 
  Station.findByIdAndDelete(id);

export const findLinesByStationId = (stationId) => 
  MetroLine.find({ "stations.station": stationId });

export const findStationsByCriteria = (criteria) => 
  Station.find(criteria).lean();
