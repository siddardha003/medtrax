// Coordinate utility functions for consistent handling across the application

/**
 * Validates if coordinates are within valid ranges and not default values
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {boolean} - True if coordinates are valid
 */
export const validateCoordinates = (lat, lng) => {
    if (typeof lat !== 'number' || typeof lng !== 'number') {
        return false;
    }
    
    // Check if coordinates are within valid ranges
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        return false;
    }
    
    // Check if coordinates are not zero or null
    if (lat === 0 && lng === 0) {
        return false;
    }
    
    return true;
};

/**
 * Extracts coordinates from different data formats used in the application
 * @param {Object} data - The data object containing location information
 * @returns {Object} - Object with latitude, longitude, and isValid properties
 */
export const extractCoordinates = (data) => {
    if (!data) {
        return { latitude: null, longitude: null, isValid: false };
    }

    let latitude = null;
    let longitude = null;

    // Try different coordinate formats in order of preference
    
    // 1. GeoJSON format: [longitude, latitude]
    if (data.location && data.location.coordinates && Array.isArray(data.location.coordinates)) {
        longitude = parseFloat(data.location.coordinates[0]);
        latitude = parseFloat(data.location.coordinates[1]);
    } 
    // 2. Direct lat/lng fields in location object
    else if (data.location && data.location.latitude && data.location.longitude) {
        latitude = parseFloat(data.location.latitude);
        longitude = parseFloat(data.location.longitude);
    } 
    // 3. Direct lat/lng properties
    else if (data.latitude && data.longitude) {
        latitude = parseFloat(data.latitude);
        longitude = parseFloat(data.longitude);
    } 
    // 4. Selected medical shop coordinates
    else if (data.selectedMedicalshop && data.selectedMedicalshop.latitude && data.selectedMedicalshop.longitude) {
        latitude = parseFloat(data.selectedMedicalshop.latitude);
        longitude = parseFloat(data.selectedMedicalshop.longitude);
    }

    // Validate the extracted coordinates
    if (validateCoordinates(latitude, longitude)) {
        return { latitude, longitude, isValid: true };
    }

    return { latitude: null, longitude: null, isValid: false };
};

/**
 * Formats coordinates for display
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {number} precision - Number of decimal places (default: 6)
 * @returns {string} - Formatted coordinate string
 */
export const formatCoordinates = (lat, lng, precision = 6) => {
    if (!validateCoordinates(lat, lng)) {
        return 'Invalid coordinates';
    }
    return `${lat.toFixed(precision)}, ${lng.toFixed(precision)}`;
};

/**
 * Creates a Google Maps directions link
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {string} name - Location name (optional)
 * @returns {string} - Google Maps URL
 */
export const createDirectionsLink = (lat, lng, name = '') => {
    if (!validateCoordinates(lat, lng)) {
        return 'https://maps.google.com';
    }
    
    const query = name ? `${name}@${lat},${lng}` : `${lat},${lng}`;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
};

/**
 * Calculates distance between two coordinates using Haversine formula
 * @param {number} lat1 - First latitude
 * @param {number} lng1 - First longitude
 * @param {number} lat2 - Second latitude
 * @param {number} lng2 - Second longitude
 * @returns {number} - Distance in kilometers
 */
export const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
};

/**
 * Checks if coordinates are within a certain radius of a center point
 * @param {number} centerLat - Center latitude
 * @param {number} centerLng - Center longitude
 * @param {number} lat - Point latitude
 * @param {number} lng - Point longitude
 * @param {number} radiusKm - Radius in kilometers
 * @returns {boolean} - True if point is within radius
 */
export const isWithinRadius = (centerLat, centerLng, lat, lng, radiusKm) => {
    const distance = calculateDistance(centerLat, centerLng, lat, lng);
    return distance <= radiusKm;
}; 