import React, { useState, useEffect } from "react";
import Map from "../components/Maps/BookDeskMap";
import DeskForm from "../components/Forms/DeskForm";
import { Grid } from "@ui5/webcomponents-react";
import { getDate } from "../util/getDate";
import "./BookDesk.css"; 

function BookDesk() {
  const [selectedDesk, setSelectedDesk] = useState(null);
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [selectedFloor, setSelectedFloor] = useState("");
  const [dateRange, setDateRange] = useState(getDate());
  const [zoom, setZoom] = useState(15); // Default zoom level
  const [center, setCenter] = useState([5, 14.5]); // Default center coordinates

  const handleCircleClick = (coordinate) => {
    setSelectedDesk(coordinate);
  };

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
        <DeskForm
          selectedDesk={selectedDesk}
          onBuildingChange={handleBuildingChange}
          onFloorChange={handleFloorChange}
          onDateRangeChange={handleDateRangeChange}
        />
      </div>
      <div className="map-container">
        <Map 
          onCircleClick={handleCircleClick}
          selectedBuilding={selectedBuilding}
          selectedFloor={selectedFloor}
          dateRange={dateRange}
          zoom={zoom} // Pass the zoom level to the Map component
          center={center} // Pass the center coordinates to the Map component
        />
      </div>
    </Grid>
  );
}

export default BookDesk;