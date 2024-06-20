import React, { useState } from "react";
import { Grid } from "@ui5/webcomponents-react";
import Map from "../components/Maps/FindDeskMap";
import SingleSelectCalendar from "../components/FindDesk/Calendar";

function FindDesk() {
  const [deskId, setDeskId] = useState(null);

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
        <SingleSelectCalendar
          onDeskIdFetched={(fetchedDeskId) => {
            console.log("Fetched desk id:", fetchedDeskId);
            setDeskId(fetchedDeskId);
          }}
        />
      </div>
      <Map deskId={deskId} />
    </Grid>
  );
}

export default FindDesk;
