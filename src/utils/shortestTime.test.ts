import { describe, it, expect } from 'vitest';
import {
  calculateTravelTime,
  formatTravelTime,
  findFastestRoute,
} from './fareCalculator';

/**
 * Unit tests for Shortest Time / Fastest Route
 * Tests travel time calculations and route selection by speed
 */
describe('Shortest Time (Fastest Route) Utilities', () => {
  // ===== calculateTravelTime Tests =====
  describe('calculateTravelTime', () => {
    it('should calculate travel time based on stop count', () => {
      // 10 stops * 5 mins per stop = 50 minutes
      const time = calculateTravelTime(10);
      expect(time).toBe(50);
    });

    it('should handle custom minutes per stop', () => {
      // 8 stops * 3 mins per stop = 24 minutes
      const time = calculateTravelTime(8, 3);
      expect(time).toBe(24);
    });

    it('should return 0 for zero stops', () => {
      expect(calculateTravelTime(0)).toBe(0);
    });

    it('should return 0 for negative stops', () => {
      expect(calculateTravelTime(-10)).toBe(0);
    });

    it('should handle single stop', () => {
      // 1 stop * 5 mins = 5 minutes
      expect(calculateTravelTime(1)).toBe(5);
    });

    it('should calculate time for long routes', () => {
      // 50 stops * 5 mins = 250 minutes (4 hours 10 mins)
      expect(calculateTravelTime(50)).toBe(250);
    });

    it('should handle fractional minutes per stop', () => {
      // 20 stops * 2.5 mins = 50 minutes
      expect(calculateTravelTime(20, 2.5)).toBe(50);
    });

    it('should handle very large stop counts', () => {
      // 100 stops * 5 mins = 500 minutes (8 hours 20 mins)
      expect(calculateTravelTime(100)).toBe(500);
    });
  });

  // ===== formatTravelTime Tests =====
  describe('formatTravelTime', () => {
    it('should format short trips (less than 1 hour)', () => {
      expect(formatTravelTime(30)).toBe('30 mins');
    });

    it('should format medium trips (1-2 hours)', () => {
      // 90 mins = 1 hour 30 mins
      expect(formatTravelTime(90)).toBe('1 hr 30 mins');
    });

    it('should format long trips (2+ hours)', () => {
      // 150 mins = 2 hours 30 mins
      expect(formatTravelTime(150)).toBe('2 hr 30 mins');
    });

    it('should format exact hours', () => {
      // 120 mins = 2 hours
      expect(formatTravelTime(120)).toBe('2 hr');
    });

    it('should handle 1 hour exactly', () => {
      expect(formatTravelTime(60)).toBe('1 hr');
    });

    it('should handle very short trips', () => {
      expect(formatTravelTime(5)).toBe('5 mins');
    });

    it('should handle very long trips', () => {
      // 480 mins = 8 hours
      expect(formatTravelTime(480)).toBe('8 hr');
    });

    it('should handle zero minutes', () => {
      expect(formatTravelTime(0)).toBe('0 mins');
    });

    it('should handle 59 minutes (just under 1 hour)', () => {
      expect(formatTravelTime(59)).toBe('59 mins');
    });

    it('should handle 61 minutes (just over 1 hour)', () => {
      expect(formatTravelTime(61)).toBe('1 hr 1 mins');
    });
  });

  // ===== findFastestRoute Tests =====
  describe('findFastestRoute', () => {
    it('should find route with shortest duration', () => {
      const routes = [
        { id: 'A', name: 'Route A', durationMinutes: 90 },
        { id: 'B', name: 'Route B', durationMinutes: 45 },
        { id: 'C', name: 'Route C', durationMinutes: 120 },
      ];
      const fastest = findFastestRoute(routes);
      expect(fastest?.id).toBe('B');
      expect(fastest?.durationMinutes).toBe(45);
    });

    it('should return undefined for empty array', () => {
      expect(findFastestRoute([])).toBeUndefined();
    });

    it('should handle single route', () => {
      const routes = [{ id: 'A', durationMinutes: 60 }];
      const fastest = findFastestRoute(routes);
      expect(fastest?.id).toBe('A');
    });

    it('should return first route when all durations equal', () => {
      const routes = [
        { id: 'A', durationMinutes: 60 },
        { id: 'B', durationMinutes: 60 },
        { id: 'C', durationMinutes: 60 },
      ];
      const fastest = findFastestRoute(routes);
      expect(fastest?.id).toBe('A');
    });

    it('should handle very fast routes', () => {
      const routes = [
        { id: 'A', durationMinutes: 120 },
        { id: 'B', durationMinutes: 15 }, // Express route
        { id: 'C', durationMinutes: 90 },
      ];
      const fastest = findFastestRoute(routes);
      expect(fastest?.id).toBe('B');
      expect(fastest?.durationMinutes).toBe(15);
    });

    it('should handle very slow routes', () => {
      const routes = [
        { id: 'A', durationMinutes: 480 }, // 8 hours
        { id: 'B', durationMinutes: 300 }, // 5 hours
        { id: 'C', durationMinutes: 600 }, // 10 hours
      ];
      const fastest = findFastestRoute(routes);
      expect(fastest?.id).toBe('B');
    });

    it('should preserve additional route properties', () => {
      const routes = [
        { id: 'A', durationMinutes: 90, fare: 150, distance: 15, company: 'Bus Co A' },
        { id: 'B', durationMinutes: 45, fare: 100, distance: 8, company: 'Bus Co B' },
        { id: 'C', durationMinutes: 60, fare: 120, distance: 10, company: 'Bus Co C' },
      ];
      const fastest = findFastestRoute(routes) as any;
      expect(fastest.company).toBe('Bus Co B');
      expect(fastest.fare).toBe(100);
      expect(fastest.distance).toBe(8);
    });

    it('should compare many routes', () => {
      const routes = Array.from({ length: 20 }, (_, i) => ({
        id: `route-${i}`,
        durationMinutes: (i + 1) * 10,
      }));
      const fastest = findFastestRoute(routes);
      expect(fastest?.id).toBe('route-0');
      expect(fastest?.durationMinutes).toBe(10);
    });

    it('should handle fractional durations', () => {
      const routes = [
        { id: 'A', durationMinutes: 45.5 },
        { id: 'B', durationMinutes: 45.2 },
        { id: 'C', durationMinutes: 45.8 },
      ];
      const fastest = findFastestRoute(routes);
      expect(fastest?.id).toBe('B');
      expect(fastest?.durationMinutes).toBe(45.2);
    });

    it('should handle zero duration edge case', () => {
      const routes = [
        { id: 'A', durationMinutes: 60 },
        { id: 'B', durationMinutes: 0 }, // Instant route (edge case)
        { id: 'C', durationMinutes: 30 },
      ];
      const fastest = findFastestRoute(routes);
      expect(fastest?.id).toBe('B');
      expect(fastest?.durationMinutes).toBe(0);
    });
  });

  // ===== Real-world shortest time scenarios =====
  describe('Real-world shortest time scenarios', () => {
    it('should compare typical Dhaka bus routes', () => {
      const routes = [
        {
          id: 'route-1',
          name: 'Mirpur to Motijheel',
          durationMinutes: 120,
          distance: 18,
          fare: 100,
          stops: 25,
        },
        {
          id: 'route-2',
          name: 'Mirpur to Motijheel (Express)',
          durationMinutes: 60,
          distance: 18,
          fare: 150,
          stops: 8,
        },
        {
          id: 'route-3',
          name: 'Mirpur to Motijheel (Local)',
          durationMinutes: 150,
          distance: 18,
          fare: 80,
          stops: 30,
        },
      ];

      const fastest = findFastestRoute(routes) as any;
      expect(fastest.name).toBe('Mirpur to Motijheel (Express)');
      expect(fastest.durationMinutes).toBe(60);
      expect(fastest.stops).toBe(8); // Express has fewer stops
    });

    it('should calculate fastest time for journey with multiple routes', () => {
      const directRoute = calculateTravelTime(15); // 15 stops
      const expressRoute = calculateTravelTime(8); // 8 stops (express)
      const localRoute = calculateTravelTime(25); // 25 stops (all stops)

      expect(directRoute).toBe(75);
      expect(expressRoute).toBe(40);
      expect(localRoute).toBe(125);

      const routes = [
        { id: 'direct', durationMinutes: directRoute },
        { id: 'express', durationMinutes: expressRoute },
        { id: 'local', durationMinutes: localRoute },
      ];

      const fastest = findFastestRoute(routes);
      expect(fastest?.id).toBe('express');
    });

    it('should format different route durations', () => {
      const shortRoute = calculateTravelTime(6); // 30 mins
      const mediumRoute = calculateTravelTime(18); // 90 mins
      const longRoute = calculateTravelTime(42); // 210 mins

      expect(formatTravelTime(shortRoute)).toBe('30 mins');
      expect(formatTravelTime(mediumRoute)).toBe('1 hr 30 mins');
      expect(formatTravelTime(longRoute)).toBe('3 hr 30 mins');
    });

    it('should find fastest among routes with different stop distributions', () => {
      const routes = [
        // High-frequency stops (frequent stops = slower)
        { id: 'frequent', durationMinutes: calculateTravelTime(40, 5), stops: 40 },
        // Medium frequency
        { id: 'medium', durationMinutes: calculateTravelTime(20, 5), stops: 20 },
        // Low frequency (express = faster)
        { id: 'express', durationMinutes: calculateTravelTime(8, 5), stops: 8 },
      ];

      const fastest = findFastestRoute(routes) as any;
      expect(fastest.id).toBe('express');
      expect(fastest.stops).toBe(8);
    });

    it('should compare peak vs off-peak journey times', () => {
      // Simulating different times of day affecting travel
      const peakHourRoute = calculateTravelTime(15, 6); // 90 mins at peak (6 mins per stop)
      const offPeakRoute = calculateTravelTime(15, 4); // 60 mins off-peak (4 mins per stop)
      const normalRoute = calculateTravelTime(15, 5); // 75 mins normal (5 mins per stop)

      const routes = [
        { id: 'peak', durationMinutes: peakHourRoute },
        { id: 'offpeak', durationMinutes: offPeakRoute },
        { id: 'normal', durationMinutes: normalRoute },
      ];

      const fastest = findFastestRoute(routes);
      expect(fastest?.id).toBe('offpeak');
      expect(fastest?.durationMinutes).toBe(60);
    });
  });

  // ===== Integration tests for shortest time =====
  describe('Integration tests', () => {
    it('should find shortest time and format it', () => {
      const routes = [
        { id: 'A', durationMinutes: 180 }, // 3 hours
        { id: 'B', durationMinutes: 45 }, // 45 mins
        { id: 'C', durationMinutes: 120 }, // 2 hours
      ];

      const fastest = findFastestRoute(routes);
      const formattedTime = formatTravelTime(fastest!.durationMinutes);

      expect(fastest?.id).toBe('B');
      expect(formattedTime).toBe('45 mins');
    });

    it('should calculate and find fastest time in complex scenario', () => {
      // Simulating journey planning with multiple route options
      const route1Stops = 32;
      const route2Stops = 18;
      const route3Stops = 25;

      const routes = [
        {
          id: 'route-1-local',
          name: 'Local Route',
          durationMinutes: calculateTravelTime(route1Stops),
          distance: route1Stops * 1.2,
          fare: 80,
        },
        {
          id: 'route-2-express',
          name: 'Express Route',
          durationMinutes: calculateTravelTime(route2Stops),
          distance: route2Stops * 1.2,
          fare: 120,
        },
        {
          id: 'route-3-semi-express',
          name: 'Semi-Express Route',
          durationMinutes: calculateTravelTime(route3Stops),
          distance: route3Stops * 1.2,
          fare: 100,
        },
      ];

      const fastest = findFastestRoute(routes) as any;
      expect(fastest.name).toBe('Express Route');
      expect(fastest.durationMinutes).toBe(90); // 18 stops * 5 mins
      expect(fastest.id).toBe('route-2-express');
    });

    it('should batch compare routes for fastest option', () => {
      // Testing against multiple route options to find shortest time
      const routeOptions = [
        { id: 'A', durationMinutes: 105, company: 'Bus Co A' },
        { id: 'B', durationMinutes: 95, company: 'Bus Co B' },
        { id: 'C', durationMinutes: 85, company: 'Bus Co C' },
        { id: 'D', durationMinutes: 110, company: 'Bus Co D' },
        { id: 'E', durationMinutes: 75, company: 'Bus Co E' }, // Fastest
      ];

      const fastest = findFastestRoute(routeOptions) as any;
      expect(fastest.id).toBe('E');
      expect(fastest.company).toBe('Bus Co E');
      expect(fastest.durationMinutes).toBe(75);
    });
  });
});
