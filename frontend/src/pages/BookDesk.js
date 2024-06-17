import React, { useState } from "react";
import Map from "../components/Maps/BookDeskMap";
import DeskForm from "../components/Forms/DeskForm";
import { Grid } from "@ui5/webcomponents-react";

function BookDesk() {
  const [selectedDesk, setSelectedDesk] = useState(null);
  const [selectedBuilding, setSelectedBuilding] = useState('2');
  const [selectedFloor, setSelectedFloor] = useState('1');

  const handleCircleClick = (coordinate) => {
    setSelectedDesk(coordinate);
  };


  const handleBuildingChange = (newBuilding) => {
    setSelectedBuilding(newBuilding);
  };

  const handleFloorChange = (newFloor) => {
    setSelectedFloor(newFloor);
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
  onFloorChange={handleFloorChange} // Make sure handleFloorChange is a function
/>
      </div>
      <Map 
        onCircleClick={handleCircleClick} 
        selectedBuilding={selectedBuilding}
        selectedFloor={selectedFloor}
      />
    </Grid>
  );
}

export default BookDesk;