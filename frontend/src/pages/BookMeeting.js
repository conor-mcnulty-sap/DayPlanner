import React, { useState, useEffect } from "react";
import MeetingRoomForm from "../components/Forms/MeetingRoomForm";
import { Grid } from "@ui5/webcomponents-react";
import Map from "../components/Maps/BookMeetingMap";
import moment from "moment";
import "./BookMeeting.css";

const BookMeeting = ({ isAuthenticated, user, logout, login }) => {
  const [building, setBuilding] = useState("3");
  const [floor, setFloor] = useState("3");
  const [zoom, setZoom] = useState(15);
  const [center, setCenter] = useState([5, 14.5]);
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

  useEffect(() => {
    const updateMapSettings = () => {
      if (window.innerWidth <= 1440) {
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
          zoom={zoom}
          center={center}
        />
      </div>
    </Grid>
  );
};

export default BookMeeting;
