// BookDeskMap.js
import React, { useState, useEffect } from "react";
import {
  MapContainer,
  ImageOverlay,
  Circle,
  Popup,
  Rectangle,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import floorPlan from "../../assets/floor-plan-png-9.jpg";
import { Card } from "@ui5/webcomponents-react";

function Map({ onCircleClick }) {
  const [isMapInit, setIsMapInit] = useState(false);
  useEffect(() => {
    setIsMapInit(true);
  }, []);

  const bounds = [
    [0, 0],
    [10, 29],
  ];

  // State to store the coordinates
  const [coordinates, setCoordinates] = useState([]);

  // Fetch the coordinates from the JSON file when the component mounts
  useEffect(() => {
    fetch("/coordinates.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched coordinates: ", data);
        setCoordinates(data);
      })
      .catch((error) => console.log("Fetching coordinates failed: ", error));
  }, []);

  // Create an array of rectangles for the grid
  const rectangles = [];
  for (let i = 0; i < 10; i += 0.5) {
    for (let j = 0; j < 29; j += 0.5) {
      rectangles.push([
        [i, j],
        [i + 0.5, j + 0.5],
      ]);
    }
  }

  return (
    <Card>
      {isMapInit && (
        <MapContainer
          center={[5, 14.5]}
          zoom={5}
          style={{ height: "90vh", width: "100%", backgroundColor: "white" }}
          crs={L.CRS.Simple}
        >
          <ImageOverlay url={floorPlan} bounds={bounds} />

          {coordinates.map((coordinate, index) => (
            <Circle
              key={index}
              center={coordinate.position}
              radius={0.1}
              pathOptions={{
                color: coordinate.color,
                fillColor: coordinate.color,
                fillOpacity: 0.2,
                fill: true,
              }}
              eventHandlers={{
                click: () => {
                  onCircleClick(coordinate);
                },
              }}
            >
              <Popup>
                {coordinate.color === "red"
                  ? `Booked by ${coordinate.bookedBy}`
                  : coordinate.popup}
              </Popup>
            </Circle>
          ))}
        </MapContainer>
      )}
    </Card>
  );
}

export default Map;
