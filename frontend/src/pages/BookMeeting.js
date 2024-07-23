import React, { useState } from "react";
import MeetingRoomCarousel from "../components/Carousels/MeetingRoomCarousel";
import MeetingRoomForm from "../components/Forms/MeetingRoomForm";
import { Grid } from "@ui5/webcomponents-react";
import Map from "../components/Maps/BookMeetingMap";

const BookMeeting = ({ isAuthenticated, user, logout, login }) => {
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [selectedFloor, setSelectedFloor] = useState("");

  const setBuilding = (newBuilding) => {
    setSelectedBuilding(newBuilding);
  };

  const setFloor = (newFloor) => {
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
          justifyContent: "space-between",
          height: "100%",
          width: "100%",
        }}
      >
        <MeetingRoomForm
          onBuildingChange={setBuilding}
          onFloorChange={setFloor}
        />
        <MeetingRoomCarousel />
      </div>
      <Map selectedBuilding={selectedBuilding} selectedFloor={selectedFloor} />
    </Grid>
  );
};

export default BookMeeting;
