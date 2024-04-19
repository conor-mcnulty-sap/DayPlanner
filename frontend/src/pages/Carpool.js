import React from "react";
import { CarpooleeForm } from "../components/Carpool/CarpooleeForm";
import { CarpoolerForm } from "../components/Carpool/CarpoolerForm";
import { CarpoolList } from "../components/Carpool/CarpoolList";
import { Grid } from "@ui5/webcomponents-react";

function Carpool() {

  return (
    <>
      <Grid defaultSpan="xl6" vSpacing={"20rem"}>
        <CarpooleeForm />
        <CarpoolerForm />
        <CarpoolList />
      </Grid>
    </>
  );
}

export default Carpool;
