/**
 * Route Service
 * Handles fetching route data from OSRM API
 */

const OSRM_API_BASE = 'https://router.project-osrm.org/route/v1/driving';

export const getRoutePath = async (coordinates: [number, number][]): Promise<[number, number][]> => {
    if (coordinates.length < 2) return [];

    try {
        // Format coordinates for OSRM: "lon,lat;lon,lat"
        const coordinatesString = coordinates
            .map(coord => `${coord[1]},${coord[0]}`)
            .join(';');

        const url = `${OSRM_API_BASE}/${coordinatesString}?overview=full&geometries=geojson`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
            // OSRM returns [lon, lat], Leaflet needs [lat, lon]
            const coordinates = data.routes[0].geometry.coordinates;
            return coordinates.map((coord: [number, number]) => [coord[1], coord[0]]);
        }

        console.warn('OSRM API returned no routes or error:', data);
        return coordinates; // Fallback to straight lines
    } catch (error) {
        console.error('Error fetching route path:', error);
        return coordinates; // Fallback to straight lines
    }
};

export const getRouteDistance = async (coordinates: [number, number][]): Promise<number> => {
    if (coordinates.length < 2) return 0;

    try {
        // Format coordinates for OSRM: "lon,lat;lon,lat"
        const coordinatesString = coordinates
            .map(coord => `${coord[1]},${coord[0]}`)
            .join(';');

        const url = `${OSRM_API_BASE}/${coordinatesString}?overview=false`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
            // OSRM returns distance in meters, convert to km
            return data.routes[0].distance / 1000;
        }

        console.warn('OSRM API returned no routes or error for distance:', data);
        return 0;
    } catch (error) {
        console.error('Error fetching route distance:', error);
        return 0;
    }
};
