import React from 'react';
import { MapContainer, ImageOverlay, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import floorPlan from '../../assets/floor-plan-png-9.png';

// Fix for the default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function Map() {
  const bounds = [
    [0, 0],
    [10, 29],
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
      <Marker position={markerPosition}>
        <Popup>
          DUB05-3-L-34
        </Popup>
      </Marker>
    </MapContainer>
  );
}

export default Map;