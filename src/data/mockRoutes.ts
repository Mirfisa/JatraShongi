import busData from './data.json';
import { LOCATION_COORDINATES } from './locationCoordinates';

export interface BusRoute {
  id: string;
  name: string;
  company: string;
  startLocation: string;
  endLocation: string;
  stops: string[];
  fare: number;
  distance: number;
  serviceType: string;
  image?: string;
  path: [number, number][];
}

// Helper to parse route string: "- Stop1 (Bangla) - Stop2 (Bangla)"
const parseRouteStops = (routeString: string): string[] => {
  if (!routeString) return [];
  // Remove leading "- " if present
  const cleanString = routeString.trim().startsWith('-') ? routeString.trim().substring(1) : routeString;

  return cleanString
    .split('-')
    .map(part => {
      // Extract English name part before the opening parenthesis
      const match = part.trim().match(/^([^(]+)/);
      return match ? match[1].trim() : part.trim();
    })
    .filter(stop => stop.length > 0);
};

// Transform the JSON data into our application's format
export const MOCK_ROUTES: BusRoute[] = busData.map((bus, index) => {
  const stops = parseRouteStops(bus.route);
  const startLocation = stops[0] || '';
  const endLocation = stops[stops.length - 1] || '';

  // Mock distance calculation: 1.2 km per stop
  const estimatedDistance = stops.length * 1.2;

  // Fare calculation using rate per km and min fare
  const ratePerKm = (bus as any).rate_per_km || 2.45;
  const minFare = (bus as any).min_fare || 10;
  const calculatedFare = estimatedDistance * ratePerKm;
  const finalFare = Math.max(minFare, calculatedFare);

  // Generate path from stops using mock coordinates
  // Filter out stops that don't have coordinates defined
  const path: [number, number][] = stops
    .map(stop => LOCATION_COORDINATES[stop])
    .filter((coord): coord is [number, number] => coord !== undefined);

  return {
    id: `bus-${index}`,
    name: bus.bus_name,
    company: bus.bus_name,
    startLocation,
    endLocation,
    stops,
    fare: Math.round(finalFare),
    distance: parseFloat(estimatedDistance.toFixed(1)),
    serviceType: bus.service_type,
    // image: bus.image, // data.json does not have image field currently
    path
  };
});


// Extract all unique stops and sort them alphabetically
export const SORTED_LOCATIONS = Array.from(
  new Set(MOCK_ROUTES.flatMap(route => route.stops))
).sort((a, b) => a.localeCompare(b));
