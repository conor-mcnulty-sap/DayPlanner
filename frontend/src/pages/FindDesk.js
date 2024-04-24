import React from "react";
import { Grid} from "@ui5/webcomponents-react";
import Map from "../components/FindDesk/Map";
import { DeskForm } from "../components/BookDesk/DeskForm";
function FindDesk() {

  return (
    <Grid defaultSpan="xl6" vSpacing={"20rem"} hSpacing={"10rem"}>
      <DeskForm/>
      <Map/>
      </Grid>
      
  )
}

export default FindDesk;