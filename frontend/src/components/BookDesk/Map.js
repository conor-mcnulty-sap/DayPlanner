import React from 'react';
import { MapContainer, ImageOverlay, Circle, Popup, Rectangle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import floorPlan from '../../assets/floor-plan-png-9.png';

function Map() {
  const bounds = [
    [0, 0],
    [10, 29],
  ];

  // Array of coordinates with popup text
  const coordinates = [
    { position: [6.8, 3.9], popup: 'DUB05-2-L-12' },
    { position: [6.65, 4.65], popup: 'DUB05-2-L-13' },
    { position: [6.15, 4.15], popup: 'DUB05-2-L-14' },
    { position: [5.75, 4.65], popup: 'DUB05-2-L-15' },
    { position: [5.6, 5.4], popup: 'DUB05-2-L-16' },
    { position: [6.25, 5.15], popup: 'DUB05-2-L-17' },
    { position: [5.5, 6.55], popup: 'DUB05-2-L-18' },
    { position: [4.85, 6.6], popup: 'DUB05-2-L-19' },
    { position: [5.2, 7.15], popup: 'DUB05-2-L-20' },
  ]; // adjust this to your desired coordinates

  // Create an array of rectangles for the grid
  const rectangles = [];
  for (let i = 0; i < 10; i += 0.5) {
    for (let j = 0; j < 29; j += 0.5) {
      rectangles.push([[i, j], [i + 0.5, j + 0.5]]);
    }
  }

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
      {rectangles.map((rectangle, index) => (
        <Rectangle key={index} bounds={rectangle} color="black" fillOpacity={0} />
      ))}
      {coordinates.map((coordinate, index) => (
        <Circle key={index} center={coordinate.position} radius={.1} color="red" fillOpacity={0}>
          <Popup>
            {coordinate.popup}
          </Popup>
        </Circle>
      ))}
    </MapContainer>
  );
}

export default Map;