import React from "react";
import MeetingRoomCarousel from "../components/Carousels/MeetingRoomCarousel";
import MeetingRoomForm from "../components/Forms/MeetingRoomForm";
import { Grid } from "@ui5/webcomponents-react";
import Map from "../components/Maps/BookMeetingMap";

const BookMeeting = ({ isAuthenticated, user, logout, login }) => {
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
        <MeetingRoomForm />
        <MeetingRoomCarousel />
      </div>
      <Map />
    </Grid>
  );
}

export default BookMeeting;
