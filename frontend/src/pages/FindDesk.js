import React from "react";
import { Grid } from "@ui5/webcomponents-react";
import Map from "../components/Maps/FindDeskMap";
import SingleSelectCalendar from "../components/FindDesk/Calendar";
function FindDesk() {
  return (
    <Grid defaultSpan="XL6 L12 M12 S12" vSpacing={"1rem"} hSpacing={"1rem"}>
      <SingleSelectCalendar/>
      <Map />
    </Grid>
  );
}

export default FindDesk;
