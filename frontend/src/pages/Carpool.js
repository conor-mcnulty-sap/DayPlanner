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
      margin: "2rem auto 4rem auto", // Center the content
      width: "90%", // Adjust the width of the page
      alignItems: "start", // Align items to the start
    }}
  >
      <Grid
        defaultSpan="xl6 l6 m6 s12"
        vSpacing={"2rem"}
        hSpacing={"2rem"}
        style={{ margin: "2rem" }}
      >
        <CarpooleeForm />
        <CarpoolerForm />
        <CarpooleeList/>
        <CarpoolList />
        <CarpoolMap />
      </Grid>
    </div>
  );
}

export default Carpool;
