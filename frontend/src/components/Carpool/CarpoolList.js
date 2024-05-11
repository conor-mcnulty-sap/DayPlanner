import React, { useEffect, useState } from "react";
import {
  Card,
  List,
  StandardListItem,
  CardHeader,
} from "@ui5/webcomponents-react";

function CarpoolList() {
  const [listData, setListData] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/carpools/closestcarpooler?user_id=3`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched Distance: ", data);
        data.sort((a, b) => parseInt(a.distance) - parseInt(b.distance));
        setListData(data);
      })
      .catch((error) => console.log("Fetching Distance failed: ", error));
  }, []);

  return (
    <Card
      header={<CardHeader titleText="Nearest Available People" />}
      style={{ width: "100%" }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
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
          style={{
            width: "100%",
            maxHeight: "50vh",
            margin: "1rem",
            overflow: "auto",
          }}
        >
          {listData.map((item, index) => (
            <StandardListItem key={index} additionalText={item.distance}>
              {item.name}
            </StandardListItem>
          ))}
        </List>
      </div>
    </Card>
  );
}

export default CarpoolList;