import React, { useState } from "react";
import Map from "../components/Maps/TeamBookingMap";
import TeamBooking from "../components/Forms/TeamBooking";
import { Grid } from "@ui5/webcomponents-react";

function BookTeam() {
  const [selectedDesk, setSelectedDesk] = useState(null);
  const [selectedBuilding, setSelectedBuilding] = useState("2");
  const [selectedFloor, setSelectedFloor] = useState("1");
  const [dateRange, setDateRange] = useState("");

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
          selectedDesk={selectedDesk}
          onBuildingChange={handleBuildingChange}
          onFloorChange={handleFloorChange}
          onDateRangeChange={handleDateRangeChange}
        />
      </div>
      <Map
        onCircleClick={handleCircleClick}
        selectedBuilding={selectedBuilding}
        selectedFloor={selectedFloor}
        dateRange={dateRange}
      />
    </Grid>
  );
}


export default BookTeam;