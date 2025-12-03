/**
 * Route Search Utilities
 * Handles searching and filtering bus routes between locations
 */

export interface SearchRoute {
  id: string;
  name: string;
  stops: string[];
  fare: number;
  distance: number;
  durationMinutes: number;
}

export interface SearchResult {
  type: 'direct' | 'connecting';
  routes: SearchRoute[];
  totalFare: number;
  totalDistance: number;
  totalDurationMinutes: number;
  totalStops: number;
  transferPoint?: string;
}

/**
 * Find matching stops in a route
 * @param stops - Array of stops in the route
 * @param searchTerm - Location to search for (case-insensitive)
 * @returns Index of matching stop, or -1 if not found
 */
export const findStopIndex = (stops: string[], searchTerm: string): number => {
  if (!searchTerm) return -1;
  const normalized = searchTerm.toLowerCase();

  // Try exact match first
  let index = stops.findIndex(stop => stop.toLowerCase() === normalized);
  if (index !== -1) return index;

  // Fallback to partial match
  return stops.findIndex(stop => stop.toLowerCase().includes(normalized));
};

/**
 * Search for direct routes between two locations
 * @param routes - All available routes
 * @param from - Starting location
 * @param to - Destination location
 * @returns Array of direct routes connecting the two locations
 */
export const searchDirectRoutes = (
  routes: SearchRoute[],
  from: string,
  to: string
): SearchRoute[] => {
  if (!from || !to) return [];

  const normalizedFrom = from.toLowerCase();
  const normalizedTo = to.toLowerCase();

  return routes.filter(route => {
    const fromStop = findStopIndex(route.stops, normalizedFrom);
    const toStop = findStopIndex(route.stops, normalizedTo);

    // Both locations must be on the route and be different
    return fromStop !== -1 && toStop !== -1 && fromStop !== toStop;
  });
};

/**
 * Calculate segment between two stops on a route
 * @param route - Bus route
 * @param fromIndex - Starting stop index
 * @param toIndex - Destination stop index
 * @returns Segment stops in correct direction
 */
export const getRouteSegment = (route: SearchRoute, fromIndex: number, toIndex: number): string[] => {
  if (fromIndex === toIndex) return [];

  if (fromIndex < toIndex) {
    // Forward direction
    return route.stops.slice(fromIndex, toIndex + 1);
  } else {
    // Reverse direction
    return route.stops.slice(toIndex, fromIndex + 1).reverse();
  }
};

/**
 * Calculate total fare for a route segment
 * @param distance - Distance in kilometers
 * @param ratePerKm - Rate per kilometer (default 2.45)
 * @param minFare - Minimum fare (default 10)
 * @returns Calculated fare
 */
export const calculateSegmentFare = (
  distance: number,
  ratePerKm: number = 2.45,
  minFare: number = 10
): number => {
  const calculated = distance * ratePerKm;
  return Math.max(minFare, Math.round(calculated));
};

/**
 * Estimate distance based on number of stops
 * @param stopCount - Number of stops
 * @param distancePerStop - Distance per stop in km (default 1.2)
 * @returns Estimated distance
 */
export const estimateDistance = (stopCount: number, distancePerStop: number = 1.2): number => {
  return parseFloat((stopCount * distancePerStop).toFixed(1));
};

/**
 * Filter routes by fare range
 * @param routes - Routes to filter
 * @param minFare - Minimum fare (inclusive)
 * @param maxFare - Maximum fare (inclusive)
 * @returns Filtered routes
 */
export const filterByFareRange = (
  routes: SearchRoute[],
  minFare: number,
  maxFare: number
): SearchRoute[] => {
  return routes.filter(route => route.fare >= minFare && route.fare <= maxFare);
};

/**
 * Filter routes by distance range
 * @param routes - Routes to filter
 * @param minDistance - Minimum distance in km (inclusive)
 * @param maxDistance - Maximum distance in km (inclusive)
 * @returns Filtered routes
 */
export const filterByDistanceRange = (
  routes: SearchRoute[],
  minDistance: number,
  maxDistance: number
): SearchRoute[] => {
  return routes.filter(route => route.distance >= minDistance && route.distance <= maxDistance);
};

/**
 * Filter routes by maximum time
 * @param routes - Routes to filter
 * @param maxDuration - Maximum duration in minutes
 * @returns Filtered routes within time limit
 */
export const filterByMaxTime = (
  routes: SearchRoute[],
  maxDuration: number
): SearchRoute[] => {
  return routes.filter(route => route.durationMinutes <= maxDuration);
};

/**
 * Get all unique transfer points between two locations
 * @param routes - All available routes
 * @param from - Starting location
 * @param to - Destination location
 * @returns List of stops that can be transfer points
 */
export const findTransferPoints = (
  routes: SearchRoute[],
  from: string,
  to: string
): string[] => {
  if (!from || !to) return [];

  const normalizedFrom = from.toLowerCase();
  const normalizedTo = to.toLowerCase();
  const transferPoints = new Set<string>();

  // Find all stops that are reachable from 'from'
  const fromStops = new Set<string>();
  for (const route of routes) {
    const fromIndex = findStopIndex(route.stops, normalizedFrom);
    if (fromIndex !== -1) {
      // Add all stops after 'from' on this route
      for (let i = fromIndex + 1; i < route.stops.length; i++) {
        fromStops.add(route.stops[i].toLowerCase());
      }
    }
  }

  // Find stops that can reach 'to'
  for (const route of routes) {
    const toIndex = findStopIndex(route.stops, normalizedTo);
    if (toIndex !== -1) {
      // Check if any stops before 'to' are reachable from 'from'
      for (let i = 0; i < toIndex; i++) {
        if (fromStops.has(route.stops[i].toLowerCase())) {
          transferPoints.add(route.stops[i]);
        }
      }
    }
  }

  return Array.from(transferPoints);
};

/**
 * Sort routes by specified criteria
 * @param routes - Routes to sort
 * @param sortBy - Sort criteria: 'fare' | 'time' | 'distance'
 * @returns Sorted routes
 */
export const sortRoutes = (
  routes: SearchRoute[],
  sortBy: 'fare' | 'time' | 'distance' = 'fare'
): SearchRoute[] => {
  const sorted = [...routes];

  switch (sortBy) {
    case 'fare':
      return sorted.sort((a, b) => a.fare - b.fare);
    case 'time':
      return sorted.sort((a, b) => a.durationMinutes - b.durationMinutes);
    case 'distance':
      return sorted.sort((a, b) => a.distance - b.distance);
    default:
      return sorted;
  }
};

/**
 * Get the best route by fare
 * @param routes - Routes to compare
 * @returns Cheapest route or undefined if empty
 */
export const getCheapestRoute = (routes: SearchRoute[]): SearchRoute | undefined => {
  if (routes.length === 0) return undefined;
  return routes.reduce((min, current) => (current.fare < min.fare ? current : min));
};

/**
 * Get the best route by time
 * @param routes - Routes to compare
 * @returns Fastest route or undefined if empty
 */
export const getFastestRoute = (routes: SearchRoute[]): SearchRoute | undefined => {
  if (routes.length === 0) return undefined;
  return routes.reduce((min, current) => 
    (current.durationMinutes < min.durationMinutes ? current : min)
  );
};

/**
 * Get the best route by distance
 * @param routes - Routes to compare
 * @returns Shortest route or undefined if empty
 */
export const getShortestRoute = (routes: SearchRoute[]): SearchRoute | undefined => {
  if (routes.length === 0) return undefined;
  return routes.reduce((min, current) => (current.distance < min.distance ? current : min));
};
