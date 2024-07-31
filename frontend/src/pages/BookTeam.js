import React, { useState } from "react";
import TeamMap from "../components/Maps/TeamBookingMap";
import TeamBooking from "../components/Forms/TeamBooking";
import { Grid } from "@ui5/webcomponents-react";

function BookTeam() {
  const [selectedDesks, setSelectedDesks] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [selectedFloor, setSelectedFloor] = useState("");
  const [dateRange, setDateRange] = useState();

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
      <TeamBooking
          selectedDesks={selectedDesks}
          onBuildingChange={handleBuildingChange}
          onFloorChange={handleFloorChange}
          onDateRangeChange={handleDateRangeChange}
         
        />
  
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          marginTop: "2rem", 
        }}
      >
         <TeamMap
        onCircleClick={() => {}} 
        selectedBuilding={selectedBuilding}
        selectedFloor={selectedFloor}
        dateRange={dateRange}
        selectedDesks={selectedDesks}
        setSelectedDesks={setSelectedDesks}
      /> 
      </div>
    </Grid>
  );
}

export default BookTeam;
