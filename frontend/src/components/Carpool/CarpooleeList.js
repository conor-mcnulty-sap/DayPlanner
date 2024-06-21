import React, { useEffect, useState, useRef } from "react";
import {
  Card,
  List,
  StandardListItem,
  CardHeader,
  Popover,
  Label,
  Icon
} from "@ui5/webcomponents-react";
import "@ui5/webcomponents-icons/dist/AllIcons.js";

function CarpooleeList() {
  const [listData, setListData] = useState([]);
  const [userId, setUserId] = useState('');
  const [selectedEmail, setSelectedEmail] = useState('');
  const popoverRef = useRef();

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

  const handleItemClick = (event, email) => {
    setSelectedEmail(email);
    popoverRef.current.showAt(event.target);
  };

  const handleClosePopover = () => {
    popoverRef.current.close();
  };

  const handleTeamsChatClick = () => {
    window.open(`msteams:/l/chat/0/0?users=${selectedEmail}`, '_blank');
  };

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
          separators="All"
          style={{
            width: "100%",
            maxHeight: "50vh",
            margin: "1rem",
            overflow: "auto",
          }}
        >
          {listData.map((item, index) => (
            <StandardListItem
              key={index}
              additionalText={`${item.distance} km`}
              onClick={(event) => handleItemClick(event, item.carpoolee.users.email)}
            >
              {item.carpoolee.users.name}
            </StandardListItem>
          ))}
        </List>
      </div>
      <Popover
        ref={popoverRef}
        headerText="Contact"
        horizontalAlign="Center"
        verticalAlign="Center"
        placementType="Bottom"
        onAfterClose={handleClosePopover}
      >
        <Label>
          <a href={`mailto:${selectedEmail}`}>{selectedEmail}</a>
        </Label>
        <Icon
          name="sap-icon://message-popup"
          style={{
            position: "absolute",
            right: "10px",
            top: "15%",
            cursor: "pointer",
          }}
          onClick={handleTeamsChatClick}
        />
      </Popover>
    </Card>
  );
}

export default CarpooleeList;