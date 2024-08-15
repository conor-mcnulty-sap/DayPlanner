import React, { useState } from "react";
import MeetingRoomForm from "../components/Forms/MeetingRoomForm";
import { Grid } from "@ui5/webcomponents-react";
import Map from "../components/Maps/BookMeetingMap";
import moment from "moment";
import "./BookMeeting.css";

const BookMeeting = ({ isAuthenticated, user, logout, login }) => {
  const [building, setBuilding] = useState("3");
  const [floor, setFloor] = useState("3");
  const [startTime, setStartTime] = useState(
    moment().format("YYYY-MM-DDTHH:mm")
  );
  const [endTime, setEndTime] = useState(
    moment(startTime).add(moment.duration("1:00")).format("YYYY-MM-DDTHH:mm")
  );

  const handleBuildingChange = (newBuilding) => {
    console.log("Selected Building:", newBuilding);
    setBuilding(newBuilding);
  };

  const handleFloorChange = (newFloor) => {
    console.log("Selected Floor:", newFloor);
    setFloor(newFloor);
  };

  const onDateTimeChange = (newStartTime, newEndTime) => {
    console.log(
      "Selected Start Time:",
      newStartTime,
      "Selected End Time:",
      newEndTime
    );
    setStartTime(newStartTime);
    setEndTime(newEndTime);
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
          onBuildingChange={handleBuildingChange}
          onFloorChange={handleFloorChange}
          onDateTimeChange={onDateTimeChange}
        />
      </div>
      <div className="map-container">
        <Map
          selectedBuilding={building}
          selectedFloor={floor}
          startTime={startTime}
          endTime={endTime}
        />
      </div>
    </Grid>
  );
};

export default BookMeeting;
