import React, { useState, useEffect } from "react";
import { Card } from "@ui5/webcomponents-react";
import { MapContainer, ImageOverlay, Marker, Popup, Rectangle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

function Map({ deskId = "" }) {
  const [isMapInit, setIsMapInit] = useState(false);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [floorPlan, setFloorPlan] = useState("");
  const [buildingFloorInfo, setBuildingFloorInfo] = useState(""); // New state variable for building and floor info
  const bounds = [
    [0, 0],
    [10, 29],
  ];

  // Define custom icon
  const customIcon = L.icon({
    iconUrl: require("../../assets/299079_map_blue.png"), // Path to your custom marker icon
    iconSize: [40, 40], // Size of the icon
    iconAnchor: [12, 41], // Point of the icon which will correspond to marker's location
    popupAnchor: [1, -34], // Point from which the popup should open relative to the iconAnchor
  });

  useEffect(() => {
    setIsMapInit(true);
    let buildingNumber, floor;

    if (!deskId) {
      buildingNumber = 2;
      floor = 1;
    } else {
      const [building, floorExtracted] = deskId.split("-").slice(0, 2);
      buildingNumber = building.match(/\d+/)
        ? parseInt(building.match(/\d+/)[0], 10)
        : "";

      if (buildingNumber === 5) {
        buildingNumber = 3;
      } else if (buildingNumber === 3) {
        buildingNumber = 2;
      }
      floor = floorExtracted;
    }

    const floorPlanPath = require(`../../assets/DUB/${buildingNumber}-${floor}.png`);
    setFloorPlan(floorPlanPath);
    setBuildingFloorInfo(`Waterside ${buildingNumber}, Floor ${floor}`); // Update building and floor info

    if (deskId) {
      fetch(
        `${process.env.PUBLIC_URL}/coordinates-${buildingNumber}-${floor}.json`
      )
        .then((response) => response.json())
        .then((deskCoordinates) => {
          const desk = deskCoordinates.find((d) => d.popup === deskId);
          if (desk) {
            setMarkerPosition(desk.position);
          }
        })
        .catch((error) => console.error("Error:", error));
    }
  }, [deskId]);

  return (
    <Card style={{ width: "100%", height: "100%" }}>
      {isMapInit && floorPlan && (
        <MapContainer
          center={[5, 14.5]}
          zoom={5}
          style={{ height: "90vh", width: "100%", backgroundColor: "white" }}
          crs={L.CRS.Simple}
          attributionControl={false}
        >
          <ImageOverlay url={floorPlan} bounds={bounds} />
          {markerPosition && (
            <Marker position={markerPosition} icon={customIcon}>
              <Popup>{deskId}</Popup>
            </Marker>
          )}
          {/* New Popup for displaying building and floor info */}
          <Popup
            position={[10, 14.5]}
            closeButton={false}
            autoClose={false}
            closeOnClick={false}
          >
            {buildingFloorInfo}
          </Popup>
        </MapContainer>
      )}
    </Card>
  );
}

export default Map;
