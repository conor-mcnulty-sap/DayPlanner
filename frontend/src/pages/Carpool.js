import React from "react";
import CarpooleeForm from "../components/Forms/CarpooleeForm";
import CarpoolerForm from "../components/Forms/CarpoolerForm";
import CarpoolList from "../components/Carpool/CarpoolList";
import CarpooleeList from "../components/Carpool/CarpooleeList";
import { Grid } from "@ui5/webcomponents-react";
import CarpoolMap from "../components/Carpool/CarpoolMap";

function Carpool() {
  return (
    <div
      style={{
        margin: "1rem auto 4rem auto", // Center the content
        width: "90%", 
        alignItems: "start",
        minHeight: "60vh", // Adjust the minimum height here
      }}
    >
      <Grid
        defaultSpan="xl6 l6 m6 s12"
        
        hSpacing={"2rem"}
        vSpacing={"2rem"}
        style={{ margin: "2rem" }}
      >
        <div style={{ display: "flex", gap: "2rem" }}>
          <CarpooleeForm />
          <CarpoolerForm />
        </div>
        <CarpoolMap />
        <CarpooleeList />
        <CarpoolList />
      </Grid>
    </div>
  );
}

export default Carpool;