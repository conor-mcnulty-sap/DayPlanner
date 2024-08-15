import React, { useState, useEffect } from "react";
import TeamMap from "../components/Maps/TeamBookingMap";
import TeamBooking from "../components/Forms/TeamBooking";
import { Grid } from "@ui5/webcomponents-react";
import "./BookDesk.css";

function BookTeam() {
  const [selectedDesks, setSelectedDesks] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [selectedFloor, setSelectedFloor] = useState("");
  const [dateRange, setDateRange] = useState();
  const [zoom, setZoom] = useState(15);
  const [center, setCenter] = useState([5, 14.5]);

  const handleBuildingChange = (newBuilding) => {
    setSelectedBuilding(newBuilding);
  };

  const handleFloorChange = (newFloor) => {
    setSelectedFloor(newFloor);
  };

  const handleDateRangeChange = (newDateRange) => {
    setDateRange(newDateRange);
  };

  useEffect(() => {
    const updateMapSettings = () => {
      if (window.innerWidth <= 768) {
        setZoom(4); // Zoom out on mobile
        setCenter([-5, 13.5]); // Adjust center for mobile
      } else {
        setZoom(5); // Default zoom level for desktop
        setCenter([5, 14.5]); // Default center for desktop
      }
    };

    updateMapSettings();
    window.addEventListener("resize", updateMapSettings);

    return () => {
      window.removeEventListener("resize", updateMapSettings);
    };
  }, []);

  return (
    <Grid
      defaultSpan="XL6 L12 M12 S12"
      vSpacing="1rem"
      hSpacing="1rem"
      style={{ margin: "2rem" }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <TeamBooking
          selectedDesks={selectedDesks}
          onBuildingChange={handleBuildingChange}
          onFloorChange={handleFloorChange}
          onDateRangeChange={handleDateRangeChange}
        />
      </div>
      <div className="map-container">
        <TeamMap
          onCircleClick={() => {}}
          selectedBuilding={selectedBuilding}
          selectedFloor={selectedFloor}
          dateRange={dateRange}
          selectedDesks={selectedDesks}
          setSelectedDesks={setSelectedDesks}
          zoom={zoom}
          center={center}
        />
      </div>
    </Grid>
  );
}

export default BookTeam;
