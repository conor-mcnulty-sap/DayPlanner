import React from "react";
import CarpooleeForm from "../components/Forms/CarpooleeForm";
import CarpoolerForm from "../components/Forms/CarpoolerForm";
import CarpoolList from "../components/Carpool/CarpoolList";
import { Grid } from "@ui5/webcomponents-react";
import CarpoolMap from "../components/Carpool/CarpoolMap";

function Carpool() {
  return (
    <>
      <Grid
        defaultSpan="xl6 l6 m6 s12"
        vSpacing={"5rem"}
        hSpacing={"5rem"}
        style={{ margin: "2rem" }}
      >
        <CarpooleeForm />
        <CarpoolerForm />
        <CarpoolList />
        <CarpoolMap />
      </Grid>
    </>
  );
}

export default Carpool;
