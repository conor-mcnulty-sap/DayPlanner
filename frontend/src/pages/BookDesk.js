import React from "react";
import Map from "../components/BookDesk/Map";
import {DeskForm}  from "../components/BookDesk/DeskForm";
import { Grid } from "@ui5/webcomponents-react";

function BookDesk() {

  return (
    <Grid defaultSpan="XL6 L12 M12 S12" vSpacing="1rem" hSpacing="1rem">
      <DeskForm/>
      <Map/>
    </Grid>
  )
}
export default BookDesk;