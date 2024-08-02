import React, { useEffect, useState, useRef } from "react";
import {
  Card,
  List,
  StandardListItem,
  CardHeader,
  Popover,
  Label,
  Button,
} from "@ui5/webcomponents-react";
import "@ui5/webcomponents-icons/dist/AllIcons.js";

function CarpoolList() {
  const [listData, setListData] = useState([]);
  const [userId, setUserId] = useState("");
  const [selectedEmail, setSelectedEmail] = useState("");
  const [selectedName, setSelectedName] = useState("");
  const [distanceToYou, setDistanceToYou] = useState("");
  const [distanceToOffice, setDistanceToOffice] = useState("");
  const [timeAdded, setTimeAdded] = useState("");
  const [arrivalData, setArrivalData] = useState([]);
  const popoverRef = useRef();

  useEffect(() => {
    const storedUserDetails = localStorage.getItem("userDetails");
    if (storedUserDetails) {
      const userDetails = JSON.parse(storedUserDetails);
      setUserId(userDetails.id);
      console.log("User ID:", userDetails.id);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      console.log("Fetching closest carpoolers for user ID:", userId);
      fetch(
        `${process.env.REACT_APP_API_URL}/api/carpools/closestcarpooler?user_id=${userId}`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log("Fetched Data:", data);
          data.sort((a, b) => parseInt(a.distance) - parseInt(b.distance));
          setListData(data);

          // Fetch arrival data for each carpooler
          data.forEach((item) =>
            fetchArrivalData(item.carpooler.users.id, userId)
          );
        })
        .catch((error) => console.log("Fetching Distance failed:", error));
    }
  }, [userId]);

  const fetchArrivalData = (carpoolerUserId, carpooleeUserId) => {
    console.log(
      `Fetching arrival data for carpooler user_id: ${carpoolerUserId} and carpoolee user_id: ${carpooleeUserId}`
    );

    fetch(
      `${process.env.REACT_APP_API_URL}/api/carpools/arrival?carpooler=${carpoolerUserId}&carpoolee=${carpooleeUserId}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text(); // Get response as text
      })
      .then((text) => {
        console.log("Arrival Data Response:", text);

        // Split the response text by spaces and parse as floats
        const [DistanceToYou, DistanceToOffice, TimeAdded] = text
          .split(" ")
          .map(Number);

        if (
          isNaN(DistanceToYou) ||
          isNaN(DistanceToOffice) ||
          isNaN(TimeAdded)
        ) {
          throw new Error("Invalid data format in API response.");
        }

        // Convert minutes to hours and minutes
        const formatTime = (minutes) => {
          const hours = Math.floor(minutes / 60);
          const mins = Math.round(minutes % 60); // Round to nearest minute
          if (hours < 0) {
            return `${mins} minutes`;
          }
          return `${hours} hours ${mins} minutes`;
        };

        const distanceToYou = formatTime(DistanceToYou);
        const distanceToOffice = formatTime(DistanceToOffice);
        const timeAdded = formatTime(TimeAdded);
        
        setArrivalData((prevData) => [
          ...prevData,
          { carpoolerUserId, distanceToYou, distanceToOffice, timeAdded },
        ]);
      })
      .catch((error) => console.log("Fetching Arrival Data failed:", error));
  };

  const handleItemClick = (event, item) => {
    setSelectedEmail(item.carpooler.users.email);
    setSelectedName(item.carpooler.users.name);

    const arrivalInfo = arrivalData.find(
      (arrival) => arrival.carpoolerUserId === item.carpooler.users.id
    );

    // Display the converted time values
    console.log("Arrival Info for Clicked Item:", arrivalInfo);

    setDistanceToYou(arrivalInfo ? `${arrivalInfo.distanceToYou}` : "N/A");
    setDistanceToOffice(
      arrivalInfo ? `${arrivalInfo.distanceToOffice}` : "N/A"
    );
    setTimeAdded(arrivalInfo ? `${arrivalInfo.timeAdded}` : "N/A");

    console.log("Displayed Distance to You:", distanceToYou);
    console.log("Displayed Distance to Office:", distanceToOffice);
    console.log("Displayed Time Added:", timeAdded);

    popoverRef.current.showAt(event.target);
  };

  const handleClosePopover = () => {
    popoverRef.current.close();
  };

  const handleTeamsChatClick = () => {
    window.open(`msteams:/l/chat/0/0?users=${selectedEmail}`, "_blank");
  };

  return (
    <Card header={<CardHeader titleText="Carpool" />} style={{ width: "100%" }}>
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
              onClick={(event) => handleItemClick(event, item)}
            >
              {item.carpooler.users.name}
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
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            padding: "1rem",
          }}
        >
          <Label>
            <strong>Name: </strong>
            {selectedName}
          </Label>
          <Label>
            <strong>Email: </strong>
            <a href={`mailto:${selectedEmail}`}>{selectedEmail}</a>
          </Label>
          <Button design="Emphasized" onClick={handleTeamsChatClick}>
            Chat in Teams
          </Button>
        </div>
      </Popover>
    </Card>
  );
}

export default CarpoolList;