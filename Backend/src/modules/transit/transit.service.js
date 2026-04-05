import * as transitRepo from './transit.repo.js';
import AppError from '../../core/error/AppError.js';
import { stationOrder, fareMatrix } from '../../shared/utils/fare.js';
import SystemMetadata from '../../models/systemMetadata.model.js';
import * as CacheService from '../../core/cache/CacheService.js';
import logger from '../../core/logger/logger.js';
import * as Metrics from '../../core/metrics/metrics.js';

// ============================================================
// STATE MANAGEMENT (SINGLETON)
// ============================================================

let cachedGraph = null;
let lastVersion = 0;

/**
 * Fetch the global graph version from Metadata.
 * (Staff-level optimization: Versioned cache invalidation)
 */
const getGraphVersion = async () => {
    try {
        const metadata = await SystemMetadata.findOne({ key: 'graph_version' });
        return metadata ? metadata.value : 1;
    } catch (err) {
        logger.error('❌ Error fetching graph version:', err);
        return 1;
    }
};

/**
 * Increment the global graph version in DB. 
 * This effectively invalidates all existing route caches across all nodes.
 */
export const invalidateGraph = async () => {
    try {
        const metadata = await SystemMetadata.findOneAndUpdate(
            { key: 'graph_version' },
            { $inc: { value: 1 } },
            { new: true, upsert: true }
        );
        cachedGraph = null; // Clear local L1 graph
        CacheService.clearL1(); // Clear local L1 results
        logger.info(`🔄 Graph Version Incremented to v${metadata.value}`);
        return metadata.value;
    } catch (err) {
        logger.error('💥 Failed to increment graph version:', err);
    }
};

/**
 * Get the current operational transit graph.
 * Uses L1 in-memory caching synchronized with global version.
 */
const getGraph = async () => {
    const currentVersion = await getGraphVersion();
    
    // If local graph is stale or missing, rebuild it
    if (!cachedGraph || lastVersion !== currentVersion) {
        logger.info(`🏗️ Rebuilding Graph L1 Cache (v${currentVersion})`);
        const operationalLines = await transitRepo.findOperationalLines();
        cachedGraph = buildStationGraph(operationalLines);
        lastVersion = currentVersion;
    }
    
    return cachedGraph;
};

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
 * Tìm đường đi ngắn nhất bằng thuật toán Dijkstra (Hỗ trợ trọng số thời gian).
 */
export const findRoute = (startId, endId, graph) => {
  if (startId === endId) return { path: [startId], duration: 0 };
  if (!graph[startId] || !graph[endId]) return null;

  const distances = {};
  const parents = {};
  const pq = []; // Simple Priority Queue implementation for small metro graphs

  // Initialize
  Object.keys(graph).forEach((nodeId) => {
    distances[nodeId] = Infinity;
  });

  distances[startId] = 0;
  pq.push({ id: startId, dist: 0 });

  while (pq.length > 0) {
    // Sort by distance to simulate Priority Queue (Small N)
    pq.sort((a, b) => a.dist - b.dist);
    const { id: u, dist: d } = pq.shift();

    if (d > distances[u]) continue;
    if (u === endId) break;

    const neighbors = graph[u]?.neighbors || [];
    for (const neighbor of neighbors) {
      const v = neighbor.id;
      const weight = neighbor.time || 2; // Default 2 mins if unspecified

      if (distances[u] + weight < distances[v]) {
        distances[v] = distances[u] + weight;
        parents[v] = u;
        pq.push({ id: v, dist: distances[v] });
      }
    }
  }

  if (distances[endId] === Infinity) return null;

  // Reconstruct path
  const path = [];
  let current = endId;
  while (current) {
    path.unshift(current);
    current = parents[current];
  }

  return { path, duration: distances[endId] };
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
  invalidateGraph();
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

  const updated = await transitRepo.updateLineById(id, updatePayload);
  invalidateGraph();
  return updated;
};

export const deleteLine = async (id) => {
  const existing = await transitRepo.findLineById(id);
  if (!existing) throw new AppError('Không tìm thấy tuyến metro', 404);

  const stationIds = existing.stations.map((s) => s.station._id || s.station);
  await transitRepo.removeLineFromStations(stationIds, id);
  await transitRepo.deleteLineById(id);
  invalidateGraph();
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

  // Versioned Caching (Staff Design: L1/L2 Hierarchy)
  const version = await getGraphVersion();
  const cacheKey = `metro:v${version}:route:${origin}:${destination}`;
  
  const cachedResult = await CacheService.get(cacheKey);
  if (cachedResult) return cachedResult;

  const graph = await getGraph();

  const searchStart = process.hrtime();
  const result = findRoute(origin, destination, graph);
  const searchDuration = process.hrtime(searchStart);
  const seconds = searchDuration[0] + searchDuration[1] / 1e9;
  Metrics.transitRouteDuration.observe(seconds);

  if (!result) {
    throw new AppError('Không tìm thấy đường đi giữa hai ga', 404);
  }

  const stationsOnPath = await transitRepo.findStationsByIds(result.path);
  const sortedStations = result.path
    .map((id) => stationsOnPath.find((s) => s._id.toString() === id.toString()))
    .filter(Boolean);

  const fare = calculateFare(sortedStations);

  const finalResponse = {
    path: result.path,
    stations: sortedStations,
    fare,
    duration: result.duration,
    stationCount: sortedStations.length,
    _v: version // Signal to client which version was used
  };

  // Cache the result in L1/L2 (3 hours TTL for route results)
  await CacheService.set(cacheKey, finalResponse, 10800);

  return finalResponse;
};
