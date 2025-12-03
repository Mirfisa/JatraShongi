/**
 * Fare Calculator Utilities
 * Handles fare and distance calculations for bus routes
 */

/**
 * Calculate fare based on distance, rate per km, and minimum fare
 * @param distance - Distance in kilometers
 * @param ratePerKm - Rate per kilometer
 * @param minFare - Minimum fare amount
 * @returns Calculated fare (at least minFare)
 */
export const calculateFare = (distance: number, ratePerKm: number = 2.45, minFare: number = 10): number => {
  if (distance < 0) return minFare;
  const calculatedFare = distance * ratePerKm;
  return Math.max(minFare, calculatedFare);
};

/**
 * Calculate distance based on number of stops
 * @param stopCount - Number of stops in the route
 * @param distancePerStop - Distance per stop in kilometers (default 1.2)
 * @returns Estimated distance in kilometers
 */
export const calculateDistanceFromStops = (stopCount: number, distancePerStop: number = 1.2): number => {
  if (stopCount < 0) return 0;
  return stopCount * distancePerStop;
};

/**
 * Calculate estimated travel time based on number of stops
 * @param stopCount - Number of stops in the route
 * @param minutesPerStop - Minutes per stop (default 5)
 * @returns Estimated travel time in minutes
 */
export const calculateTravelTime = (stopCount: number, minutesPerStop: number = 5): number => {
  if (stopCount < 0) return 0;
  return stopCount * minutesPerStop;
};

/**
 * Format travel time into a readable string
 * @param minutes - Total minutes
 * @returns Formatted time string (e.g., "1 hr 30 mins", "45 mins")
 */
export const formatTravelTime = (minutes: number): string => {
  if (minutes <= 0) return '0 mins';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 0) {
    return mins > 0 ? `${hours} hr ${mins} mins` : `${hours} hr`;
  }
  return `${mins} mins`;
};

/**
 * Calculate shortest route by distance
 * Compares routes and returns the one with minimum distance
 * @param routes - Array of routes with distance property
 * @returns Route with shortest distance, or undefined if empty array
 */
export const findShortestRoute = <T extends { distance: number }>(routes: T[]): T | undefined => {
  if (routes.length === 0) return undefined;
  return routes.reduce((shortest, current) => 
    current.distance < shortest.distance ? current : shortest
  );
};

/**
 * Calculate cheapest route by fare
 * Compares routes and returns the one with minimum fare
 * @param routes - Array of routes with fare property
 * @returns Route with cheapest fare, or undefined if empty array
 */
export const findCheapestRoute = <T extends { fare: number }>(routes: T[]): T | undefined => {
  if (routes.length === 0) return undefined;
  return routes.reduce((cheapest, current) => 
    current.fare < cheapest.fare ? current : cheapest
  );
};

/**
 * Calculate fastest route by duration
 * Compares routes and returns the one with minimum travel time
 * @param routes - Array of routes with durationMinutes property
 * @returns Route with fastest travel time, or undefined if empty array
 */
export const findFastestRoute = <T extends { durationMinutes: number }>(routes: T[]): T | undefined => {
  if (routes.length === 0) return undefined;
  return routes.reduce((fastest, current) => 
    current.durationMinutes < fastest.durationMinutes ? current : fastest
  );
};
