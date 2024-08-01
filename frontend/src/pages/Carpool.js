import React from "react";
import CarpooleeForm from "../components/Forms/CarpooleeForm";
import CarpoolerForm from "../components/Forms/CarpoolerForm";
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
        defaultSpan="xl6 l6 m12 s12"
        
        hSpacing={"2rem"}
        vSpacing={"2rem"}
        style={{ margin: "2rem" }}
      >
        <div style={{ display: "flex", gap: "2rem", flexDirection:"column"}}>
        <div style={{ display: "flex", gap: "2rem" }}>
          <CarpooleeForm />
          <CarpoolerForm />
        </div>
        <CarpoolMap />
        </div>
        <CarpooleeList />
      </Grid>
    </div>
  );
}

export default Carpool;