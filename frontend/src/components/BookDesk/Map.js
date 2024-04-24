import React from 'react';
import { MapContainer, ImageOverlay, Circle, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import floorPlan from '../../assets/floor-plan-png-9.png';

function Map() {
  const bounds = [
    [0, 0],
    [10, 10],
  ];

  const markerPosition = [5, 5]; // adjust this to the desired position

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
      <Circle center={markerPosition} radius={.1} color="red" fillOpacity={0}>
        <Popup>
        DUB05-3-L-34
        </Popup>
      </Circle>
    </MapContainer>
  );
}

export default Map;