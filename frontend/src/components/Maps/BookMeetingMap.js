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

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

function Map(props) {
  console.log("Map props:", props); // Log the props to the console

  let { selectedBuilding = "DUB05", selectedFloor = "3", startTime, endTime } = props;

  // Adjust the selectedBuilding value
  if (selectedBuilding === '3') {
    selectedBuilding = 'DUB05';
  } else if (selectedBuilding === '2') {
    selectedBuilding = 'DUB03';
  }

  // Format the dates
  startTime = formatDate(new Date(startTime));
  endTime = formatDate(new Date(endTime));

  console.log("Formatted dates:", startTime, endTime); // Log the formatted dates to the console

  const [selectedFloorPlan, setSelectedFloorPlan] = useState(floorPlan33); // Default to floorPlan33
  const [isMapInit, setIsMapInit] = useState(false);
  const [polygons, setPolygons] = useState([]);
  const [bookedRooms, setBookedRooms] = useState(null);

  const bounds = [
    [0, 0],
    [10, 29],
  ];

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

    // Check if the floor plan exists, otherwise use default
    if (floorPlans[floorPlanKey]) {
      setSelectedFloorPlan(floorPlans[floorPlanKey]);
    } else {
      // Use default floor plan if the key does not exist
      setSelectedFloorPlan(floorPlans["3-3"]);
    }

    const fetchBookedRooms = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/meetingrooms/checkavailabilitybuildingfloor?start_date_time=${startTime}&building=${selectedBuilding}&floor=${selectedFloor}&end_date_time=${endTime}`
        );
        const data = await response.json();
        setBookedRooms(data);
        console.log("Booked rooms:", data);
      } catch (error) {
        console.error("Failed to fetch booked rooms:", error);
      }
    };

    fetchBookedRooms();
  }, [selectedBuilding, selectedFloor, startTime, endTime]);

  useEffect(() => {
    if (!bookedRooms) {
      console.log("Waiting for available rooms...");
      return;
    }

    let adjustedBuilding = selectedBuilding;
    if (selectedBuilding === "DUB03") {
      adjustedBuilding = "2";
    } else if (selectedBuilding === "DUB05") {
      adjustedBuilding = "3";
    }

    fetch(`/MeetingCoordinates-${adjustedBuilding}-${selectedFloor}.json`)
      .then((response) => response.json())
      .then((data) => {
        const updatedCoordinates = data.polygons.map((polygon) => {
          const polygonIdStr = polygon.id.toString().trim();
          const isAvailable = bookedRooms.includes(polygonIdStr);
          return {
            ...polygon,
            color: isAvailable ? "red" : "green",
          };
        });
        setPolygons(updatedCoordinates);
      })
      .catch((error) => console.error("Failed to load coordinates:", error));
  }, [selectedBuilding, selectedFloor, bookedRooms]);

  return (
    <Card style={{ width: "100%", height: "100%" }}>
      {isMapInit && (
        <MapContainer
          center={[5, 14.5]}
          zoom={5}
          style={{
            height: "90vh",
            width: "100%",
            backgroundColor: "white",
            zIndex: 100,
            position: "relative",
          }}
          crs={L.CRS.Simple}
          attributionControl={false}
        >
          <ImageOverlay
            style={{ zIndex: 100, position: "relative" }}
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