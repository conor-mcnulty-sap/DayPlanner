import React, { useState, useEffect } from "react";
import { Card } from "@ui5/webcomponents-react";
import { MapContainer, ImageOverlay, Polygon, Popup } from "react-leaflet";
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
  "3-2": floorPlan33,
  "3-3": floorPlan33,
};

const getMeetingRoomImageUrl = (meetingRoomName) => {
  const newMeetingRoom = meetingRoomName.replace(/\s+/g, "").replace(/'/g, "");
  const url = `https://podlhgkfubcuxuryqobo.supabase.co/storage/v1/object/public/Meeting%20room%20images/${newMeetingRoom}.jpg`;
  return url;
};
function Map(props) {
  const { selectedBuilding, selectedFloor, startTime, endTime } = props;
  const [selectedFloorPlan, setSelectedFloorPlan] = useState("");
  const [isMapInit, setIsMapInit] = useState(false);
  const [polygons, setPolygons] = useState([]);

  const bounds = [
    [0, 0],
    [10, 29],
  ];

  const availableRooms = useGetMeetingRooms(
    startTime,
    selectedBuilding,
    selectedFloor,
    endTime
  );
  console.log("available rooms: " + availableRooms);
  console.log(startTime + endTime);

  useEffect(() => {
    setIsMapInit(true);
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
      if (!availableRooms) {
        console.log("Waiting for available rooms...");
        return;
      }
    
      console.log("available rooms: " + availableRooms);
    
      // Building adjustment logic remains the same...
    
      fetch(`/MeetingCoordinates-${adjustedBuilding}-${selectedFloor}.json`)
        .then((response) => response.json())
        .then((data) => {
          const updatedCoordinates = data.polygons.map((polygon) => {
            const polygonIdStr = polygon.id.toString().trim();
            const isAvailable = availableRooms.includes(polygonIdStr); // Assuming availableRooms is already an array of trimmed strings
            console.log(`Checking availability for: ${polygonIdStr}, Available: ${isAvailable}`);
            return {
              ...polygon,
              color: isAvailable ? "green" : "red",
            };
          });
          setPolygons(updatedCoordinates);
        })
        .catch((error) => console.error("Failed to load coordinates:", error));
    }, [selectedBuilding, selectedFloor, availableRooms]);

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
              pathOptions={{
                color: polygon.color,
                fillColor: polygon.color,
                fillOpacity: 0.2,
                fill: true,
              }}
            >
              <Popup>
                <div>
                  <h3>{polygon.name}</h3>
                  <p>{polygon.description || "No description"}</p>
                  <img
                    src={getMeetingRoomImageUrl(polygon.name)}
                    alt={polygon.name}
                    style={{ width: "100%", height: "auto" }}
                  />
                </div>
              </Popup>
            </Polygon>
          ))}
        </MapContainer>
      )}
    </Card>
  );
}

export default Map;
