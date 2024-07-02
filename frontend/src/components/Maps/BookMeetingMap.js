import React, { useState, useEffect } from "react";
import { Card } from "@ui5/webcomponents-react";
import { MapContainer, ImageOverlay, Polygon } from "react-leaflet"; // Import Polygon
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import floorPlan33 from "../../assets/DUB/3-3.png";

function Map() {
  const [isMapInit, setIsMapInit] = useState(false);
  const [polygons, setPolygons] = useState([]); // Renamed to polygons for clarity
  const bounds = [
    [0, 0],
    [10, 29],
  ];

  useEffect(() => {
    setIsMapInit(true);

    // Fetch polygon coordinates
    fetch(`/coordinates.json`)
      .then((response) => response.json())
      .then((data) => {
        // Assuming the data structure is updated for polygons
        setPolygons(data.polygons);
      })
      .catch((error) => console.error("Failed to load coordinates:", error));
  }, []);

  return (
    <Card style={{ width: "100%", height: "100%" }}>
      {isMapInit && (
        <MapContainer
          center={[5, 14.5]}
          zoom={5}
          style={{ height: "90vh", width: "100%", backgroundColor: "white" }}
          crs={L.CRS.Simple}
          attributionControl={false}
        >
          <ImageOverlay url={floorPlan33} bounds={bounds} />
          {/* Use polygons */}
          {polygons.map((polygon, index) => (
            <Polygon
              key={index}
              positions={polygon.positions} // Use positions for Polygon
              pathOptions={{ color: polygon.color }}
            />
          ))}
        </MapContainer>
      )}
    </Card>
  );
}

export default Map;