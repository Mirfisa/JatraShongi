import { describe, it, expect } from 'vitest';
import {
  calculateFare,
  calculateDistanceFromStops,
  calculateTravelTime,
  formatTravelTime,
  findShortestRoute,
  findCheapestRoute,
  findFastestRoute,
} from './fareCalculator';

describe('Fare Calculator Utilities', () => {
  // ===== calculateFare Tests =====
  describe('calculateFare', () => {
    it('should calculate fare with default parameters', () => {
      const fare = calculateFare(10); // 10 km * 2.45 per km = 24.5
      expect(fare).toBe(24.5);
    });

    it('should apply minimum fare when calculated fare is lower', () => {
      const fare = calculateFare(2, 2.45, 10); // 2 * 2.45 = 4.9, but min is 10
      expect(fare).toBe(10);
    });

    it('should use calculated fare when it exceeds minimum', () => {
      const fare = calculateFare(10, 2.45, 10); // 10 * 2.45 = 24.5
      expect(fare).toBe(24.5);
    });

    it('should handle custom rate per km', () => {
      const fare = calculateFare(5, 3.0, 10); // 5 * 3.0 = 15
      expect(fare).toBe(15);
    });

    it('should return minimum fare for zero distance', () => {
      const fare = calculateFare(0, 2.45, 10);
      expect(fare).toBe(10);
    });

    it('should return minimum fare for negative distance', () => {
      const fare = calculateFare(-5, 2.45, 10);
      expect(fare).toBe(10);
    });

    it('should handle custom minimum fare', () => {
      const fare = calculateFare(1, 2.45, 20); // 1 * 2.45 = 2.45, but min is 20
      expect(fare).toBe(20);
    });

    it('should calculate fare with real-world values', () => {
      // 8.5 km at 2.45 per km = 20.825
      const fare = calculateFare(8.5, 2.45, 10);
      expect(fare).toBeCloseTo(20.825, 5);
    });

    it('should handle very small distances', () => {
      const fare = calculateFare(0.1, 2.45, 10); // 0.1 * 2.45 = 0.245
      expect(fare).toBe(10); // Should return min fare
    });

    it('should handle very large distances', () => {
      const fare = calculateFare(100, 2.45, 10); // 100 * 2.45 = 245
      expect(fare).toBeCloseTo(245, 2);
    });
  });

  // ===== calculateDistanceFromStops Tests =====
  describe('calculateDistanceFromStops', () => {
    it('should calculate distance with default distance per stop', () => {
      // 5 stops * 1.2 km per stop = 6 km
      const distance = calculateDistanceFromStops(5);
      expect(distance).toBe(6);
    });

    it('should calculate distance with custom distance per stop', () => {
      // 5 stops * 2 km per stop = 10 km
      const distance = calculateDistanceFromStops(5, 2);
      expect(distance).toBe(10);
    });

    it('should return 0 for zero stops', () => {
      const distance = calculateDistanceFromStops(0);
      expect(distance).toBe(0);
    });

    it('should return 0 for negative stop count', () => {
      const distance = calculateDistanceFromStops(-5);
      expect(distance).toBe(0);
    });

    it('should handle single stop', () => {
      // 1 stop * 1.2 km = 1.2 km
      const distance = calculateDistanceFromStops(1);
      expect(distance).toBe(1.2);
    });

    it('should handle large stop counts', () => {
      // 50 stops * 1.2 km per stop = 60 km
      const distance = calculateDistanceFromStops(50);
      expect(distance).toBe(60);
    });

    it('should calculate distance with fractional distance per stop', () => {
      // 10 stops * 0.8 km per stop = 8 km
      const distance = calculateDistanceFromStops(10, 0.8);
      expect(distance).toBe(8);
    });
  });

  // ===== calculateTravelTime Tests =====
  describe('calculateTravelTime', () => {
    it('should calculate travel time with default minutes per stop', () => {
      // 5 stops * 5 mins per stop = 25 mins
      const time = calculateTravelTime(5);
      expect(time).toBe(25);
    });

    it('should calculate travel time with custom minutes per stop', () => {
      // 5 stops * 10 mins per stop = 50 mins
      const time = calculateTravelTime(5, 10);
      expect(time).toBe(50);
    });

    it('should return 0 for zero stops', () => {
      const time = calculateTravelTime(0);
      expect(time).toBe(0);
    });

    it('should return 0 for negative stop count', () => {
      const time = calculateTravelTime(-5);
      expect(time).toBe(0);
    });

    it('should handle single stop', () => {
      // 1 stop * 5 mins = 5 mins
      const time = calculateTravelTime(1);
      expect(time).toBe(5);
    });

    it('should handle large stop counts', () => {
      // 50 stops * 5 mins per stop = 250 mins
      const time = calculateTravelTime(50);
      expect(time).toBe(250);
    });
  });

  // ===== formatTravelTime Tests =====
  describe('formatTravelTime', () => {
    it('should format minutes only', () => {
      expect(formatTravelTime(45)).toBe('45 mins');
    });

    it('should format hours and minutes', () => {
      // 90 mins = 1 hour 30 mins
      expect(formatTravelTime(90)).toBe('1 hr 30 mins');
    });

    it('should format hours only', () => {
      // 120 mins = 2 hours
      expect(formatTravelTime(120)).toBe('2 hr');
    });

    it('should handle zero minutes', () => {
      expect(formatTravelTime(0)).toBe('0 mins');
    });

    it('should handle negative minutes', () => {
      expect(formatTravelTime(-30)).toBe('0 mins');
    });

    it('should format single hour and minutes', () => {
      // 75 mins = 1 hour 15 mins
      expect(formatTravelTime(75)).toBe('1 hr 15 mins');
    });

    it('should format large time durations', () => {
      // 300 mins = 5 hours
      expect(formatTravelTime(300)).toBe('5 hr');
    });

    it('should handle 1 minute', () => {
      expect(formatTravelTime(1)).toBe('1 mins');
    });

    it('should format 59 minutes', () => {
      expect(formatTravelTime(59)).toBe('59 mins');
    });

    it('should format 119 minutes correctly', () => {
      // 119 mins = 1 hour 59 mins
      expect(formatTravelTime(119)).toBe('1 hr 59 mins');
    });
  });

  // ===== findShortestRoute Tests =====
  describe('findShortestRoute', () => {
    it('should find route with shortest distance', () => {
      const routes = [
        { id: 1, distance: 10 },
        { id: 2, distance: 5 },
        { id: 3, distance: 15 },
      ];
      const shortest = findShortestRoute(routes);
      expect(shortest?.id).toBe(2);
      expect(shortest?.distance).toBe(5);
    });

    it('should return undefined for empty array', () => {
      const shortest = findShortestRoute([]);
      expect(shortest).toBeUndefined();
    });

    it('should return single route', () => {
      const routes = [{ id: 1, distance: 10 }];
      const shortest = findShortestRoute(routes);
      expect(shortest?.id).toBe(1);
    });

    it('should return first route if all distances are equal', () => {
      const routes = [
        { id: 1, distance: 10 },
        { id: 2, distance: 10 },
        { id: 3, distance: 10 },
      ];
      const shortest = findShortestRoute(routes);
      expect(shortest?.id).toBe(1);
    });

    it('should handle negative distances', () => {
      const routes = [
        { id: 1, distance: 10 },
        { id: 2, distance: -5 },
        { id: 3, distance: 5 },
      ];
      const shortest = findShortestRoute(routes);
      expect(shortest?.id).toBe(2); // -5 is the smallest
    });

    it('should handle zero distance', () => {
      const routes = [
        { id: 1, distance: 10 },
        { id: 2, distance: 0 },
        { id: 3, distance: 5 },
      ];
      const shortest = findShortestRoute(routes);
      expect(shortest?.id).toBe(2);
    });

    it('should preserve additional properties', () => {
      const routes = [
        { id: 1, distance: 10, name: 'Route 1', fare: 50 },
        { id: 2, distance: 5, name: 'Route 2', fare: 30 },
      ];
      const shortest = findShortestRoute(routes) as any;
      expect(shortest.name).toBe('Route 2');
      expect(shortest.fare).toBe(30);
    });
  });

  // ===== findCheapestRoute Tests =====
  describe('findCheapestRoute', () => {
    it('should find route with lowest fare', () => {
      const routes = [
        { id: 1, fare: 100 },
        { id: 2, fare: 50 },
        { id: 3, fare: 75 },
      ];
      const cheapest = findCheapestRoute(routes);
      expect(cheapest?.id).toBe(2);
      expect(cheapest?.fare).toBe(50);
    });

    it('should return undefined for empty array', () => {
      const cheapest = findCheapestRoute([]);
      expect(cheapest).toBeUndefined();
    });

    it('should return single route', () => {
      const routes = [{ id: 1, fare: 100 }];
      const cheapest = findCheapestRoute(routes);
      expect(cheapest?.id).toBe(1);
    });

    it('should return first route if all fares are equal', () => {
      const routes = [
        { id: 1, fare: 50 },
        { id: 2, fare: 50 },
        { id: 3, fare: 50 },
      ];
      const cheapest = findCheapestRoute(routes);
      expect(cheapest?.id).toBe(1);
    });

    it('should handle zero fare', () => {
      const routes = [
        { id: 1, fare: 100 },
        { id: 2, fare: 0 },
        { id: 3, fare: 50 },
      ];
      const cheapest = findCheapestRoute(routes);
      expect(cheapest?.id).toBe(2);
    });

    it('should preserve additional properties', () => {
      const routes = [
        { id: 1, fare: 100, name: 'Route 1', distance: 20 },
        { id: 2, fare: 50, name: 'Route 2', distance: 15 },
      ];
      const cheapest = findCheapestRoute(routes) as any;
      expect(cheapest.name).toBe('Route 2');
      expect(cheapest.distance).toBe(15);
    });

    it('should handle decimal fares', () => {
      const routes = [
        { id: 1, fare: 50.5 },
        { id: 2, fare: 50.25 },
        { id: 3, fare: 50.75 },
      ];
      const cheapest = findCheapestRoute(routes);
      expect(cheapest?.id).toBe(2);
      expect(cheapest?.fare).toBe(50.25);
    });
  });

  // ===== findFastestRoute Tests =====
  describe('findFastestRoute', () => {
    it('should find route with shortest duration', () => {
      const routes = [
        { id: 1, durationMinutes: 60 },
        { id: 2, durationMinutes: 30 },
        { id: 3, durationMinutes: 45 },
      ];
      const fastest = findFastestRoute(routes);
      expect(fastest?.id).toBe(2);
      expect(fastest?.durationMinutes).toBe(30);
    });

    it('should return undefined for empty array', () => {
      const fastest = findFastestRoute([]);
      expect(fastest).toBeUndefined();
    });

    it('should return single route', () => {
      const routes = [{ id: 1, durationMinutes: 60 }];
      const fastest = findFastestRoute(routes);
      expect(fastest?.id).toBe(1);
    });

    it('should return first route if all durations are equal', () => {
      const routes = [
        { id: 1, durationMinutes: 30 },
        { id: 2, durationMinutes: 30 },
        { id: 3, durationMinutes: 30 },
      ];
      const fastest = findFastestRoute(routes);
      expect(fastest?.id).toBe(1);
    });

    it('should handle zero duration', () => {
      const routes = [
        { id: 1, durationMinutes: 60 },
        { id: 2, durationMinutes: 0 },
        { id: 3, durationMinutes: 30 },
      ];
      const fastest = findFastestRoute(routes);
      expect(fastest?.id).toBe(2);
    });

    it('should preserve additional properties', () => {
      const routes = [
        { id: 1, durationMinutes: 60, name: 'Route 1', fare: 100 },
        { id: 2, durationMinutes: 30, name: 'Route 2', fare: 50 },
      ];
      const fastest = findFastestRoute(routes) as any;
      expect(fastest.name).toBe('Route 2');
      expect(fastest.fare).toBe(50);
    });

    it('should handle many routes', () => {
      const routes = Array.from({ length: 10 }, (_, i) => ({
        id: i,
        durationMinutes: (i + 1) * 10,
      }));
      const fastest = findFastestRoute(routes);
      expect(fastest?.id).toBe(0);
      expect(fastest?.durationMinutes).toBe(10);
    });
  });

  // ===== Integration Tests =====
  describe('Integration scenarios', () => {
    it('should calculate fare for a complete journey', () => {
      const stops = 8;
      const distance = calculateDistanceFromStops(stops);
      const fare = calculateFare(distance);
      const time = calculateTravelTime(stops);

      expect(distance).toBe(9.6);
      expect(fare).toBe(23.52);
      expect(time).toBe(40);
    });

    it('should find best route from multiple criteria', () => {
      const routes = [
        { id: 1, distance: 10, fare: 100, durationMinutes: 60 },
        { id: 2, distance: 5, fare: 50, durationMinutes: 30 },
        { id: 3, distance: 8, fare: 75, durationMinutes: 45 },
      ];

      const shortest = findShortestRoute(routes);
      const cheapest = findCheapestRoute(routes);
      const fastest = findFastestRoute(routes);

      expect(shortest?.id).toBe(2);
      expect(cheapest?.id).toBe(2);
      expect(fastest?.id).toBe(2);
    });

    it('should compare routes with realistic data', () => {
      const routes = [
        { id: 'A', distance: 12.5, fare: 45, durationMinutes: 75, name: 'Route A' },
        { id: 'B', distance: 15.2, fare: 35, durationMinutes: 85, name: 'Route B' },
        { id: 'C', distance: 10.8, fare: 42, durationMinutes: 68, name: 'Route C' },
      ];

      const shortestRoute = findShortestRoute(routes);
      const cheapestRoute = findCheapestRoute(routes);
      const fastestRoute = findFastestRoute(routes);

      expect((shortestRoute as any).name).toBe('Route C');
      expect((cheapestRoute as any).name).toBe('Route B');
      expect((fastestRoute as any).name).toBe('Route C');
    });
  });
});
