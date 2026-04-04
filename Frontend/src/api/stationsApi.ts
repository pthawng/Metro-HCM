import api from './axiosInstance';
import { StationSchema, Station } from '../types/schema';
import { z } from 'zod';

/**
 * Stations API Module
 * Built with Zod for safety and consistency.
 */

export const getAllStations = async (): Promise<Station[]> => {
  const data = await api.get('/stations');
  return z.array(StationSchema).parse(data);
};

export const getStationById = async (id: string): Promise<Station> => {
  const data = await api.get(`/stations/${id}`);
  return StationSchema.parse(data);
};

export const getNearbyStations = async (latitude: number, longitude: number, maxDistance?: number): Promise<Station[]> => {
  const data = await api.get('/stations/nearby', { 
    params: { latitude, longitude, maxDistance } 
  });
  return z.array(StationSchema).parse(data);
};

export const createStation = async (stationData: Partial<Station>): Promise<Station> => {
  const data = await api.post('/stations', stationData);
  return StationSchema.parse(data);
};

export const updateStation = async (id: string, stationData: Partial<Station>): Promise<Station> => {
  const data = await api.put(`/stations/${id}`, stationData);
  return StationSchema.parse(data);
};

export const deleteStation = async (id: string): Promise<{ message: string }> => {
  return await api.delete(`/stations/${id}`);
};
