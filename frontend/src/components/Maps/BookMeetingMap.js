import React, { useState, useEffect } from "react";
import { Card } from "@ui5/webcomponents-react";
import { MapContainer, ImageOverlay, Polygon, Popup } from "react-leaflet"; // Import Popup along with Polygon
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import floorPlan21 from "../../assets/DUB/2-1.png";
import floorPlan22 from "../../assets/DUB/2-2.png";
import floorPlan23 from "../../assets/DUB/2-3.png";
import floorPlan31 from "../../assets/DUB/3-1.png";
import floorPlan33 from "../../assets/DUB/3-3.png";
import { useGetMeetingRooms } from "../../hooks/useGetMeetingRooms";
const floorPlans = {
  "2-1": floorPlan21,
  "2-2": floorPlan22,
  "2-3": floorPlan23,
  "3-1": floorPlan31,
  "3-3": floorPlan33,
};

function Map(props) {
  const { selectedBuilding, selectedFloor } = props;
  const [selectedFloorPlan, setSelectedFloorPlan] = useState("");
  const [isMapInit, setIsMapInit] = useState(false);
  const [polygons, setPolygons] = useState([]);

  const bounds = [
    [0, 0],
    [10, 29],
  ];

  

  console.log("abc" + useGetMeetingRooms("2024-07-23 14:14", "DUB05", "2", "2024-06-13 17:14"));

  useEffect(() => {
    setIsMapInit(true);

    // Fetch polygon coordinates
    fetch(`/MeetingCoordinates-3-1.json`)
      .then((response) => response.json())
      .then((data) => {
        setPolygons(data.polygons);
      })
      .catch((error) => console.error("Failed to load coordinates:", error));
  }, []);

  useEffect(() => {
    let adjustedBuilding = selectedBuilding;
    if (selectedBuilding === "DUB03") {
      adjustedBuilding = "2";
    } else if (selectedBuilding === "DUB05") {
      adjustedBuilding = "3";
    }
    const floorPlanKey = `${adjustedBuilding}-${selectedFloor}`;
    if (floorPlans[floorPlanKey]) {
      setSelectedFloorPlan(floorPlans[floorPlanKey]);
    } else {
      console.warn(
        `Floor plan ${floorPlanKey} does not exist. Defaulting to '3-3'.`
      );
      setSelectedFloorPlan(floorPlans["3-3"]);
    }
  }, [selectedBuilding, selectedFloor]);

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
          <ImageOverlay
            key={selectedFloorPlan}
            url={selectedFloorPlan}
            bounds={bounds}
          />
          {polygons.map((polygon, index) => (
            <Polygon
              key={index}
              positions={polygon.positions}
              pathOptions={{ color: polygon.color }}
            >
              <Popup>
                {/* Example dynamic content: "Area #" + index */}
                {polygon.name} - {polygon.description || "No description"}
              </Popup>
            </Polygon>
          ))}
        </MapContainer>
      )}
    </Card>
  );
}

export default Map;
