import * as transitRepo from './transit.repo.js';
import AppError from '../../core/error/AppError.js';
import { stationOrder, fareMatrix } from '../../shared/utils/fare.js';

// ============================================================
// GRAPH BUILDER
// ============================================================

/**
 * Xây dựng đồ thị (Graph) station dựa trên danh sách các tuyến.
 */
export const buildStationGraph = (lines) => {
  const graph = {};

  for (const line of lines) {
    if (!Array.isArray(line.stations)) continue;

    const sorted = [...line.stations].sort((a, b) => a.order - b.order);

    sorted.forEach((item, index) => {
      if (!item.station) return;

      const stationId = item.station._id.toString();

      if (!graph[stationId]) {
        graph[stationId] = { neighbors: [] };
      }

      // Liên kết với ga trước
      if (index > 0 && sorted[index - 1].station) {
        const prevId = sorted[index - 1].station._id.toString();
        graph[stationId].neighbors.push({ id: prevId, time: 2, lineId: line._id });
      }

      // Liên kết với ga sau
      if (index < sorted.length - 1 && sorted[index + 1].station) {
        const nextId = sorted[index + 1].station._id.toString();
        graph[stationId].neighbors.push({ id: nextId, time: 2, lineId: line._id });
      }
    });
  }

  return graph;
};

// ============================================================
// ROUTING
// ============================================================

/**
 * Tìm đường đi ngắn nhất bằng BFS.
 */
export const findRoute = (startId, endId, graph) => {
  if (startId === endId) return { path: [startId], duration: 0 };
  if (!graph[startId] || !graph[endId]) return null;

  const queue = [{ id: startId, path: [startId], duration: 0 }];
  const visited = new Set();

  while (queue.length > 0) {
    const { id, path, duration } = queue.shift();

    if (id === endId) return { path, duration };
    if (visited.has(id)) continue;
    visited.add(id);

    const neighbors = graph[id]?.neighbors || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor.id)) {
        queue.push({
          id: neighbor.id,
          path: [...path, neighbor.id],
          duration: duration + neighbor.time,
        });
      }
    }
  }

  return null;
};

// ============================================================
// FARE CALCULATION
// ============================================================

/**
 * Tính giá vé dựa theo tên ga (dùng fareMatrix).
 */
export const calculateFare = (stations) => {
  if (!stations || stations.length <= 1) return 0;

  const originName = stations[0].name;
  const destName = stations[stations.length - 1].name;

  const i = stationOrder.indexOf(originName);
  const j = stationOrder.indexOf(destName);

  if (i !== -1 && j !== -1) {
    return fareMatrix[i][j] * 1000;
  }

  // Fallback: base fare + số chặng
  const BASE_FARE = 12000;
  const FARE_PER_STOP = 2000;
  return BASE_FARE + (stations.length - 1) * FARE_PER_STOP;
};

// ============================================================
// PUBLIC SERVICE METHODS
// ============================================================

export const getAllLines = async () => {
  return transitRepo.findAllLines();
};

export const getLineById = async (id) => {
  const line = await transitRepo.findLineById(id);
  if (!line) throw new AppError('Không tìm thấy tuyến metro', 404);
  return line;
};

export const getStationsByLine = async (lineId) => {
  const line = await transitRepo.findLineById(lineId);
  if (!line) throw new AppError('Không tìm thấy tuyến metro', 404);
  return line.stations;
};

export const createLine = async (data) => {
  const { stations, ...rest } = data;

  if (!Array.isArray(stations) || stations.length === 0) {
    throw new AppError('Danh sách stations không hợp lệ hoặc rỗng', 400);
  }

  const newLine = await transitRepo.createLine({
    ...rest,
    stations: stations.map((stationId, index) => ({
      station: stationId,
      order: index + 1,
    })),
  });

  await transitRepo.addLineToStations(stations, newLine._id);
  return newLine;
};

export const updateLine = async (id, data) => {
  const existing = await transitRepo.findLineById(id);
  if (!existing) throw new AppError('Không tìm thấy tuyến metro', 404);

  const updatePayload = { ...data };

  if (data.stations) {
    updatePayload.stations = data.stations.map((stationId, index) => ({
      station: stationId,
      order: index + 1,
    }));

    const oldStationIds = existing.stations.map((s) => s.station._id || s.station);
    await transitRepo.removeLineFromStations(oldStationIds, id);
    await transitRepo.addLineToStations(data.stations, id);
  }

  return transitRepo.updateLineById(id, updatePayload);
};

export const deleteLine = async (id) => {
  const existing = await transitRepo.findLineById(id);
  if (!existing) throw new AppError('Không tìm thấy tuyến metro', 404);

  const stationIds = existing.stations.map((s) => s.station._id || s.station);
  await transitRepo.removeLineFromStations(stationIds, id);
  await transitRepo.deleteLineById(id);
};

export const searchRoutes = async ({ origin, destination }) => {
  if (!origin || !destination) {
    throw new AppError('Vui lòng cung cấp điểm đi và điểm đến', 400);
  }

  const [originStation, destStation] = await Promise.all([
    transitRepo.findStationById(origin),
    transitRepo.findStationById(destination),
  ]);

  if (!originStation) throw new AppError('Ga xuất phát không tồn tại', 404);
  if (!destStation) throw new AppError('Ga đích không tồn tại', 404);

  if (originStation.status !== 'operational') {
    throw new AppError('Ga xuất phát hiện đang không hoạt động', 400);
  }
  if (destStation.status !== 'operational') {
    throw new AppError('Ga đích hiện đang không hoạt động', 400);
  }

  const operationalLines = await transitRepo.findOperationalLines();
  const graph = buildStationGraph(operationalLines);

  const result = findRoute(origin, destination, graph);
  if (!result) {
    throw new AppError('Không tìm thấy đường đi giữa hai ga', 404);
  }

  const stationsOnPath = await transitRepo.findStationsByIds(result.path);
  const sortedStations = result.path
    .map((id) => stationsOnPath.find((s) => s._id.toString() === id.toString()))
    .filter(Boolean);

  const fare = calculateFare(sortedStations);

  return {
    path: result.path,
    stations: sortedStations,
    fare,
    duration: result.duration,
    stationCount: sortedStations.length,
  };
};
