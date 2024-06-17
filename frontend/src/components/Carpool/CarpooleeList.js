import React, { useEffect, useState } from "react";
import {
  Card,
  List,
  StandardListItem,
  CardHeader,
} from "@ui5/webcomponents-react";
 
function CarpooleeList() {
  const [listData, setListData] = useState([]);
  const [userId, setUserId] = useState('');


  useEffect(() => {
    const storedUserDetails = localStorage.getItem('userDetails');
    if (storedUserDetails) {
      const userDetails = JSON.parse(storedUserDetails);
      setUserId(userDetails.id);
      console.log("User ID:", userDetails.id);
    }
  }, []);

 
  useEffect(() => {
    if (userId) {
      fetch(
        `${process.env.REACT_APP_API_URL}/api/carpools/closestcarpoolee?user_id=${userId}`
      )
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
    }
  }, [userId]);
  
 
  return (
    <Card
      header={<CardHeader titleText="Looking for" />}
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
            <StandardListItem key={index} additionalText={`${item.distance} km`}>
              {item.carpoolee.users.name} - {item.carpoolee.users.email}
            </StandardListItem>
          ))}
        </List>
      </div>
    </Card>
  );
}
 
export default CarpooleeList;
 