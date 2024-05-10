import React, { useState } from "react";
import Map from "../components/Maps/BookDeskMap";
import DeskForm  from "../components/Forms/DeskForm";
import { Grid } from "@ui5/webcomponents-react";

function BookDesk() {
  const [selectedDesk, setSelectedDesk] = useState(null);

  const handleCircleClick = (coordinate) => {
    setSelectedDesk(coordinate);
  };

  return (
    <Grid defaultSpan="XL6 L12 M12 S12" vSpacing="1rem" hSpacing="1rem">
      <div style={{margin: "2rem", display: "flex", flexDirection: "column", justifyContent: "center", height: "100%"}}>
        <DeskForm selectedDesk={selectedDesk} />
      </div>
      <Map onCircleClick={handleCircleClick} />
    </Grid>
  );
}

export default BookDesk;