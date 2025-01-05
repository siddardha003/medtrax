import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Custom Marker Icon

const customIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
    iconSize: [38, 38],
    iconAnchor: [22, 38],
    popupAnchor: [-3, -38],
});

const MedicalshopMap = ({ latitude, longitude, medicalshopName }) => {
    return (
        <div className="map-container">
            <MapContainer
                center={[latitude, longitude]}
                zoom={15}
                scrollWheelZoom={false}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[latitude, longitude]} icon={customIcon}>
                    <Popup>
                        {medicalshopName}
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};

export default MedicalshopMap;
