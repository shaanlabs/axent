/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
export function calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
}

function toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
}

/**
 * Format distance for display
 */
export function formatDistance(distanceKm: number): string {
    if (distanceKm < 1) {
        return `${Math.round(distanceKm * 1000)} m`;
    }
    return `${distanceKm.toFixed(1)} km`;
}

/**
 * Get user's current location using browser geolocation API
 */
export function getCurrentLocation(): Promise<{ lat: number; lng: number }> {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by your browser'));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            },
            (error) => {
                reject(error);
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0,
            }
        );
    });
}

/**
 * Mock city coordinates - In production, use Google Maps Geocoding API
 * Focus on Karnataka and major Indian cities
 */
export const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
    // Karnataka - Coastal Region
    'Bhatkal': { lat: 13.9857, lng: 74.5567 },
    'Mangalore': { lat: 12.9141, lng: 74.8560 },
    'Udupi': { lat: 13.3409, lng: 74.7421 },
    'Kundapura': { lat: 13.6250, lng: 74.6892 },
    'Karwar': { lat: 14.8138, lng: 74.1297 },

    // Karnataka - Major Cities
    'Bangalore': { lat: 12.9716, lng: 77.5946 },
    'Mysore': { lat: 12.2958, lng: 76.6394 },
    'Hubli': { lat: 15.3647, lng: 75.1240 },
    'Belgaum': { lat: 15.8497, lng: 74.4977 },
    'Davangere': { lat: 14.4644, lng: 75.9218 },

    // Major Indian Cities
    'Mumbai': { lat: 19.0760, lng: 72.8777 },
    'Delhi': { lat: 28.6139, lng: 77.2090 },
    'Pune': { lat: 18.5204, lng: 73.8567 },
    'Hyderabad': { lat: 17.3850, lng: 78.4867 },
    'Chennai': { lat: 13.0827, lng: 80.2707 },
    'Kochi': { lat: 9.9312, lng: 76.2673 },
};

/**
 * Get coordinates for a city (mock - replace with geocoding API)
 */
export function getCityCoordinates(city: string): { lat: number; lng: number } | null {
    return CITY_COORDINATES[city] || null;
}

/**
 * Sort items by distance from a reference location
 */
export function sortByDistance<T extends { location: { coordinates: { lat: number; lng: number } } }>(
    items: T[],
    referenceLocation: { lat: number; lng: number }
): T[] {
    return items.sort((a, b) => {
        const distanceA = calculateDistance(
            referenceLocation.lat,
            referenceLocation.lng,
            a.location.coordinates.lat,
            a.location.coordinates.lng
        );
        const distanceB = calculateDistance(
            referenceLocation.lat,
            referenceLocation.lng,
            b.location.coordinates.lat,
            b.location.coordinates.lng
        );
        return distanceA - distanceB;
    });
}
