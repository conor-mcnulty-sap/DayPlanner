import React from "react";
import { CarpooleeForm } from "../components/Carpool/CarpooleeForm";
import { CarpoolerForm } from "../components/Carpool/CarpoolerForm";
import { CarpoolList } from "../components/Carpool/CarpoolList";
import { Grid } from "@ui5/webcomponents-react";
import CarpoolMap from "../components/Carpool/CarpoolMap";

function Carpool() {

  return (
    <>
      <Grid defaultSpan="xl6" vSpacing={"20rem"} hSpacing={"10rem"}>
        <CarpooleeForm />
        <CarpoolerForm />
        <CarpoolList />
        <CarpoolMap/>
      </Grid>
    </>
  );
}

export default Carpool;
