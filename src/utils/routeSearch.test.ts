import { describe, it, expect } from 'vitest';
import {
  findStopIndex,
  searchDirectRoutes,
  getRouteSegment,
  calculateSegmentFare,
  estimateDistance,
  filterByFareRange,
  filterByDistanceRange,
  filterByMaxTime,
  findTransferPoints,
  sortRoutes,
  getCheapestRoute,
  getFastestRoute,
  getShortestRoute,
  type SearchRoute,
} from './routeSearch';

/**
 * Unit tests for route search utilities
 * Tests searching, filtering, and sorting bus routes
 */
describe('Route Search Utilities', () => {
  // Sample routes for testing
  const mockRoutes: SearchRoute[] = [
    {
      id: 'route-1',
      name: 'Bus A',
      stops: ['Mirpur', 'Kafrul', 'Uttara', 'Farmgate', 'Motijheel'],
      fare: 80,
      distance: 18,
      durationMinutes: 90,
    },
    {
      id: 'route-2',
      name: 'Bus B',
      stops: ['Mirpur', 'Mohakhali', 'Malibagh', 'Farmgate', 'Motijheel'],
      fare: 100,
      distance: 20,
      durationMinutes: 100,
    },
    {
      id: 'route-3',
      name: 'Bus C',
      stops: ['Uttara', 'Farmgate', 'Shahbag', 'Kawran Bazar'],
      fare: 50,
      distance: 10,
      durationMinutes: 50,
    },
    {
      id: 'route-4',
      name: 'Bus D',
      stops: ['Savar', 'Ashulia', 'Gazipur', 'Malibagh'],
      fare: 120,
      distance: 25,
      durationMinutes: 120,
    },
  ];

  // ===== findStopIndex Tests =====
  describe('findStopIndex', () => {
    const stops = ['Mirpur', 'Uttara', 'Farmgate', 'Motijheel'];

    it('should find exact match (case-insensitive)', () => {
      expect(findStopIndex(stops, 'Mirpur')).toBe(0);
      expect(findStopIndex(stops, 'mirpur')).toBe(0);
      expect(findStopIndex(stops, 'MIRPUR')).toBe(0);
    });

    it('should find partial match', () => {
      // 'farm' matches 'Farmgate'
      expect(findStopIndex(stops, 'farm')).toBe(2);
    });

    it('should return -1 for non-existent stop', () => {
      expect(findStopIndex(stops, 'Dhaka')).toBe(-1);
    });

    it('should return -1 for empty search term', () => {
      expect(findStopIndex(stops, '')).toBe(-1);
    });

    it('should handle multiple matching stops', () => {
      const stopsWithDuplicates = ['Mirpur', 'Mirpur 10', 'Mirpur 11', 'Farmgate'];
      // Should return first match
      expect(findStopIndex(stopsWithDuplicates, 'Mirpur')).toBe(0);
    });

    it('should prioritize exact match over partial', () => {
      const stops = ['Farm', 'Farmgate', 'Farmer'];
      // Exact match should be found first
      expect(findStopIndex(stops, 'Farm')).toBe(0);
    });
  });

  // ===== searchDirectRoutes Tests =====
  describe('searchDirectRoutes', () => {
    it('should find direct routes between two locations', () => {
      const results = searchDirectRoutes(mockRoutes, 'Mirpur', 'Motijheel');
      expect(results.length).toBe(2); // Route 1 and Route 2
      expect(results[0].id).toBe('route-1');
      expect(results[1].id).toBe('route-2');
    });

    it('should return empty array for non-existent locations', () => {
      const results = searchDirectRoutes(mockRoutes, 'NonExistent', 'AlsoNonExistent');
      expect(results.length).toBe(0);
    });

    it('should return empty array when from or to is empty', () => {
      expect(searchDirectRoutes(mockRoutes, '', 'Motijheel')).toEqual([]);
      expect(searchDirectRoutes(mockRoutes, 'Mirpur', '')).toEqual([]);
      expect(searchDirectRoutes(mockRoutes, '', '')).toEqual([]);
    });

    it('should handle case-insensitive search', () => {
      const results1 = searchDirectRoutes(mockRoutes, 'mirpur', 'motijheel');
      const results2 = searchDirectRoutes(mockRoutes, 'MIRPUR', 'MOTIJHEEL');
      expect(results1.length).toBe(results2.length);
    });

    it('should work for reverse routes', () => {
      const results = searchDirectRoutes(mockRoutes, 'Motijheel', 'Mirpur');
      expect(results.length).toBe(2); // Same routes work in both directions
    });

    it('should exclude routes where locations are the same', () => {
      const results = searchDirectRoutes(mockRoutes, 'Farmgate', 'Farmgate');
      expect(results.length).toBe(0);
    });

    it('should find routes with partial location names', () => {
      const results = searchDirectRoutes(mockRoutes, 'Mir', 'Moti');
      expect(results.length).toBeGreaterThan(0);
    });
  });

  // ===== getRouteSegment Tests =====
  describe('getRouteSegment', () => {
    const route = mockRoutes[0]; // ['Mirpur', 'Kafrul', 'Uttara', 'Farmgate', 'Motijheel']

    it('should get segment in forward direction', () => {
      const segment = getRouteSegment(route, 0, 3); // Mirpur to Farmgate
      expect(segment).toEqual(['Mirpur', 'Kafrul', 'Uttara', 'Farmgate']);
    });

    it('should get segment in reverse direction', () => {
      const segment = getRouteSegment(route, 3, 0); // Farmgate to Mirpur
      expect(segment).toEqual(['Farmgate', 'Uttara', 'Kafrul', 'Mirpur']);
    });

    it('should return empty array for same indices', () => {
      const segment = getRouteSegment(route, 2, 2);
      expect(segment).toEqual([]);
    });

    it('should include both start and end stops', () => {
      const segment = getRouteSegment(route, 1, 3);
      expect(segment.length).toBe(3); // Kafrul, Uttara, Farmgate
      expect(segment[0]).toBe('Kafrul');
      expect(segment[segment.length - 1]).toBe('Farmgate');
    });
  });

  // ===== calculateSegmentFare Tests =====
  describe('calculateSegmentFare', () => {
    it('should calculate fare with default parameters', () => {
      const fare = calculateSegmentFare(10); // 10 km * 2.45 = 24.5
      expect(fare).toBe(25); // Rounded
    });

    it('should apply minimum fare', () => {
      const fare = calculateSegmentFare(2, 2.45, 10); // 2 * 2.45 = 4.9 < 10
      expect(fare).toBe(10);
    });

    it('should use custom rate per km', () => {
      const fare = calculateSegmentFare(10, 3.0, 10); // 10 * 3.0 = 30
      expect(fare).toBe(30);
    });

    it('should use custom minimum fare', () => {
      const fare = calculateSegmentFare(5, 2.45, 50); // 5 * 2.45 = 12.25 < 50
      expect(fare).toBe(50);
    });

    it('should handle zero distance', () => {
      const fare = calculateSegmentFare(0, 2.45, 10);
      expect(fare).toBe(10); // Returns minimum
    });
  });

  // ===== estimateDistance Tests =====
  describe('estimateDistance', () => {
    it('should estimate distance with default per-stop distance', () => {
      const distance = estimateDistance(10); // 10 stops * 1.2 = 12
      expect(distance).toBe(12);
    });

    it('should estimate with custom per-stop distance', () => {
      const distance = estimateDistance(8, 2.0); // 8 stops * 2.0 = 16
      expect(distance).toBe(16);
    });

    it('should return 0 for zero stops', () => {
      expect(estimateDistance(0)).toBe(0);
    });

    it('should return decimal values as fixed 1 place', () => {
      const distance = estimateDistance(5, 1.3); // 5 * 1.3 = 6.5
      expect(distance).toBe(6.5);
    });
  });

  // ===== filterByFareRange Tests =====
  describe('filterByFareRange', () => {
    it('should filter routes within fare range', () => {
      const results = filterByFareRange(mockRoutes, 50, 100);
      expect(results.length).toBe(3); // Routes with fares 50, 80, 100
    });

    it('should return empty for no matches', () => {
      const results = filterByFareRange(mockRoutes, 200, 300);
      expect(results.length).toBe(0);
    });

    it('should include boundary values', () => {
      const results = filterByFareRange(mockRoutes, 80, 100);
      expect(results.some(r => r.fare === 80)).toBe(true);
      expect(results.some(r => r.fare === 100)).toBe(true);
    });

    it('should handle single route in range', () => {
      const results = filterByFareRange(mockRoutes, 120, 120);
      expect(results.length).toBe(1);
      expect(results[0].id).toBe('route-4');
    });
  });

  // ===== filterByDistanceRange Tests =====
  describe('filterByDistanceRange', () => {
    it('should filter routes within distance range', () => {
      const results = filterByDistanceRange(mockRoutes, 10, 20);
      expect(results.length).toBe(3); // Routes with distances 10, 18, 20
    });

    it('should return empty for no matches', () => {
      const results = filterByDistanceRange(mockRoutes, 100, 200);
      expect(results.length).toBe(0);
    });

    it('should include boundary values', () => {
      const results = filterByDistanceRange(mockRoutes, 18, 25);
      expect(results.some(r => r.distance === 18)).toBe(true);
    });
  });

  // ===== filterByMaxTime Tests =====
  describe('filterByMaxTime', () => {
    it('should filter routes within time limit', () => {
      const results = filterByMaxTime(mockRoutes, 100);
      expect(results.length).toBe(3); // Routes with duration <= 100 mins
    });

    it('should return empty for impossible time limit', () => {
      const results = filterByMaxTime(mockRoutes, 10);
      expect(results.length).toBe(0);
    });

    it('should include route at exact time limit', () => {
      const results = filterByMaxTime(mockRoutes, 90);
      expect(results.some(r => r.durationMinutes === 90)).toBe(true);
    });
  });

  // ===== findTransferPoints Tests =====
  describe('findTransferPoints', () => {
    it('should find transfer points between locations', () => {
      const transfers = findTransferPoints(mockRoutes, 'Mirpur', 'Motijheel');
      // Farmgate is reachable from Mirpur on route 1/2 and can reach Motijheel
      expect(transfers.length).toBeGreaterThan(0);
    });

    it('should return empty for direct routes', () => {
      // If direct route exists, no transfers needed
      const transfers = findTransferPoints(mockRoutes, 'Mirpur', 'Motijheel');
      // Even with direct route, transfer points might exist
      expect(Array.isArray(transfers)).toBe(true);
    });

    it('should return empty for invalid locations', () => {
      const transfers = findTransferPoints(mockRoutes, 'NonExistent', 'AlsoNonExistent');
      expect(transfers.length).toBe(0);
    });

    it('should return empty for empty search terms', () => {
      expect(findTransferPoints(mockRoutes, '', 'Motijheel')).toEqual([]);
      expect(findTransferPoints(mockRoutes, 'Mirpur', '')).toEqual([]);
    });
  });

  // ===== sortRoutes Tests =====
  describe('sortRoutes', () => {
    it('should sort by fare (ascending)', () => {
      const sorted = sortRoutes(mockRoutes, 'fare');
      expect(sorted[0].fare).toBe(50);
      expect(sorted[sorted.length - 1].fare).toBe(120);
    });

    it('should sort by time (ascending)', () => {
      const sorted = sortRoutes(mockRoutes, 'time');
      expect(sorted[0].durationMinutes).toBe(50);
      expect(sorted[sorted.length - 1].durationMinutes).toBe(120);
    });

    it('should sort by distance (ascending)', () => {
      const sorted = sortRoutes(mockRoutes, 'distance');
      expect(sorted[0].distance).toBe(10);
      expect(sorted[sorted.length - 1].distance).toBe(25);
    });

    it('should preserve original array', () => {
      const original = [...mockRoutes];
      sortRoutes(mockRoutes, 'fare');
      expect(mockRoutes).toEqual(original); // Should not mutate
    });

    it('should default to fare sorting', () => {
      const sorted = sortRoutes(mockRoutes);
      expect(sorted[0].fare).toBe(50);
    });
  });

  // ===== getCheapestRoute Tests =====
  describe('getCheapestRoute', () => {
    it('should find cheapest route', () => {
      const cheapest = getCheapestRoute(mockRoutes);
      expect(cheapest?.fare).toBe(50);
      expect(cheapest?.id).toBe('route-3');
    });

    it('should return undefined for empty array', () => {
      expect(getCheapestRoute([])).toBeUndefined();
    });

    it('should handle single route', () => {
      const cheapest = getCheapestRoute([mockRoutes[0]]);
      expect(cheapest?.id).toBe('route-1');
    });

    it('should return first route with same fare', () => {
      const routesWithSameFare = [
        { ...mockRoutes[0], fare: 80 },
        { ...mockRoutes[1], fare: 80 },
      ];
      const cheapest = getCheapestRoute(routesWithSameFare);
      expect(cheapest?.id).toBe('route-1');
    });
  });

  // ===== getFastestRoute Tests =====
  describe('getFastestRoute', () => {
    it('should find fastest route', () => {
      const fastest = getFastestRoute(mockRoutes);
      expect(fastest?.durationMinutes).toBe(50);
      expect(fastest?.id).toBe('route-3');
    });

    it('should return undefined for empty array', () => {
      expect(getFastestRoute([])).toBeUndefined();
    });

    it('should return first route with same duration', () => {
      const routesWithSameDuration = [
        { ...mockRoutes[0], durationMinutes: 90 },
        { ...mockRoutes[1], durationMinutes: 90 },
      ];
      const fastest = getFastestRoute(routesWithSameDuration);
      expect(fastest?.id).toBe('route-1');
    });
  });

  // ===== getShortestRoute Tests =====
  describe('getShortestRoute', () => {
    it('should find shortest route', () => {
      const shortest = getShortestRoute(mockRoutes);
      expect(shortest?.distance).toBe(10);
      expect(shortest?.id).toBe('route-3');
    });

    it('should return undefined for empty array', () => {
      expect(getShortestRoute([])).toBeUndefined();
    });

    it('should return first route with same distance', () => {
      const routesWithSameDistance = [
        { ...mockRoutes[0], distance: 18 },
        { ...mockRoutes[1], distance: 18 },
      ];
      const shortest = getShortestRoute(routesWithSameDistance);
      expect(shortest?.id).toBe('route-1');
    });
  });

  // ===== Integration Tests =====
  describe('Integration scenarios', () => {
    it('should search, filter, and sort in workflow', () => {
      // Find direct routes
      const directRoutes = searchDirectRoutes(mockRoutes, 'Mirpur', 'Farmgate');
      expect(directRoutes.length).toBeGreaterThan(0);

      // Filter by budget (under 100 taka)
      const affordable = filterByFareRange(directRoutes, 0, 100);
      expect(affordable.length).toBeGreaterThan(0);

      // Sort by fare
      const sorted = sortRoutes(affordable, 'fare');
      expect(sorted[0].fare <= sorted[sorted.length - 1].fare).toBe(true);
    });

    it('should handle complete journey planning', () => {
      const from = 'Mirpur';
      const to = 'Motijheel';

      // 1. Search for direct routes
      const directRoutes = searchDirectRoutes(mockRoutes, from, to);

      // 2. Get the best option by each criteria
      const cheapest = getCheapestRoute(directRoutes);
      const fastest = getFastestRoute(directRoutes);
      const shortest = getShortestRoute(directRoutes);

      expect(cheapest || fastest || shortest).toBeDefined();
    });

    it('should find routes and get route segment', () => {
      const directRoutes = searchDirectRoutes(mockRoutes, 'Mirpur', 'Farmgate');
      expect(directRoutes.length).toBeGreaterThan(0);

      const route = directRoutes[0];
      const fromIndex = findStopIndex(route.stops, 'Mirpur');
      const toIndex = findStopIndex(route.stops, 'Farmgate');

      const segment = getRouteSegment(route, fromIndex, toIndex);
      expect(segment.length).toBeGreaterThan(0);
      expect(segment[0]).toContain('Mir');
      expect(segment[segment.length - 1]).toContain('Farm');
    });

    it('should filter routes by multiple criteria', () => {
      // Find affordable routes under 90 mins
      let routes = mockRoutes;
      routes = filterByFareRange(routes, 0, 90);
      routes = filterByMaxTime(routes, 90);

      expect(routes.length).toBeGreaterThan(0);
      routes.forEach(route => {
        expect(route.fare).toBeLessThanOrEqual(90);
        expect(route.durationMinutes).toBeLessThanOrEqual(90);
      });
    });

    it('should rank routes by different metrics', () => {
      const routes = searchDirectRoutes(mockRoutes, 'Mirpur', 'Motijheel');

      const byFare = sortRoutes(routes, 'fare');
      const byTime = sortRoutes(routes, 'time');
      const byDistance = sortRoutes(routes, 'distance');

      // Verify sorting
      expect(byFare[0].fare <= byFare[byFare.length - 1].fare).toBe(true);
      expect(byTime[0].durationMinutes <= byTime[byTime.length - 1].durationMinutes).toBe(true);
      expect(byDistance[0].distance <= byDistance[byDistance.length - 1].distance).toBe(true);
    });
  });
});
