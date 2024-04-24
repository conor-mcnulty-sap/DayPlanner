import React from 'react';
import { MapContainer, ImageOverlay } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import floorPlan from '../../assets/floor-plan-png-9.png';

function Map() {
  const bounds = [
    [0, 0],
    [10, 29],
  ];

  return (
    <MapContainer 
      center={[5, 5]} 
      zoom={6} 
      style={{ height: "100vh", width: "100%" }}
      crs={L.CRS.Simple}
    >
      <ImageOverlay
        url={floorPlan}
        bounds={bounds}
      />
      
    </MapContainer>
  );
}

export default Map;