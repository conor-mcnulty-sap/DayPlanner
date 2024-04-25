import React from "react";
import MeetingRoomCarousel from "../components/Carousels/MeetingRoomCarousel";
import MeetingRoomFrom from "../components/Forms/MeetingRoomForm";
import { Grid } from "@ui5/webcomponents-react";
import Map from "../components/BookMeeting/Map";
function BookMeeting() {
  
  return (
    <Grid defaultSpan="XL6 L12 M12 S12" vSpacing={"20rem"} hSpacing={"10rem"}>
      <>
      <MeetingRoomFrom />
      <MeetingRoomCarousel />
      </>
      <Map/>
    </Grid>
  )
}

export default BookMeeting;