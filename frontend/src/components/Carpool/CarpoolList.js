import React, { useEffect, useState } from "react";
import { List, StandardListItem } from "@ui5/webcomponents-react";

export function CarpoolList() {
  const [listData, setListData] = useState([]);

  useEffect(() => {
    fetch('/carpoolDistance.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Fetched Distance: ', data);
        data.sort((a, b) => parseInt(a.distance) - parseInt(b.distance));
        setListData(data);
      })
      .catch(error => console.log('Fetching Distance failed: ', error));
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <h2>Nearest available people</h2>
      <List
        growing="None"
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
            width: "20rem",
            height: "20rem",
            margin: "1rem",
            overflow: "auto"
          }
        }
      >
        {listData.map((item, index) => (
          <StandardListItem key={index} additionalText={item.distance}>{item.name}</StandardListItem>
        ))}
      </List>
    </div>
  );
}