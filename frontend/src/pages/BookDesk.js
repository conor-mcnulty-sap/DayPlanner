import React from "react";
import Map from "../components/BookDesk/Map";
import {DeskForm}  from "../components/BookDesk/DeskForm";
import { Grid } from "@ui5/webcomponents-react";

function BookDesk() {

  return (
    <Grid defaultSpan="xl6" vSpacing={"20rem"} hSpacing={"10rem"}>
      <DeskForm/>
      <Map/>
      </Grid>
      
  )
}
export default BookDesk;