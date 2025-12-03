/**
 * @module MapComponent
 * Interactive map display using Leaflet for showing bus routes and stops
 * @remarks
 * Displays TileLayer base map, markers for locations/stops, and polylines for routes.
 */

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

/**
 * Props for MapComponent
 * @typedef {Object} MapProps
 * @property {[number, number]} [center=[23.8103, 90.4125]] - Map center coordinates [lat, lng]
 * @property {number} [zoom=12] - Initial zoom level
 * @property {Array<{position: [number, number], popup?: string}>} [markers] - Location markers
 * @property {[number, number][]} [routePath] - Coordinates for route line
 * @property {Array<{name: string, position: [number, number]}>} [stops] - Bus stops list
 */
interface MapProps {
    center?: [number, number];
    zoom?: number;
    markers?: Array<{
        position: [number, number];
        popup?: string;
    }>;
    routePath?: [number, number][];
    stops?: Array<{
        name: string;
        position: [number, number];
    }>;
}

/**
 * Helper component that auto-centers map to show entire route
 * @component
 * @param {Object} props - Component props
 * @param {[number, number][]} props.routePath - Route coordinates to fit
 * @returns {null} Helper component (no visual output)
 * @internal
 */
const MapUpdater: React.FC<{ routePath: [number, number][] }> = ({ routePath }) => {
    const map = useMap();

    // Fit map bounds to show entire route
    useEffect(() => {
        if (routePath.length > 0) {
            const bounds = L.latLngBounds(routePath);
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [routePath, map]);

    return null;
};

const MapComponent: React.FC<MapProps> = ({
    center = [23.8103, 90.4125], // Default to Dhaka center
    zoom = 13,
    markers = [],
    routePath = [],
    stops = []
}) => {
    return (
        <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
            {/* Base map from OpenStreetMap */}
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Show general markers */}
            {markers.map((marker, index) => (
                <Marker key={`marker-${index}`} position={marker.position}>
                    {marker.popup && <Popup>{marker.popup}</Popup>}
                </Marker>
            ))}

            {/* Show bus stops as markers */}
            {stops.map((stop, index) => (
                <Marker key={`stop-${index}`} position={stop.position}>
                    <Popup>{stop.name}</Popup>
                </Marker>
            ))}

            {/* Draw route line and auto-fit map */}
            {routePath.length > 0 && (
                <>
                    <Polyline positions={routePath} color="blue" weight={5} opacity={0.7} />
                    <MapUpdater routePath={routePath} />
                </>
            )}
        </MapContainer>
    );
};

export default MapComponent;
