import React from "react";
import { Grid} from "@ui5/webcomponents-react";
import Map from "../components/FindDesk/Map";
import { DeskForm } from "../components/BookDesk/DeskForm";
function FindDesk() {

  return (
    <Grid defaultSpan="XL6 L12 M12 S12" vSpacing={"1rem"} hSpacing={"1rem"}>
      <DeskForm/>
      <Map/>
      </Grid>
      
  )
}

export default FindDesk;