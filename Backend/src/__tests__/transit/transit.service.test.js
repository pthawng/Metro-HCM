'use strict';

const { buildStationGraph, findRoute, calculateFare } = require('../../modules/transit/transit.service');

/**
 * Transit Service Unit Tests
 * Thử nghiệm core logic: Graph building, BFS routing, và Fare calculation.
 * Không cần database, không cần server.
 */

describe('Transit Core Logic', () => {
  // Mock data cho Metro Lines
  const mockLines = [
    {
      _id: 'line1',
      stations: [
        { station: { _id: 'S1', name: 'Bến Thành' }, order: 1 },
        { station: { _id: 'S2', name: 'Nhà hát Thành phố' }, order: 2 },
        { station: { _id: 'S3', name: 'Ba Son' }, order: 3 },
      ]
    },
    {
      _id: 'line2',
      stations: [
        { station: { _id: 'S3', name: 'Ba Son' }, order: 1 },
        { station: { _id: 'S4', name: 'Tân Cảng' }, order: 2 },
      ]
    }
  ];

  describe('buildStationGraph', () => {
    it('should build a valid adjacency list from lines', () => {
      const graph = buildStationGraph(mockLines);
      
      expect(graph).toHaveProperty('S1');
      expect(graph).toHaveProperty('S2');
      expect(graph).toHaveProperty('S3');
      expect(graph['S1'].neighbors).toHaveLength(1);
      expect(graph['S1'].neighbors[0].id).toBe('S2');
      
      // S2 ở giữa, có 2 láng giềng
      expect(graph['S2'].neighbors).toHaveLength(2);
      
      // S3 là ga chuyển tuyến (interchange)
      expect(graph['S3'].neighbors.map(n => n.id)).toContain('S2');
      expect(graph['S3'].neighbors.map(n => n.id)).toContain('S4');
    });
  });

  describe('findRoute (BFS)', () => {
    let graph;
    beforeAll(() => {
      graph = buildStationGraph(mockLines);
    });

    it('should find the shortest path between two stations on same line', () => {
      const result = findRoute('S1', 'S3', graph);
      expect(result.path).toEqual(['S1', 'S2', 'S3']);
      expect(result.duration).toBe(4); // 2 stops * 2 mins
    });

    it('should find path across different lines (interchange)', () => {
      const result = findRoute('S1', 'S4', graph);
      expect(result.path).toEqual(['S1', 'S2', 'S3', 'S4']);
    });

    it('should return null if no path exists', () => {
      const result = findRoute('S1', 'NON_EXISTENT', graph);
      expect(result).toBeNull();
    });
  });

  describe('calculateFare', () => {
    it('should calculate fare based on names using fareMatrix', () => {
      const stations = [
        { name: 'Bến Thành' },
        { name: 'Ba Son' },
        { name: 'Bến xe Suối Tiên' }
      ];
      // Theo fareMatrix: Bến Thành -> Bến xe Suối Tiên là 20k
      const fare = calculateFare(stations);
      expect(fare).toBe(20000);
    });

    it('should use fallback calculation if names not in matrix', () => {
      const stations = [
        { name: 'Unknown A' },
        { name: 'Unknown B' },
        { name: 'Unknown C' }
      ];
      // Fallback: 12k base + 2*2k stops = 16k
      const fare = calculateFare(stations);
      expect(fare).toBe(16000);
    });
  });
});
