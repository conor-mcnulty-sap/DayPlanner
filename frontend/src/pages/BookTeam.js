import React, { useState } from "react";
import Map from "../components/Maps/BookDeskMap";
import TeamBooking from "../components/Forms/TeamBooking";
import { Grid } from "@ui5/webcomponents-react";

function BookTeam() {
  const [selectedDesk, setSelectedDesk] = useState(null);

  const handleCircleClick = (coordinate) => {
    setSelectedDesk(coordinate);
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
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          
        }}
      >
        <TeamBooking />
      </div>
      <Map onCircleClick={handleCircleClick} />
    </Grid>
  );
}

export default BookTeam;