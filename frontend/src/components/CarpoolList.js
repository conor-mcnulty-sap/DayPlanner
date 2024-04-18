import React, { useEffect, useRef } from "react";
import { List, StandardListItem } from "@ui5/webcomponents-react";

export function CarpoolList() {
  return (
    <List
      growing="None"
      headerText="Nearest lifts available"
      mode="None"
      onItemClick={function _a() {}}
      onItemClose={function _a() {}}
      onItemDelete={function _a() {}}
      onItemToggle={function _a() {}}
      onLoadMore={function _a() {}}
      onSelectionChange={function _a() {}}
      separators="All"
    >
      <StandardListItem additionalText="3">
        John Joe - 10m away
      </StandardListItem>
      <StandardListItem additionalText="2">Joe John - 9m away</StandardListItem>
      <StandardListItem additionalText="1">JJ - 8m away</StandardListItem>
    </List>
  );
}
