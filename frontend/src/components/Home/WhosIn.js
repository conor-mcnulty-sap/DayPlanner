import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  List,
  StandardListItem,
  Input,
  CheckBox
} from "@ui5/webcomponents-react";

const WhosIn = () => {
  const [users, setUsers] = useState([]);
  const [foundUsers, setFoundUsers] = useState([]);
  const [isCheckboxTicked, setIsCheckboxTicked] = useState('false');
  const [userId, setUserId] = useState("");
  const [error, setError] = useState(null);

  console.log(isCheckboxTicked);
  useEffect(() => {
    const today = new Date();
    const date = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

    /**
     * Retrieves the floor number from the localStorage deskId.
     * @returns {string|null} The floor number or null if deskId is not found in localStorage.
     */
    const getFloor = () => {
      if(localStorage.getItem('deskId') !== null) {
        return localStorage.getItem('deskId').slice(0, 9);
      }
      return null;
    }

    const floor = getFloor();

    fetch(`${process.env.REACT_APP_API_URL}/api/bookings/bookingsbydate?date=${date}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        let filteredData;
        if (floor) {
          filteredData = data.filter(user => user.desk_id.startsWith(floor));
        } else {
          // If floor is null, don't apply the filter and use all data
          filteredData = data;
        }
        setUsers(filteredData);
        setFoundUsers(filteredData);
        console.log("Who's in:", filteredData);
      })
      .catch((error) => console.log("Fetching failed: ", error));
  }, []);

  /**
   * Filters the users based on the provided keyword and updates the foundUsers state.
   * @param {Event} e - The event object triggered by the input change.
   */
  const filter = (event) => {
    const keyword = event.target.value;
    console.log(isCheckboxTicked);
    if (!isCheckboxTicked) { // Only filter if checkbox is not ticked
      if (keyword !== "") {
        const results = users.filter((user) => {
          return user.users.name.toLowerCase().startsWith(keyword.toLowerCase());
        });
        setFoundUsers(results);
      } else {
        setFoundUsers(users);
      }
    } else {
      setFoundUsers(users);
    }
  };

  return (
    <Card
      header={<CardHeader titleText="Who's In?" />}
      style={{ width: "100%", maxHeight: "50vh"}}
    >
      <div style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
        <CheckBox onChange={(e) => setIsCheckboxTicked('true')}></CheckBox>
        <span style={{ marginLeft: "0.5rem" }}>Filter to your floor</span>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Input
          placeholder="Search..."
          onChange={filter}
          style={{ marginBottom: "1rem", marginTop: "1rem" }}
        />

        <List
          style={{
            width: "100%",
            maxHeight: "50vh",
            overflowY: "auto",
          }}
        >
          {foundUsers.map((user) => (
            <StandardListItem key={user.id}>
              {user.desk_id} - {user.users.name}
              <br />
              {user.desk}
            </StandardListItem>
          ))}
        </List>
      </div>
    </Card>
  );
};
export default WhosIn;