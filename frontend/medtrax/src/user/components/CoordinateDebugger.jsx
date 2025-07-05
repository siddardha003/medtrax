import React from 'react';
import { extractCoordinates } from '../../utils/coordinateUtils';

const CoordinateDebugger = ({ data, name }) => {
    const coordinates = extractCoordinates(data);
    
    return (
        <div style={{
            backgroundColor: '#f8f9fa',
            border: '1px solid #dee2e6',
            borderRadius: '8px',
            padding: '15px',
            margin: '10px 0',
            fontSize: '12px',
            fontFamily: 'monospace'
        }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#495057' }}>🔍 Coordinate Debug: {name}</h4>
            
            <div style={{ marginBottom: '10px' }}>
                <strong>Raw Data:</strong>
                <pre style={{ 
                    backgroundColor: '#fff', 
                    padding: '8px', 
                    borderRadius: '4px',
                    overflow: 'auto',
                    maxHeight: '200px'
                }}>
                    {JSON.stringify(data, null, 2)}
                </pre>
            </div>
            
            <div style={{ marginBottom: '10px' }}>
                <strong>Extracted Coordinates:</strong>
                <div style={{ 
                    backgroundColor: coordinates.isValid ? '#d4edda' : '#f8d7da',
                    padding: '8px',
                    borderRadius: '4px',
                    color: coordinates.isValid ? '#155724' : '#721c24'
                }}>
                    Latitude: {coordinates.latitude || 'null'}
                    <br />
                    Longitude: {coordinates.longitude || 'null'}
                    <br />
                    Valid: {coordinates.isValid ? '✅ Yes' : '❌ No'}
                </div>
            </div>
            
            <div style={{ marginBottom: '10px' }}>
                <strong>Coordinate Sources Checked:</strong>
                <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                    <li>data.location.coordinates (GeoJSON): {data?.location?.coordinates ? '✅ Found' : '❌ Not found'}</li>
                    <li>data.location.latitude/longitude: {data?.location?.latitude && data?.location?.longitude ? '✅ Found' : '❌ Not found'}</li>
                    <li>data.latitude/longitude: {data?.latitude && data?.longitude ? '✅ Found' : '❌ Not found'}</li>
                    <li>data.selectedMedicalshop: {data?.selectedMedicalshop?.latitude && data?.selectedMedicalshop?.longitude ? '✅ Found' : '❌ Not found'}</li>
                </ul>
            </div>
            
            {!coordinates.isValid && (
                <div style={{
                    backgroundColor: '#fff3cd',
                    border: '1px solid #ffeaa7',
                    borderRadius: '4px',
                    padding: '8px',
                    color: '#856404'
                }}>
                    <strong>⚠️ Issue:</strong> No valid coordinates found. This location will show a "Location Not Available" message.
                </div>
            )}
        </div>
    );
};

export default CoordinateDebugger; 