import React, { useState } from "react";
import Map from "../components/Maps/BookDeskMap";
import DeskForm from "../components/Forms/DeskForm";
import { Grid } from "@ui5/webcomponents-react";

function BookDesk() {
  const [selectedDesk, setSelectedDesk] = useState(null);
  const [selectedBuilding, setSelectedBuilding] = useState("3");
  const [selectedFloor, setSelectedFloor] = useState("3");
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
        <DeskForm
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

export default BookDesk;
