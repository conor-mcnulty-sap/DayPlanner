import React, { useEffect, useRef } from "react";
import { List, StandardListItem } from "@ui5/webcomponents-react";

export function CarpoolList() {
  return (
    <List
      growing="None"
      headerText="Nearest available people"
      mode="None"
      onItemClick={function _a() {}}
      onItemClose={function _a() {}}
      onItemDelete={function _a() {}}
      onItemToggle={function _a() {}}
      onLoadMore={function _a() {}}
      onSelectionChange={function _a() {}}
      separators="All"
      style={
        {
          alignItems: "center",
          width: "20rem",
          height: "20rem",
          paddingLeft: "15rem",
          margin: "1rem",
        }
      }
    >
      <StandardListItem additionalText="10m away">John Joe</StandardListItem>
      <StandardListItem additionalText="9m away">Joe John</StandardListItem>
      <StandardListItem additionalText="8m away">JJ</StandardListItem>
    </List>
  );
}
