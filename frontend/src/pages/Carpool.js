import React from "react";
import CarpooleeForm from "../components/Forms/CarpooleeForm";
import CarpoolerForm from "../components/Forms/CarpoolerForm";
import CarpoolList from "../components/Carpool/CarpoolList";
import { Grid } from "@ui5/webcomponents-react";
import CarpoolMap from "../components/Carpool/CarpoolMap";

function Carpool() {

  return (
    <>
      <Grid defaultSpan="xl6" vSpacing={"5rem"} hSpacing={"5rem"}>
        <CarpooleeForm />
        <CarpoolerForm />
        <CarpoolList />
        <CarpoolMap/>
      </Grid>
    </>
  );
}

export default Carpool;
