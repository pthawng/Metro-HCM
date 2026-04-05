import client from 'prom-client';
import logger from '../logger/logger.js';

/**
 * Staff-level Observability Suite (Prometheus)
 * Monitoring critical system and business paths.
 */

const register = new client.Registry();
client.collectDefaultMetrics({ register });

// --- HTTP Metrics ---
export const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 10], // Tailored for transit API
});
register.registerMetric(httpRequestDuration);

// --- Transit Metrics ---
export const transitRouteDuration = new client.Histogram({
  name: 'metro_transit_route_duration_seconds',
  help: 'Duration of transit route calculations using Dijkstra',
  buckets: [0.01, 0.05, 0.1, 0.5, 1],
});
register.registerMetric(transitRouteDuration);

// --- Cache Metrics ---
export const cacheHits = new client.Counter({
  name: 'metro_cache_hits_total',
  help: 'Total number of cache hits',
  labelNames: ['layer'], // 'l1' or 'l2'
});
register.registerMetric(cacheHits);

// --- Business Metrics ---
export const ticketsSold = new client.Counter({
    name: 'metro_tickets_sold_total',
    help: 'Total number of tickets sold',
    labelNames: ['ticket_type'],
});
register.registerMetric(ticketsSold);

export const getMetrics = async () => {
    return register.metrics();
};

export const getContentType = () => register.contentType;

logger.info('📊 Metrics Registry initialized');
