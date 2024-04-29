import React from 'react';
import { MapContainer, ImageOverlay } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import floorPlan from '../../assets/floor-plan-png-9.jpg';

function Map() {
  const bounds = [
    [0, 0],
    [10, 29],
  ];

  return (
    <MapContainer 
      center={[5, 5]} 
      zoom={6} 
      style={{ height: "90vh", width: "90%", backgroundColor: "white" }}
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