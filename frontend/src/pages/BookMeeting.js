import React from "react";
import MeetingRoomCarousel from "../components/Carousels/MeetingRoomCarousel";
import MeetingRoomFrom from "../components/Forms/MeetingRoomForm";
import { Grid } from "@ui5/webcomponents-react";
import Map from "../components/Maps/BookMeetingMap";
function BookMeeting() {
  
  return (
    <Grid defaultSpan="XL6 L6 M6 S12" vSpacing={"5rem"} hSpacing={"5rem"}>
      <>
      <MeetingRoomFrom />
      <MeetingRoomCarousel />
      </>
      <Map/>
    </Grid>
  )
}

export default BookMeeting;