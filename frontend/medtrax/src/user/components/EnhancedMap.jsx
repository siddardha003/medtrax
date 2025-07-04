import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { extractCoordinates, validateCoordinates } from '../../utils/coordinateUtils';

// Custom Marker Icons
const createCustomIcon = (type = 'default') => {
    const iconUrls = {
        hospital: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
        shop: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
        default: 'https://cdn-icons-png.flaticon.com/512/684/684908.png'
    };

    return new L.Icon({
        iconUrl: iconUrls[type] || iconUrls.default,
        iconSize: [38, 38],
        iconAnchor: [22, 38],
        popupAnchor: [-3, -38],
    });
};

// Component to handle map center updates
const MapUpdater = ({ center }) => {
    const map = useMap();
    
    useEffect(() => {
        if (center && center[0] && center[1]) {
            map.setView(center, map.getZoom());
        }
    }, [center, map]);
    
    return null;
};



const EnhancedMap = ({ 
    data, 
    name, 
    type = 'default',
    height = '500px',
    showCoordinates = true,
    onCoordinateError = null 
}) => {
    const [coordinates, setCoordinates] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (data) {
            const extracted = extractCoordinates(data);
            setCoordinates(extracted);
            
            // Call error callback if coordinates are invalid
            if (!extracted.isValid && onCoordinateError) {
                onCoordinateError('No valid coordinates found for this location');
            }
            
            setIsLoading(false);
        }
    }, [data, onCoordinateError]);

    // Show loading state
    if (isLoading) {
        return (
            <div style={{ 
                height, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                backgroundColor: '#f5f5f5',
                borderRadius: '12px',
                border: '2px solid #e0e0e0'
            }}>
                <div>Loading map...</div>
            </div>
        );
    }

    // Show error state if no valid coordinates
    if (!coordinates || !coordinates.isValid) {
        return (
            <div style={{ 
                height, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                backgroundColor: '#fff3cd',
                borderRadius: '12px',
                border: '2px solid #ffeaa7',
                color: '#856404',
                textAlign: 'center',
                padding: '20px'
            }}>
                <div>
                    <div style={{ fontSize: '24px', marginBottom: '10px' }}>📍</div>
                    <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Location Not Available</div>
                    <div style={{ fontSize: '14px' }}>
                        {name} has not set their location coordinates yet.
                    </div>
                </div>
            </div>
        );
    }

    const center = [coordinates.latitude, coordinates.longitude];
    const customIcon = createCustomIcon(type);

    return (
        <div className="enhanced-map-container" style={{ height, borderRadius: '12px', overflow: 'hidden' }}>
            <MapContainer
                center={center}
                zoom={15}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%' }}
            >
                <MapUpdater center={center} />
                <TileLayer
                    url="https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={center} icon={customIcon}>
                    <Popup>
                        <div style={{ textAlign: 'center' }}>
                            <strong>{name}</strong>
                            {showCoordinates && (
                                <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                                    {coordinates.latitude.toFixed(6)}, {coordinates.longitude.toFixed(6)}
                                </div>
                            )}
                        </div>
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};

export default EnhancedMap; 