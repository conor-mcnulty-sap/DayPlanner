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

function CarpooleeList() {
  const [listData, setListData] = useState([]);
  const [userId, setUserId] = useState("");
  const [selectedEmail, setSelectedEmail] = useState("");
  const [selectedName, setSelectedName] = useState("");
  const [distanceToYou, setDistanceToYou] = useState("");
  const [distanceToOffice, setDistanceToOffice] = useState("");
  const [timeAdded, setTimeAdded] = useState("");
  const popoverRef = useRef();

  useEffect(() => {
    const storedUserDetails = localStorage.getItem("userDetails");
    if (storedUserDetails) {
      const userDetails = JSON.parse(storedUserDetails);
      setUserId(userDetails.id);
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
          data.sort((a, b) => parseInt(a.distance) - parseInt(b.distance));
          return Promise.all(
            data.map((item) =>
              fetchArrivalData(item.carpoolee.users.id).then((arrivalData) => ({
                ...item,
                ...arrivalData,
              }))
            )
          );
        })
        .then((updatedData) => {
          setListData(updatedData);
        })
        .catch((error) => console.log("Fetching Distance failed: ", error));
    }
  }, [userId]);

  const fetchArrivalData = (carpooleeUserId) => {
    return fetch(
      `${process.env.REACT_APP_API_URL}/api/carpools/arrival?carpooler=${userId}&carpoolee=${carpooleeUserId}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then((text) => {
        const [rawDistanceToYou, rawDistanceToOffice, rawTimeAdded] = text
          .split(" ")
          .map(Number);

        if (
          isNaN(rawDistanceToYou) ||
          isNaN(rawDistanceToOffice) ||
          isNaN(rawTimeAdded)
        ) {
          throw new Error("Invalid data format in API response.");
        }

        // Convert minutes to hours and minutes
        const formatTime = (minutes) => {
          const hours = Math.floor(minutes / 60);
          const mins = Math.round(minutes % 60); // Round to nearest minute
          return `${hours} hours ${mins} minutes`;
        };

        const distanceToYou = formatTime(rawDistanceToYou);
        const distanceToOffice = formatTime(rawDistanceToOffice);
        const timeAdded = formatTime(rawTimeAdded);

        return {
          distanceToYou,
          distanceToOffice,
          timeAdded,
        };
      })
      .catch((error) => {
        console.log("Fetching Arrival Data failed:", error);
        return {};
      });
  };

  const handleItemClick = (event, email, name) => {
    setSelectedEmail(email);
    setSelectedName(name);
    popoverRef.current.showAt(event.target);
  };

  const handleClosePopover = () => {
    popoverRef.current.close();
  };

  const handleTeamsChatClick = () => {
    window.open(`msteams:/l/chat/0/0?users=${selectedEmail}`, "_blank");
  };

  const parseTimeAdded = (timeAdded) => {
    const [hours, minutes] = timeAdded
      .replace(" hours", "")
      .replace(" minutes", "")
      .split(" ")
      .map(Number);
    return hours * 60 + minutes;
  };

  const sortedListData = [...listData].sort((a, b) => {
    const timeA = parseTimeAdded(a.timeAdded);
    const timeB = parseTimeAdded(b.timeAdded);
    return timeA - timeB;
  });

  return (
    <Card
      header={<CardHeader titleText="Time added to journey" />}
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
          {sortedListData.map((item, index) => {
            let displayTimeAdded = item.timeAdded
              ? item.timeAdded
              : "Loading...";
            if (displayTimeAdded.startsWith("0 hours")) {
              displayTimeAdded = displayTimeAdded.replace("0 hours ", "");
            }
            return (
              <StandardListItem
                key={index}
                additionalText={displayTimeAdded}
                onClick={(event) =>
                  handleItemClick(
                    event,
                    item.carpoolee.users.email,
                    item.carpoolee.users.name
                  )
                }
              >
                {item.carpoolee.users.name}
              </StandardListItem>
            );
          })}
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
          <Label>
            <strong>Time to Office: </strong>
            {distanceToOffice}
          </Label>
          <Label>
            <strong>Time Added to Journey: </strong>
            {timeAdded}
          </Label>
          <Button design="Emphasized" onClick={handleTeamsChatClick}>
            Chat in Teams
          </Button>
        </div>
      </Popover>
    </Card>
  );
}

export default CarpooleeList;
