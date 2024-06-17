import React from "react";
import { Grid } from "@ui5/webcomponents-react";
import Map from "../components/Maps/FindDeskMap";
import SingleSelectCalendar from "../components/FindDesk/Calendar";

function FindDesk() {
  return (
    <Grid
      defaultSpan="XL6 L12 M12 S12"
      vSpacing={"1rem"}
      hSpacing={"1rem"}
      style={{ margin: "2rem" }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <SingleSelectCalendar />
      </div>
      <Map />
    </Grid>
  );
}

export default FindDesk;