import React from "react";
import MeetingRoomCarousel from "../components/Carousels/MeetingRoomCarousel";
import MeetingRoomForm from "../components/Forms/MeetingRoomForm";
import { Grid } from "@ui5/webcomponents-react";
import Map from "../components/Maps/BookMeetingMap";

function BookMeeting() {
  return (
    <Grid defaultSpan="XL6 L12 M12 S12" vSpacing="1rem" hSpacing="1rem">
      <div
        style={{
          display: "flex",
          flexDirection: window.innerWidth <= 768 ? "column" : "row",
          justifyContent: "space-around",
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
